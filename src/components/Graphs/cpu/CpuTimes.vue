<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<LineChart :chartdata="datacollection" :chartseries="chartSeries" :unit="unit" :yscale="[0, 100]" />
	</div>
</template>

<script lang="ts">
import LineChart from '@/components/Graphs/Base/LineChart.vue'

import { nextTick } from 'vue'
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph } from '@/utils/graphsData'
import { series } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import { opt, optUn } from '@/utils/help'
import type { CpuTimes } from '@martichou/sproot'
import { DateTime } from 'luxon'

export default {
	name: 'Cputimes',
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
			table: 'cputimes',
			unit: 'percentage',
			fetchingDone: false,
			loadingMessage: 'Loading',
			chartSeries: [
				{},
				{...series(0, false), label: 'user & system'}
			],
			connection: opt<WebSocket>(),
			datacollection: optUn<(number | null)[][]>(),
			wsBuffer: new Array<CpuTimes>(),
			chartLabels: new Array<number>(),
			chartDataObj: new Array<number | null>(),
			historyBusyDataObj: new Array<number | null>(),
			historyIdleDataObj: new Array<number | null>(),
			obs: opt<IntersectionObserver>()
		}
	},

	watch: {
		graphRange: function (newVal, oldVal) {
			rebuildGraph(this, newVal, oldVal);
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
		this.obs?.unobserve(this.$el)
		// Close the webSocket connection
		this.cleaning()
	},

	methods: {
		// Empty every arrays and close the websocket
		cleaning: function (ws = true) {
			console.log('[' + this.table + '] cleaning called')
			this.fetchingDone = false
			this.chartLabels = []
			this.chartDataObj = []
			this.historyBusyDataObj = []
			this.historyIdleDataObj = []
			this.wsBuffer = []

			if (ws) closeWS(this.table, this)
		},
		// Remove nb index from each data arrays starting from start
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObj.splice(start, nb)
			this.historyBusyDataObj.splice(start, nb)
			this.historyIdleDataObj.splice(start, nb)
		},
		spliceNull: function(start, date) {
			this.chartLabels.splice(start, 0, date)
			this.chartDataObj.splice(start, 0, null)
			this.historyBusyDataObj.splice(start, 0, null)
			this.historyIdleDataObj.splice(start, 0, null)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, usage = opt<number>(), busy = opt<number>(), idle = opt<number>()) {
			this.chartLabels.push(date)
			this.chartDataObj.push(usage)
			this.historyBusyDataObj.push(busy)
			this.historyIdleDataObj.push(idle)
		},
		// Add a null first item with the specified date
		unshiftEmpty: function (date) {
			this.chartLabels.unshift(date)
			this.chartDataObj.unshift(null)
			this.historyBusyDataObj.unshift(null)
			this.historyIdleDataObj.unshift(null)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const obj: CpuTimes = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as CpuTimes;
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
			// Compute the busy time of the CPU from these params
			const busy = Number(elem.cuser + elem.nice + elem.system + elem.irq + elem.softirq + elem.steal)
			// Compute the idling time of the CPU from these params
			const idle = Number(elem.idle + elem.iowait)
			// Get the usage in % computed from busy and idle + prev values
			const usage = vm.getUsageFrom(busy, idle)
			// Construct the date
			let date = DateTime.fromISO(elem.created_at, {zone: "utc"})
			if (!date.isValid) date = DateTime.fromFormat(elem.created_at, "yyyy-MM-dd HH:mm:ss.u", {zone: "utc"})
			// Add the new value to the Array
			vm.pushValue(date.toUnixInteger(), usage, busy, idle)

			// Update onscreen values
			if (update) {
				console.log('[' + this.table + '] updating value on graph')
				updateGraph(vm, function () {
					vm.datacollection = [
						vm.chartLabels,
						vm.chartDataObj
					]
				})
			}
		},
		// TODO - Rework
		getUsageFrom: function (busy, idle) {
			// If the previous does not exist, we can't compute the percent
			const prevIndex = this.chartLabels.length - 1

			// Get the previous entry
			const prevBusy = this.historyBusyDataObj[prevIndex]
			const prevIdle = this.historyIdleDataObj[prevIndex]

			// Assert not null
			if (prevBusy && prevIdle) {
				// Compute the total of the previous and now
				const prevTotal = prevBusy + prevIdle
				const total = busy + idle
				// Compute the different between both
				const totald = total - prevTotal
				const idled = idle - prevIdle
				// Get the value as percent
				return Math.max(0, (totald - idled) / totald * 100)
			}

			return null
		},
	}
}
</script>
