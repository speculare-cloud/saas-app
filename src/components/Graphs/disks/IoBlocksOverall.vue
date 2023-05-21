<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<LineChart :chartdata="datacollection" :chartseries="chartSeries!" :unit="unit" />
	</div>
</template>

<script lang="ts">
import LineChart from '@/components/Graphs/Base/LineChart.vue'

import { nextTick } from 'vue'
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph, getRangeParams } from '@/utils/graphsData'
import { series } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import { opt, optUn } from '@/utils/help'
import type { IoBlock } from '@martichou/sproot'
import { DateTime } from 'luxon'

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
			groupedSkip: 1,
			table: 'ioblocks',
			unit: 'MB/s',
			fetchingDone: false,
			loadingMessage: 'Loading',
			chartSeries: opt<{}[]>(),
			connection: opt<WebSocket>(),
			datacollection: optUn<(number | null)[][]>(),
			wsBuffer: new Array<IoBlock>(),
			chartLabels: new Array<number>(),
			chartDataObjRead: new Array<number | null>(),
			chartDataObjWrite: new Array<number | null>(),
			historyDataDate: new Array<number | null>(),
			historyDataRead: new Array<number | null>(),
			historyDataWrite: new Array<number | null>(),
			bufferDataWs: new Array<IoBlock>(),
			obs: opt<IntersectionObserver>()
		}
	},

	watch: {
		graphRange: async function (newVal, oldVal) {
			await this.refreshCount();
			// Rebuild the series with the new threshold
			this.buildSeries();
			// true is to tell the fetchInit to handle as grouped values
			rebuildGraph(this, newVal, oldVal, true)
		}
	},

	beforeMount: function() {
		this.buildSeries();
	},

	mounted: function () {
		const vm = this

		// Don't setup anything before everything is rendered
		nextTick(async () => {
			// Await the first call to ioblocks/count cause it's needed for the next
			await vm.refreshCount();
			// Setup the IntersectionObserver
			// true is to tell the fetchInit to handle as grouped values
			vm.obs = graphScrollObs(vm, true)
			// Observe the element
			vm.obs.observe(vm.$el)
		})
	},

	beforeUnmount: function () {
		// Stop the Observation of the element
		this.obs?.unobserve(this.$el)
		// Close the webSocket connection
		this.cleaning()
	},

	methods: {
		// Refresh the number of ioblocks there is for the current rangeParams
		refreshCount: async function() {
			await this.$http
				.get(this.$serverBase(this.$route.params.berta) + "/api/ioblocks/count?uuid=" + this.uuid + getRangeParams(this.graphRange))
				.then(resp => this.groupedSkip = Math.max(1, resp.data))
				.catch(err => {
					console.log('[ionets] Failed to fetch number of disks', err)
				})
		},
		buildSeries: function() {
			const threshold = this.getThreshold();
			this.chartSeries = [
				{},
				{...series(0, threshold, false), label: 'read'},
				{...series(1, threshold, false), label: 'write'},
			]
		},
		getThreshold: function() {
			let threshold;
			if (this.graphRange.granularity > 60) {
				threshold = this.graphRange.scale < 345600 ? 600 : 1800
			} else {
				threshold = this.graphRange.scale / 60 + this.graphRange.granularity
			}
			// Threshold within 5% of the value we should have
			threshold += (5 / 100) * threshold

			return threshold;
		},
		// Empty every arrays and close the websocket
		cleaning: function (ws = true) {
			console.log('[' + this.table + '] cleaning called')
			this.fetchingDone = false
			this.chartLabels = []
			this.chartDataObjRead = []
			this.chartDataObjWrite = []
			this.historyDataDate = []
			this.historyDataRead = []
			this.historyDataWrite = []
			this.bufferDataWs = []
			this.wsBuffer = []

			if (ws) closeWS(this.table, this)
		},
		swapItem: function(idxA, idxB) {
			this.chartLabels[idxA] = this.chartLabels.splice(idxB, 1, this.chartLabels[idxA])[0];
			this.chartDataObjRead[idxA] = this.chartDataObjRead.splice(idxB, 1, this.chartDataObjRead[idxA])[0];
			this.chartDataObjWrite[idxA] = this.chartDataObjWrite.splice(idxB, 1, this.chartDataObjWrite[idxA])[0];
			this.historyDataDate[idxA] = this.historyDataDate.splice(idxB, 1, this.historyDataDate[idxA])[0];
			this.historyDataRead[idxA] = this.historyDataRead.splice(idxB, 1, this.historyDataRead[idxA])[0];
			this.historyDataWrite[idxA] = this.historyDataWrite.splice(idxB, 1, this.historyDataWrite[idxA])[0];
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
		spliceNull: function(start, date) {
			this.chartLabels.splice(start, 0, date)
			this.chartDataObjRead.splice(start, 0, null)
			this.chartDataObjWrite.splice(start, 0, null)
			this.historyDataDate.splice(start, 0, date)
			this.historyDataRead.splice(start, 0, null)
			this.historyDataWrite.splice(start, 0, null)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, read = opt<number>(), write = opt<number>(), histRead = opt<number>(), histWrite = opt<number>()) {
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
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const obj: IoBlock = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as IoBlock;
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
		addNewData: function (elem: Array<IoBlock>, update=false) {
			const vm = this
			let total_read = 0
			let total_write = 0
			// Compute total read and write from all disks
			for (let i = 0; i < elem.length; i++) {
				total_read += Number(elem[i].read_bytes)
				total_write += Number(elem[i].write_bytes)
			}

			// Construct the date
			let date = DateTime.fromISO(elem[0].created_at, {zone: "utc"})
			if (!date.isValid) date = DateTime.fromFormat(elem[0].created_at, "yyyy-MM-dd HH:mm:ss.u", {zone: "utc"})
			let currDate = date.toUnixInteger();

			const { read, write } = this.getReadWriteFrom(currDate, total_read, total_write)
			// Add the new value to the Array
			vm.pushValue(currDate, read, write, total_read, total_write)

			// Update onscreen values
			if (update) {
				console.log('[' + this.table + '] updating value on graph')
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
			let read = opt<number>()
			let write = opt<number>()
			// If the previous does not exist, we can't compute the percent
			const prevIndex = this.chartLabels.length - 1
			if (this.historyDataRead[prevIndex] != null && this.historyDataDate[prevIndex] as number >= currDate - this.getThreshold()) {
				// Elapsed is used to work around the network latency and keep a correct scale
				// - the time between two data point can be greater than the harvest time configured,
				//   thus falsing the scale. Dividing by the diff can fix this.
				const elapsed = currDate - this.chartLabels[prevIndex]
				// Get the previous values
				const prevRead = this.historyDataRead[prevIndex] ?? 0
				const prevWrite = this.historyDataWrite[prevIndex] ?? 0
				// TODO - Auto scale to kb/mb/gb depending on the values
				read = ((total_read - prevRead) / BYTES_TO_MB) / elapsed
				write = -((total_write - prevWrite) / BYTES_TO_MB) / elapsed
			}
			return { read, write }
		},
	}
}
</script>
