<template>
	<div>
		<div v-if="datacollection == null" class="w-100 flex items-center justify-center text-xl text-gray-400" style="height: 258px">
			<h3>{{ loadingMessage }}</h3>
		</div>
		<Stacked :chartdata="datacollection" :chartseries="chartSeries" :unit="unit" />
	</div>
</template>

<script>
import { nextTick } from 'vue'
import { graphScrollObs, rebuildGraph } from '@/utils/graphs'
import { updateGraph } from '@/utils/graphsData'
import { series, intValueOrTilde } from '@/utils/graphsCharts'
import { closeWS } from '@/utils/websockets'
import Stacked from '@/components/Graphs/Base/Stacked'
import moment from 'moment'

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
			connection: null,
			fetchingDone: false,
			datacollection: null,
			loadingMessage: 'Loading',
			chartSeries: [
				{},
				{...series(0, true, false), label: 'free', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjFree[i])},
				{...series(1, true, false), label: 'used', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjUsed[i])},
				{...series(2, true, false), label: 'cached', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjCached[i])},
				{...series(3, true, false), label: 'buffer', value: (_u, _v, _s, i) => intValueOrTilde(this.chartDataObjBuffers[i])}
			],
			wsBuffer: [],
			chartLabels: [],
			chartDataObjFree: [],
			chartDataObjUsed: [],
			chartDataObjCached: [],
			chartDataObjBuffers: [],
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
			this.chartDataObjFree = []
			this.chartDataObjUsed = []
			this.chartDataObjCached = []
			this.chartDataObjBuffers = []
			this.wsBuffer = []

			if (ws) {
				closeWS(this.table, this)
			}
		},
		// Null the data of an index (without nulling the Labels)
		nullData: function (i) {
			this.chartDataObjFree[i] = null
			this.chartDataObjUsed[i] = null
			this.chartDataObjCached[i] = null
			this.chartDataObjBuffers[i] = null
		},
		// Remove one index from each data arrays
		spliceData: function (start, nb) {
			this.chartLabels.splice(start, nb)
			this.chartDataObjFree.splice(start, nb)
			this.chartDataObjUsed.splice(start, nb)
			this.chartDataObjCached.splice(start, nb)
			this.chartDataObjBuffers.splice(start, nb)
		},
		// Add values (Labels and data) to the arrays
		pushValue: function (date, free, used, cached, buffers) {
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
			const json = JSON.parse(event.data)
			const obj = {
				free: json.columnvalues[2],
				used: json.columnvalues[3],
				cached: json.columnvalues[6],
				buffers: json.columnvalues[5],
				created_at: json.columnvalues[8],
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
			vm.pushValue(moment.utc(elem.created_at).unix(), elem.free, elem.used, elem.cached, elem.buffers)

			// Update onscreen values
			if (update) {
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