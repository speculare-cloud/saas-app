<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 253.5px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<LineChart
			v-else :chartdata="datacollection" :chartseries="chartSeries!" :unit="unit"
			:yscale="yscale" />
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
import type { LoadAvg } from '@martichou/sproot'
import { DateTime } from 'luxon'

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
			thresholdModifier: {
				add: 5,
				mult: 2,
			},
			yscale: optUn<number[]>(),
			fetchingDone: false,
			loadingMessage: 'Loading',
			chartSeries: opt<{}[]>(),
			connection: opt<WebSocket>(),
			datacollection: optUn<(number | null)[][]>(),
			wsBuffer: new Array<LoadAvg>(),
			chartLabels: new Array<number>(),
			chartDataObjOne: new Array<number | null>(),
			chartDataObjFive: new Array<number | null>(),
			chartDataObjFitheen: new Array<number | null>(),
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
		this.buildSeries();
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
				{...series(0, threshold, true), label: 'load1'},
				{...series(1, threshold, true), label: 'load5'},
				{...series(2, threshold, true), label: 'load15'},
			]
		},
		getThreshold: function() {
			let threshold;
			if (this.graphRange.granularity > 60) {
				threshold = this.graphRange.scale < 345600 ? 600 : 1800
			} else {
				threshold = this.graphRange.scale / 60 + this.graphRange.granularity
			}
			threshold += this.thresholdModifier.add;
			threshold *= this.thresholdModifier.mult;
			// Threshold within 5% of the value we should have
			threshold += (5 / 100) * threshold

			return threshold;
		},
		// Empty every arrays and close the websocket
		cleaning: function (ws = true) {
			console.log('[' + this.table + '] cleaning called')
			this.fetchingDone = false
			this.chartLabels = []
			this.chartDataObjOne = []
			this.chartDataObjFive = []
			this.chartDataObjFitheen = []
			this.wsBuffer = []

			if (ws) closeWS(this.table, this)
		},
		swapItem: function(idxA, idxB) {
			this.chartLabels[idxA] = this.chartLabels.splice(idxB, 1, this.chartLabels[idxA])[0];
			this.chartDataObjOne[idxA] = this.chartDataObjOne.splice(idxB, 1, this.chartDataObjOne[idxA])[0];
			this.chartDataObjFive[idxA] = this.chartDataObjFive.splice(idxB, 1, this.chartDataObjFive[idxA])[0];
			this.chartDataObjFitheen[idxA] = this.chartDataObjFitheen.splice(idxB, 1, this.chartDataObjFitheen[idxA])[0];
		},
		// Remove nb index from each data arrays starting from start
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjOne.splice(start, nb)
			this.chartDataObjFive.splice(start, nb)
			this.chartDataObjFitheen.splice(start, nb)
		},
		spliceNull: function(start, date) {
			this.chartLabels.splice(start, 0, date)
			this.chartDataObjOne.splice(start, 0, null)
			this.chartDataObjFive.splice(start, 0, null)
			this.chartDataObjFitheen.splice(start, 0, null)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, one = opt<number>(), five = opt<number>(), fith = opt<number>()) {
			this.chartLabels.push(date)
			this.chartDataObjOne.push(one ? Math.round(one * 100) / 100 : one)
			this.chartDataObjFive.push(five ? Math.round(five * 100) / 100 : five)
			this.chartDataObjFitheen.push(fith ? Math.round(fith * 100) / 100 : fith)
		},
		// Add a null first item with the specified date
		unshiftEmpty: function (date) {
			this.chartLabels.unshift(date)
			this.chartDataObjOne.unshift(null)
			this.chartDataObjFive.unshift(null)
			this.chartDataObjFitheen.unshift(null)
		},
		wsMessageHandle: function (event) {
			// Parse the data and extract newValue
			const json = JSON.parse(event.data);
			const columnsNames = json.columnnames;
			const columnsValues = json.columnvalues;

			const obj: LoadAvg = Object.fromEntries(
				columnsNames.map((_, i) => [columnsNames[i], columnsValues[i]])
			) as LoadAvg;
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
			vm.pushValue(date.toUnixInteger(), elem.one, elem.five, elem.fifteen)

			// Update onscreen values
			if (update) {
				console.log('[' + this.table + '] updating value on graph')
				updateGraph(vm, function() {
					vm.datacollection = [
						vm.chartLabels,
						vm.chartDataObjOne,
						vm.chartDataObjFive,
						vm.chartDataObjFitheen
					]
				})
			}
		}
	}
}
</script>
