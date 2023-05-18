<template>
	<div ref="uniqueName" class="w-100" />
</template>

<script lang="ts">
import { nextTick } from 'vue'
import { axies } from '@/utils/graphsCharts'
import { customLegend, initMouseEvent, reactDataChange } from '@/utils/graphsBase'
import uPlot from 'uplot'
import { opt } from '@/utils/help'

export default {
	name: 'LineChart',
	props: {
		chartdata: {
			type: Array<(number | null)[]>,
			default: null,
		},
		chartseries: {
			type: Array,
			required: true
		},
		unit: {
			type: String,
			required: true
		},
		yscale: {
			type: Array<number>,
			default: null
		}
	},

	data () {
		return {
			chart: opt<uPlot>(),
			hovered: false
		}
	},

	watch: {
		chartdata: function (newData, oldData) {
			reactDataChange(this, oldData, newData)
		}
	},

	mounted () {
		// Add the event after the page has been rendered
		nextTick(() => {
			window.addEventListener('resize', this.setChartSize)
		})
	},

	beforeUnmount: function () {
		window.removeEventListener('resize', this.setChartSize)
	},

	methods: {
		createChart: function (data) {
			const opts: uPlot.Options = {
				...this.getSize(),
				plugins: [
					customLegend(this)
				],
				cursor: {
					points: {
						size: (u, seriesIdx) => (u.series[seriesIdx].points?.size ?? 1) * 0.85,
						width: (_u, _seriesIdx, size) => size / 4
					},
					x: false,
					y: false
				},
				legend: {
					live: true
				},
				select: {
					show: false,
					height: 0,
					left: 0,
					top: 0,
					width: 0,
				},
				series: this.$props.chartseries as any,
				axes: [
					axies,
					axies
				],
				scales: {
					x: {
						time: true
					},
					y: this.yscale && this.yscale.length ? {
						auto: false,
						range: this.yscale as uPlot.Scale.Range
					} : { auto: true }
				}
			}
			this.chart = new uPlot(opts, data, this.$refs.uniqueName as any)
			// Init mouseenter and mouseleave event for freezing the charts
			initMouseEvent(this)
		},
		destroyChart: function() {
			this.chart?.destroy();
			this.chart = null;
		},
		getSize: function () {
			return {
				width: (this.$refs.uniqueName as any).clientWidth,
				height: 200
			}
		},
		setChartSize: function () {
			if (this.chart) this.chart.setSize(this.getSize())
		},
	}
}
</script>
