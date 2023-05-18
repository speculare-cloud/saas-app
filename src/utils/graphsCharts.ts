import uPlot from 'uplot'

const strokeColors = ['#EAB839', '#008080', '#DA70D6', '#EAB839']
const fillColorsAlpha = ['#EAB8391A', '#0080801A', '#DA70D61A', '#EAB8391A']
const fillColors = ['#EAB839', '#008080', '#DA70D6', '#EAB839']

function serie (idx: number, alpha = true) {
	return {
		value: (_, v) => intValueOrTilde(v),
		points: {
			show: false
		},
		width: Math.min(Math.max(2 / devicePixelRatio, 1.25), 2),
		stroke: strokeColors[idx],
		fill: alpha ? fillColorsAlpha[idx] : fillColors[idx]
	}
}

// TODO - see what's up
function splineGraph (u, seriesIdx, idx0, idx1, extendGap, buildClip) {
	return uPlot.paths.spline!()(u, seriesIdx, idx0, idx1, extendGap, buildClip)
}

export function intValueOrTilde (v: number) {
	return v == null ? '-' : v.toFixed(2)
}

export function series (idx: number, spline = false, alpha = true) {
	if (spline) {
		return {
			...serie(idx, alpha),
			...{
				drawStyle: 2,
				lineInterpolation: 1,
				paths: splineGraph
			}
		}
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
