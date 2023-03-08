<template>
	<div ref="uniqueName" class="w-100" />
</template>

<script>
import { nextTick } from 'vue'
import { axies } from '@/utils/graphsCharts'
import { customLegend, initMouseEvent, reactDataChange } from '@/utils/graphsBase'
import uPlot from 'uplot'

export default {
	name: 'LineChart',
	props: {
		chartdata: {
			type: Array,
			default: null
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
			type: Array,
			default: null
		}
	},

	data () {
		return {
			chart: null,
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
			const opts = {
				...this.getSize(),
				plugins: [
					customLegend(this)
				],
				cursor: {
					points: {
						size: (u, seriesIdx) => u.series[seriesIdx].points.size * 0.85,
						width: (_u, _seriesIdx, size) => size / 4
					},
					x: false,
					y: false
				},
				legend: {
					live: true
				},
				select: {
					show: false
				},
				series: this.$props.chartseries,
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
						range: this.yscale
					} : { auto: true }
				}
			}
			this.chart = new uPlot(opts, data, this.$refs.uniqueName)
			// Init mouseenter and mouseleave event for freezing the charts
			initMouseEvent(this)
		},
		destroyChart: function() {
			this.chart?.destroy();
			this.chart = null;
		},
		getSize: function () {
			return {
				width: this.$refs.uniqueName.clientWidth,
				height: 200
			}
		},
		setChartSize: function () {
			if (this.chart) this.chart.setSize(this.getSize())
		}
	}
}
</script>
