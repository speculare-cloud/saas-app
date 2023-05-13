<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<LineChart :chartdata="datacollection" :chartseries="chartSeries" :unit="unit" />
	</div>
</template>

<script>
import { nextTick } from 'vue'
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph, getRangeParams } from '@/utils/graphsData'
import { series } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import LineChart from '@/components/Graphs/Base/LineChart'
import moment from 'moment'

const BYTES_TO_MB = 1000000

export default {
	name: 'Ioblocks',
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
			groupedSkip: 0,
			table: 'ioblocks',
			unit: 'MB/s',
			connection: null,
			fetchingDone: false,
			datacollection: null,
			loadingMessage: 'Loading',
			chartSeries: [
				{},
				{...series(0, false), label: 'read'},
				{...series(1, false), label: 'write'},
			],
			wsBuffer: [],
			chartLabels: [],
			chartDataObjRead: [],
			chartDataObjWrite: [],
			historyDataDate: [],
			historyDataRead: [],
			historyDataWrite: [],
			bufferDataWs: [],
			obs: null
		}
	},

	watch: {
		graphRange: function (newVal, oldVal) {
			// true is to tell the fetchInit to handle as grouped values
			rebuildGraph(this, newVal, oldVal, true)
		}
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(() => {
			// Await the first call to ioblocks/count cause it's needed for the next
			vm.$http
				.get(vm.$serverBase(vm.$route.params.berta) + "/api/ioblocks/count?uuid=" + vm.uuid + getRangeParams(vm.graphRange))
				.then(resp => (vm.groupedSkip = resp.data))
				.catch(err => {
					console.log('[ionets] Failed to fetch number of disks', err)
				})
			// Setup the IntersectionObserver
			// true is to tell the fetchInit to handle as grouped values
			vm.obs = graphScrollObs(vm, true)
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
			this.chartDataObjRead = []
			this.chartDataObjWrite = []
			this.historyDataDate = []
			this.historyDataRead = []
			this.historyDataWrite = []
			this.bufferDataWs = []
			this.wsBuffer = []

			if (ws) {
				closeWS(this.table, this)
			}
		},
		// Null the data of an index (without nulling the Labels)
		nullData: function (i) {
			this.chartDataObjRead[i] = null
			this.chartDataObjWrite[i] = null
			this.historyDataDate[i] = null
			this.historyDataRead[i] = null
			this.historyDataWrite[i] = null
		},
		// Remove nb index from each data arrays starting from start
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjRead.splice(start, nb)
			this.chartDataObjWrite.splice(start, nb)
			this.historyDataDate.splice(start, nb)
			this.historyDataRead.splice(start, nb)
			this.historyDataWrite.splice(start, nb)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, read, write, histRead, histWrite) {
			this.chartLabels.push(date)
			// If scale != default, should divide the values by granularity (at least for the graph)
			// That is because if we don't do it, we get MB/granularity, so to get MB/s we devide by the granularity
			if (this.graphRange.scale !== 300) {
				if (read != null) read = read / this.graphRange.granularity
				if (write != null) write = write / this.graphRange.granularity
			}
			this.chartDataObjRead.push(read)
			this.chartDataObjWrite.push(write)
			this.historyDataDate.push(date)
			this.historyDataRead.push(histRead)
			this.historyDataWrite.push(histWrite)
		},
		// Add a null first item with the specified date
		unshiftEmpty: function (date) {
			this.chartLabels.unshift(date)
			this.chartDataObjRead.unshift(null)
			this.chartDataObjWrite.unshift(null)
			this.historyDataDate.unshift(null)
			this.historyDataRead.unshift(null)
			this.historyDataWrite.unshift(null)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data)
			const obj = {
				read_bytes: json.columnvalues[3],
				write_bytes: json.columnvalues[5],
				created_at: json.columnvalues[8],
			}

			// Create a buffer of values due to WS sending one event by one event
			// - and as multiple disks as the same time...
			this.bufferDataWs.push(obj)
			if (this.fetchingDone && this.bufferDataWs.length === this.groupedSkip) {
				// Add the new data to the graph
				this.addNewData(this.bufferDataWs, true)
				this.bufferDataWs = []
			} else if (!this.fetchingDone && this.bufferDataWs.length === this.groupedSkip) {
				// Add the value to the wsBuffer
				console.log('[' + this.table + '] >> Adding value to the wsBuffer (WS opened but fetching not done yet)')
				this.wsBuffer.push(obj)
				// Clear the array
				this.bufferDataWs = []
			}
		},
		addNewData: function (elem, update=false) {
			const vm = this
			let total_read = 0
			let total_write = 0
			// Compute total read and write from all disks
			for (let i = 0; i < elem.length; i++) {
				total_read += elem[i].read_bytes
				total_write += elem[i].write_bytes
			}
			const currDate = moment.utc(elem[0].created_at).unix();
			const { read, write } = this.getReadWriteFrom(currDate, total_read, total_write)
			// Add the new value to the Array
			vm.pushValue(currDate, read, write, total_read, total_write)

			// Update onscreen values
			if (update) {
				updateGraph(vm, function () {
					vm.datacollection = [
						vm.chartLabels,
						vm.chartDataObjRead,
						vm.chartDataObjWrite
					]
				})
			}
		},
		getReadWriteFrom: function (currDate, total_read, total_write) {
			let read = null
			let write = null
			// If the previous does not exist, we can't compute the percent
			const prevIndex = this.chartLabels.length - 1
			if (this.historyDataRead[prevIndex] != null && this.historyDataDate[prevIndex] >= currDate - (this.graphRange.scale / 60 + 15)) {
				// Elapsed is used to work around the network latency and keep a correct scale
				// - the time between two data point can be greater than the harvest time configured,
				//   thus falsing the scale. Dividing by the diff can fix this.
				const elapsed = currDate - this.chartLabels[prevIndex]
				// Get the previous values
				const prevRead = this.historyDataRead[prevIndex]
				const prevWrite = this.historyDataWrite[prevIndex]
				// TODO - Auto scale to kb/mb/gb depending on the values
				read = ((total_read - prevRead) / BYTES_TO_MB) / elapsed
				write = -((total_write - prevWrite) / BYTES_TO_MB) / elapsed
			}
			return { read, write }
		},
	}
}
</script>
