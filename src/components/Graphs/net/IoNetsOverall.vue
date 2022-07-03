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
import { updateGraph } from '@/utils/graphsData'
import { series } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import LineChart from '@/components/Graphs/Base/LineChart'
import moment from 'moment'

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
			groupedSkip: 0,
			table: 'ionets',
			unit: 'MB/s',
			connection: null,
			fetchingDone: false,
			datacollection: null,
			loadingMessage: 'Loading',
			chartSeries: [
				{},
				{...series(0, false), label: 'recv'},
				{...series(1, false), label: 'sent'},
			],
			wsBuffer: [],
			chartLabels: [],
			chartDataObjRecv: [],
			chartDataObjSent: [],
			historyDataDate: [],
			historyDataRecv: [],
			historyDataSent: [],
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
			// Await the first call to iostats_count cause it's needed for the next
			vm.$http
				.get(vm.$serverBase(vm.$route.params.berta) + "/api/ionets_count?uuid=" + vm.uuid)
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
			this.chartDataObjRecv = []
			this.chartDataObjSent = []
			this.historyDataDate = []
			this.historyDataRecv = []
			this.historyDataSent = []
			this.bufferDataWs = []
			this.wsBuffer = []

			if (ws) {
				closeWS(this.table, this)
			}
		},
		// Null the data of an index (without nulling the Labels)
		nullData: function (i) {
			this.chartDataObjRecv[i] = null
			this.chartDataObjSent[i] = null
			this.historyDataDate[i] = null
			this.historyDataRecv[i] = null
			this.historyDataSent[i] = null
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
		// Add values (Labels and data) to the arrays
		pushValue: function (date, recv, sent, histrecv, histSent) {
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
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data)
			const obj = {
				rx_bytes: json.columnvalues[2],
				tx_bytes: json.columnvalues[6],
				created_at: json.columnvalues[11],
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
			let total_recv = 0
			let total_sent = 0
			// Compute total read and write from all disks
			for (let i = 0; i < elem.length; i++) {
				total_recv += elem[i].rx_bytes
				total_sent += elem[i].tx_bytes
			}
			const currDate = moment.utc(elem[0].created_at).unix();
			const { recv, sent } = vm.getReadWriteFrom(currDate, total_recv, total_sent)

			// Add the new value to the Array
			vm.pushValue(currDate, recv, sent, total_recv, total_sent)

			// Update onscreen values
			if (update) {
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
			let recv = null
			let sent = null
			// If the previous does not exist, we can't compute the percent
			const prevIndex = this.chartLabels.length - 1
			if (!(this.historyDataRecv[prevIndex] == null) &&
				!(this.historyDataDate[prevIndex] < currDate - (this.graphRange.scale / 60 + 5))) {
				// Get the previous values
				const prevRecv = this.historyDataRecv[prevIndex]
				const prevSent = this.historyDataSent[prevIndex]
				// TODO - Auto scale to kb/mb/gb depending on the values
				recv = (total_recv - prevRecv) / BYTES_TO_MB
				sent = -((total_sent - prevSent) / BYTES_TO_MB)
			}
			return { recv, sent }
		},
	}
}
</script>
