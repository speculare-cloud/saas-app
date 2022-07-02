import uPlot from 'uplot'

const strokeColors = ["#EAB839", "#008080", "#DA70D6"]
const fillColors = ["#EAB8391A", "#0080801A", "#DA70D61A"]

function serie(idx, dec=2) {
	return {
		value: (_, v) => v == null ? "-" : v.toFixed(dec),
		points: {
			show: false
		},
		width: Math.min(Math.max(2 / devicePixelRatio, 1.25), 2),
		stroke: strokeColors[idx],
		fill: fillColors[idx],
	}
}

function splineGraph (u, seriesIdx, idx0, idx1, extendGap, buildClip) {
	return uPlot.paths.spline()(u, seriesIdx, idx0, idx1, extendGap, buildClip)
}

export function series(idx, spline = false) {
	if (spline) {
		return {...serie(idx), ...{
			drawStyle: 2,
			lineInterpolation: 1,
			paths: splineGraph,
		}}
	} else {
		return serie(idx)
	}
}

export const axies = {
	stroke: '#c7d0d9',
	grid: {
		width: 1 / devicePixelRatio,
		stroke: '#2c3235'
	},
	ticks: {
		width: 1 / devicePixelRatio,
		stroke: '#2c3235'
	}
}