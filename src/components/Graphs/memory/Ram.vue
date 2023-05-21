<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<Stacked :chartdata="datacollection" :chartseries="chartSeries!" :unit="unit" />
	</div>
</template>

<script lang="ts">
import Stacked from '@/components/Graphs/Base/Stacked.vue'

import { nextTick } from 'vue'
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph } from '@/utils/graphsData'
import { series, intValueOrTilde } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import { opt, optUn } from '@/utils/help'
import type { Memory } from '@martichou/sproot'
import { DateTime } from 'luxon'

export default {
	name: 'Ram',
	components: {
		Stacked
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
			table: 'memory',
			unit: 'MB',
			fetchingDone: false,
			loadingMessage: 'Loading',
			chartSeries: opt<{}[]>(),
			connection: opt<WebSocket>(),
			datacollection: optUn<(number | null)[][]>(),
			wsBuffer: new Array<Memory>(),
			chartLabels: new Array<number>(),
			chartDataObjFree: new Array<number | null>(),
			chartDataObjUsed: new Array<number | null>(),
			chartDataObjCached: new Array<number | null>(),
			chartDataObjBuffers: new Array<number | null>(),
			obs: opt<IntersectionObserver>()
		}
	},

	watch: {
		graphRange: function (newVal, oldVal) {
			// Rebuild the series with the new threshold
			this.buildSeries();
			rebuildGraph(this, newVal, oldVal)
		}
	},

	beforeMount: function() {
		this.buildSeries()
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
		buildSeries: function() {
			const threshold = this.getThreshold();
			this.chartSeries = [
				{},
				{...series(0, threshold, true, false), label: 'free', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjFree[i])},
				{...series(1, threshold, true, false), label: 'used', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjUsed[i])},
				{...series(2, threshold, true, false), label: 'cached', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjCached[i])},
				{...series(3, threshold, true, false), label: 'buffer', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjBuffers[i])}
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
			this.chartDataObjFree = []
			this.chartDataObjUsed = []
			this.chartDataObjCached = []
			this.chartDataObjBuffers = []
			this.wsBuffer = []

			if (ws) closeWS(this.table, this)
		},
		swapItem: function(idxA, idxB) {
			this.chartLabels[idxA] = this.chartLabels.splice(idxB, 1, this.chartLabels[idxA])[0];
			this.chartDataObjFree[idxA] = this.chartDataObjFree.splice(idxB, 1, this.chartDataObjFree[idxA])[0];
			this.chartDataObjUsed[idxA] = this.chartDataObjUsed.splice(idxB, 1, this.chartDataObjUsed[idxA])[0];
			this.chartDataObjCached[idxA] = this.chartDataObjCached.splice(idxB, 1, this.chartDataObjCached[idxA])[0];
			this.chartDataObjBuffers[idxA] = this.chartDataObjBuffers.splice(idxB, 1, this.chartDataObjBuffers[idxA])[0];
		},
		// Remove one index from each data arrays
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjFree.splice(start, nb)
			this.chartDataObjUsed.splice(start, nb)
			this.chartDataObjCached.splice(start, nb)
			this.chartDataObjBuffers.splice(start, nb)
		},
		spliceNull: function(start, date) {
			this.chartLabels.splice(start, 0, date)
			this.chartDataObjFree.splice(start, 0, null)
			this.chartDataObjUsed.splice(start, 0, null)
			this.chartDataObjCached.splice(start, 0, null)
			this.chartDataObjBuffers.splice(start, 0, null)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, free = opt<number>(), used = opt<number>(), cached = opt<number>(), buffers = opt<number>()) {
			this.chartLabels.push(date)
			this.chartDataObjFree.push(free)
			this.chartDataObjUsed.push(used)
			this.chartDataObjCached.push(cached)
			this.chartDataObjBuffers.push(buffers)
		},
		// Add a null first item with the specified date
		unshiftEmpty: function (date) {
			this.chartLabels.unshift(date)
			this.chartDataObjFree.unshift(null)
			this.chartDataObjUsed.unshift(null)
			this.chartDataObjCached.unshift(null)
			this.chartDataObjBuffers.unshift(null)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const obj: Memory = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as Memory;
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
			// Construct the date
			let date = DateTime.fromISO(elem.created_at, {zone: "utc"})
			if (!date.isValid) date = DateTime.fromFormat(elem.created_at, "yyyy-MM-dd HH:mm:ss.u", {zone: "utc"})
			// Add the new value to the Array
			vm.pushValue(date.toUnixInteger(), elem.free, elem.used, elem.cached, elem.buffers)

			// Update onscreen values
			if (update) {
				console.log('[' + this.table + '] updating value on graph')
				updateGraph(vm, function () {
					vm.datacollection = [
						vm.chartLabels,
						vm.chartDataObjFree,
						vm.chartDataObjUsed,
						vm.chartDataObjCached,
						vm.chartDataObjBuffers
					]
				})
			}
		}
	}
}
</script>