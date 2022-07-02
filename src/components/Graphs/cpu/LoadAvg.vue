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
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph } from '@/utils/graphsData'
import { series } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
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
			table: 'loadavg',
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
			rebuildGraph(this, newVal, oldVal)
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(() => {
			// Setup the IntersectionObserver
			vm.obs = graphScrollObs(vm)
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
		// Empty every arrays and close the websocket
		cleaning: function (ws = true) {
			this.fetchingDone = false
			this.chartLabels = []
			this.chartDataObjOne = []
			this.chartDataObjFive = []
			this.chartDataObjFitheen = []
			this.wsBuffer = []

			if (ws) {
				closeWS(this.table, this)
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
			const obj = {
				one: json.columnvalues[1],
				five: json.columnvalues[2],
				fifteen: json.columnvalues[3],
				created_at: json.columnvalues[5],
			}

			if (this.fetchingDone) {
				// Add the new data to the graph
				this.addNewData(obj, true)
			} else {
				// Add the value to the wsBuffer
				console.log('[' + this.table + '] >> Adding value to the wsBuffer (WS opened but fetching not done yet)')
				this.wsBuffer.push(obj)
			}
		},
		addNewData: function (elem, update=false) {
			const vm = this
			// Add the new value to the Array
			vm.pushValue(moment.utc(elem.created_at).unix(), elem.one, elem.five, elem.fifteen)

			// Update onscreen values
			if (update) {
				updateGraph(vm, function() { vm.datacollection = [vm.chartLabels, vm.chartDataObjOne, vm.chartDataObjFive, vm.chartDataObjFitheen] })
			}
		}
	}
}
</script>
