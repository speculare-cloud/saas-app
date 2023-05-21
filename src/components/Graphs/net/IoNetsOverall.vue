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
import type { IoNet } from '@martichou/sproot'
import { opt, optUn } from '@/utils/help'
import { DateTime } from 'luxon'

const BYTES_TO_MB = 1000000

export default {
	name: 'Ionets',
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
			table: 'ionets',
			unit: 'MB/s',
			fetchingDone: false,
			loadingMessage: 'Loading',
			chartSeries: opt<object[]>(),
			connection: opt<WebSocket>(),
			datacollection: optUn<(number | null)[][]>(),
			wsBuffer: new Array<IoNet>(),
			chartLabels: new Array<number>(),
			chartDataObjRecv: new Array<number | null>(),
			chartDataObjSent: new Array<number | null>(),
			historyDataDate: new Array<number | null>(),
			historyDataRecv: new Array<number | null>(),
			historyDataSent: new Array<number | null>(),
			bufferDataWs: new Array<IoNet>(),
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
		// Don't setup anything before everything is rendered
		nextTick(async () => {
			// Await the first call to ionets/count cause it's needed for the next
			await this.refreshCount();
			// Setup the IntersectionObserver
			// true is to tell the fetchInit to handle as grouped values
			this.obs = graphScrollObs(this, true)
			// Observe the element
			this.obs.observe(this.$el)
		})
	},

	beforeUnmount: function () {
		// Stop the Observation of the element
		this.obs?.unobserve(this.$el)
		// Close the webSocket connection
		this.cleaning()
	},

	methods: {
		buildSeries: function() {
			const threshold = this.getThreshold();
			this.chartSeries = [
				{},
				{...series(0, threshold, false), label: 'recv'},
				{...series(1, threshold, false), label: 'sent'},
			]
		},
		// Refresh the number of ioblocks there is for the current rangeParams
		refreshCount: async function() {
			await this.$http
				.get(this.$serverBase(this.$route.params.berta as string) + "/api/ionets/count?uuid=" + this.uuid + getRangeParams(this.graphRange))
				.then(resp => this.groupedSkip = Math.max(1, resp.data))
				.catch(err => {
					console.error('[' + this.table + '] Failed to fetch number of disks', err)
				})
			console.log('[' + this.table + '] Count of disks', this.groupedSkip);
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
			this.chartDataObjRecv = []
			this.chartDataObjSent = []
			this.historyDataDate = []
			this.historyDataRecv = []
			this.historyDataSent = []
			this.bufferDataWs = []
			this.wsBuffer = []

			if (ws) closeWS(this.table, this)
		},
		swapItem: function(idxA, idxB) {
			this.chartLabels[idxA] = this.chartLabels.splice(idxB, 1, this.chartLabels[idxA])[0];
			this.chartDataObjRecv[idxA] = this.chartDataObjRecv.splice(idxB, 1, this.chartDataObjRecv[idxA])[0];
			this.chartDataObjSent[idxA] = this.chartDataObjSent.splice(idxB, 1, this.chartDataObjSent[idxA])[0];
			this.historyDataDate[idxA] = this.historyDataDate.splice(idxB, 1, this.historyDataDate[idxA])[0];
			this.historyDataRecv[idxA] = this.historyDataRecv.splice(idxB, 1, this.historyDataRecv[idxA])[0];
			this.historyDataSent[idxA] = this.historyDataSent.splice(idxB, 1, this.historyDataSent[idxA])[0];
		},
		// Remove nb index from each data arrays starting from start
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjRecv.splice(start, nb)
			this.chartDataObjSent.splice(start, nb)
			this.historyDataDate.splice(start, nb)
			this.historyDataRecv.splice(start, nb)
			this.historyDataSent.splice(start, nb)
		},
		spliceNull: function(start, date) {
			this.chartLabels.splice(start, 0, date)
			this.chartDataObjRecv.splice(start, 0, null)
			this.chartDataObjSent.splice(start, 0, null)
			this.historyDataDate.splice(start, 0, date)
			this.historyDataRecv.splice(start, 0, null)
			this.historyDataSent.splice(start, 0, null)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, recv = opt<number>(), sent = opt<number>(), histrecv = opt<number>(), histSent = opt<number>()) {
			this.chartLabels.push(date)
			// If scale != default, should divide the values by granularity (at least for the graph)
			// That is because if we don't do it, we get MB/granularity, so to get MB/s we devide by the granularity
			if (this.graphRange.scale !== 300) {
				if (recv != null) recv = recv / this.graphRange.granularity
				if (sent != null) sent = sent / this.graphRange.granularity
			}
			this.chartDataObjRecv.push(recv)
			this.chartDataObjSent.push(sent)
			this.historyDataDate.push(date)
			this.historyDataRecv.push(histrecv)
			this.historyDataSent.push(histSent)
		},
		// Add a null first item with the specified date
		unshiftEmpty: function (date) {
			this.chartLabels.unshift(date)
			this.chartDataObjRecv.unshift(null)
			this.chartDataObjSent.unshift(null)
			this.historyDataDate.unshift(null)
			this.historyDataRecv.unshift(null)
			this.historyDataSent.unshift(null)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const obj: IoNet = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as IoNet;
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
		addNewData: function (elem: Array<IoNet>, update=false) {
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const vm = this

			let total_recv = 0
			let total_sent = 0
			// Compute total read and write from all disks
			for (let i = 0; i < elem.length; i++) {
				total_recv += Number(elem[i].rx_bytes)
				total_sent += Number(elem[i].tx_bytes)
			}

			// Construct the date
			let date = DateTime.fromISO(elem[0].created_at, {zone: "utc"})
			if (!date.isValid) date = DateTime.fromFormat(elem[0].created_at, "yyyy-MM-dd HH:mm:ss.u", {zone: "utc"})
			const currDate = date.toUnixInteger();

			const { recv, sent } = vm.getReadWriteFrom(currDate, total_recv, total_sent)
			// Add the new value to the Array
			vm.pushValue(currDate, recv, sent, total_recv, total_sent)

			// Update onscreen values
			if (update) {
				console.log('[' + this.table + '] updating value on graph')
				updateGraph(vm, function () {
					vm.datacollection = [
						vm.chartLabels,
						vm.chartDataObjRecv,
						vm.chartDataObjSent
					]
				})
			}
		},
		getReadWriteFrom: function (currDate, total_recv, total_sent) {
			let recv = opt<number>()
			let sent = opt<number>()
			// If the previous does not exist, we can't compute the percent
			const prevIndex = this.chartLabels.length - 1
			if (this.historyDataRecv[prevIndex] != null && this.historyDataDate[prevIndex] as number >= currDate - this.getThreshold()) {
				// Elapsed is used to work around the network latency and keep a correct scale
				// - the time between two data point can be greater than the harvest time configured,
				//   thus falsing the scale. Dividing by the diff can fix this.
				const elapsed = currDate - this.chartLabels[prevIndex]
				// Get the previous values
				const prevRecv = this.historyDataRecv[prevIndex] ?? 0
				const prevSent = this.historyDataSent[prevIndex] ?? 0
				// TODO - Auto scale to kb/mb/gb depending on the values
				recv = ((total_recv - prevRecv) / BYTES_TO_MB) / elapsed
				sent = -((total_sent - prevSent) / BYTES_TO_MB) / elapsed
			}
			return { recv, sent }
		},
	}
}
</script>
