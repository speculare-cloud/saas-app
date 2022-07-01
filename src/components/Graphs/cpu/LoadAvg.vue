<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<LineChart :chartdata="datacollection" :chartseries="chartSeries" :unit="unit" :yscale="yscale" />
	</div>
</template>

<script>
import { nextTick } from 'vue'
import { graphScrollObs, updateGraph, rebuildGraph, getRangeParams } from '@/utils/graphs'
import { series } from '@/utils/graphsCharts'
import { initWS, closeWS } from '@/utils/websockets'
import LineChart from '@/components/Graphs/Base/LineChart'
import moment from 'moment'

export default {
	name: 'Loadavg',
	components: {
		LineChart
	},
	props: {
		berta: {
			type: String,
			required: true
		},
		uuid: {
			type: String,
			required: true
		},
		graphRange: {
			type: Object,
			default: null
		}
	},

	data () {
		return {
			unit: 'load',
			yscale: null,
			connection: null,
			fetchingDone: false,
			datacollection: null,
			loadingMessage: 'Loading',
			chartSeries: [
				{},
				{...series(0, true), label: 'load1'},
				{...series(1, true), label: 'load5'},
				{...series(2, true), label: 'load15'},
			],
			wsBuffer: [],
			chartLabels: [],
			chartDataObjOne: [],
			chartDataObjFive: [],
			chartDataObjFitheen: [],
			obs: null
		}
	},

	watch: {
		graphRange: function (newVal, oldVal) {
			console.log('[loadavg] graphRange changed')
			rebuildGraph(newVal, oldVal, this.cleaning, this.fetching, this.openSpecificWS, this.connection === null)
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(() => {
			// Setup the IntersectionObserver
			vm.obs = graphScrollObs(vm.openSpecificWS, vm.cleaning)
			// Observe the element
			vm.obs.observe(vm.$el)
		})
	},

	beforeUnmount: function () {
		// Stop the Observation of the element
		this.obs.unobserve(this.$el)
		// Close the webSocket connection
		this.cleaning()
	},

	methods: {
		// Open the WS if needed (if the scale is not 300, it means we're in the past)
		openSpecificWS: function() {
			if (this.graphRange.scale !== 300) {
				return this.fetchInit();
			}
			initWS(this.$cdcBase(this.berta), 'loadavg', 'insert', ':host_uuid.eq.' + this.uuid, true, this)
		},
		// Function responsible to init the fetching data and the websocket connection
		fetchInit: function () {
			const vm = this

			// Fetching old data with the API
			vm.$http
				.get(vm.$serverBase(vm.$route.params.berta) + "/api/loadavg?uuid=" + vm.uuid + getRangeParams(vm.graphRange))
				.then(resp => {
					const dataLength = resp.data.length
					// Add data in reverse order (push_back) and uPlot use last as most recent
					for (let i = dataLength - 1; i >= 0; i--) {
						vm.fastAddNewData(resp.data[i])
					}

					// If data has been received, we drain the wsBuffer
					vm.drainWsBuffer()
					// Define the fetching as done
					vm.fetchingDone = true
					// Clear the wsBuffer
					vm.wsBuffer = []
				})
				.catch(error => {
					console.log('[loadavg] Failed to fetch previous data', error)
				}).finally(() => {
					vm.loadingMessage = 'No Data'
				})
		},
		drainWsBuffer: function() {
			const vm = this;
			// If there is data in wsBuffer we merge the data
			const wsBuffSize = vm.wsBuffer.length
			if (wsBuffSize > 0) {
				console.log('[loadavg] >>> Merging wsBuffer with already added data')
				for (let i = 0; i <= wsBuffSize - 1; i++) {
					const currItem = vm.wsBuffer[i]
					const date = moment.utc(currItem[5]).unix()
					// If the current latest date is lower than the date in the buffer
					if (vm.chartLabels[vm.chartLabels.length - 1] < date) {
						console.log('[loadavg] >>>> Adding value to the end of the buffer')
						// Add the new value to the Array
						vm.pushValue(date, currItem[1], currItem[2], currItem[3])
					}
				}
			}

			// Update onscreen values
			updateGraph(vm, function() { vm.datacollection = [vm.chartLabels, vm.chartDataObjOne, vm.chartDataObjFive, vm.chartDataObjFitheen] })
		},
		// Empty every arrays and close the websocket
		cleaning: function (ws = true) {
			this.fetchingDone = false
			this.chartLabels = []
			this.chartDataObjOne = []
			this.chartDataObjFive = []
			this.chartDataObjFitheen = []
			this.wsBuffer = []

			if (ws) {
				closeWS('loadavg', this)
			}
		},
		// Null the data of an index (without nulling the Labels)
		nullData: function (i) {
			this.chartDataObjOne[i] = null
			this.chartDataObjFive[i] = null
			this.chartDataObjFitheen[i] = null
		},
		// Remove nb index from each data arrays starting from start
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjOne.splice(start, nb)
			this.chartDataObjFive.splice(start, nb)
			this.chartDataObjFitheen.splice(start, nb)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, one, five, fith) {
			this.chartLabels.push(date)
			this.chartDataObjOne.push(Math.round(one * 100) / 100)
			this.chartDataObjFive.push(Math.round(five * 100) / 100)
			this.chartDataObjFitheen.push(Math.round(fith * 100) / 100)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data)
			const newValues = json.columnvalues

			if (this.fetchingDone) {
				// Add the new data to the graph
				this.addNewData(newValues)
			} else {
				// Add the value to the wsBuffer
				console.log('[loadavg] >> Adding value to the wsBuffer (WS opened but fetching not done yet)')
				this.wsBuffer.push(newValues)
			}
		},
		fastAddNewData: function (elem) {
			// Add the new value to the Array
			this.pushValue(moment.utc(elem.created_at).unix(), elem.one, elem.five, elem.fifteen)
		},
		addNewData: function (newValues) {
			const vm = this
			// Add the new value to the Array
			vm.pushValue(moment.utc(newValues[5]).unix(), newValues[1], newValues[2], newValues[3])

			// Update onscreen values
			updateGraph(vm, function() { vm.datacollection = [vm.chartLabels, vm.chartDataObjOne, vm.chartDataObjFive, vm.chartDataObjFitheen] })
		}
	}
}
</script>
