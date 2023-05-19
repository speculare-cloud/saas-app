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
	name: 'Stacked',
	props: {
		chartdata: {
			type: Array<(number | null)[]>,
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
			chart: opt<uPlot>(),
			hovered: false
		}
	},

	watch: {
		chartdata: function (newData, oldData) {
			reactDataChange(this, oldData, newData, true)
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
		stack: function (data, omit) {
			const d0Length = data[0].length
			const accum = Array(d0Length)
			for (let i = 0; i < d0Length; ++i) accum[i] = 0
			const stacked_data = [data[0]]
			const length = data.length
			const bands = new Array<uPlot.Band>()

			// Compute the stacked value (add each value (kind of))
			for (let i = 1; i < length; i++) {
				if (omit(i)) {
					stacked_data.push(data[i])
				} else {
					const dilength = data[i].length
					for (let j = 0; j < dilength; j++) {
						if (data[i][j] == null) {
							accum[j] = null;
						} else {
							accum[j] += data[i][j]
						}
					}
					const arrCopy = Array(dilength)
					for (let j = 0; j < dilength; j++) {
						arrCopy[j] = accum[j]
					}
					stacked_data.push(arrCopy)
				}
			}

			for (let i = 1; i < length; i++) {
				!omit(i) && bands.push({
					series: [
						data.findIndex((_s, j) => j > i && !omit(j)),
						i
					]
				})
			}

			return {
				data: stacked_data,
				bands
			}
		},
		createChart: function (data) {
			const stacked = this.stack(data, () => false)
			const opts: uPlot.Options = {
				...this.getSize(),
				plugins: [
					customLegend(this)
				],
				bands: stacked.bands,
				cursor: {
					points: {
						size: (u, seriesIdx) => (u.series[seriesIdx].points?.size ?? 1) * 0.85,
						width: (_u, _seriesIdx, size) => size / 4
					},
					x: false,
					y: false
				},
				hooks: {
					setSeries: [
						(u, ) => {
							const stacked = this.stack(data, i => !u.series[i].show)
							u.delBand(null)
							stacked.bands.forEach(b => u.addBand(b))
							u.setData(stacked.data)
						}
					]
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
					} : {
						range (_u, _dmin, dmax) {
							return uPlot.rangeNum(0, dmax, 0.1, true)
						}
					}
				}
			}
			this.chart = new uPlot(opts, stacked.data, this.$refs.uniqueName as any)
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
