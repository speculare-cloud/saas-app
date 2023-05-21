import uPlot from 'uplot'

const strokeColors = ['#EAB839', '#008080', '#DA70D6', '#EAB839']
const fillColorsAlpha = ['#EAB8391A', '#0080801A', '#DA70D61A', '#EAB8391A']
const fillColors = ['#EAB839', '#008080', '#DA70D6', '#EAB839']

const pointsFilter = (u, seriesIdx, show, gaps) => {
	const filtered = new Array<number>();
	const series = u.series[seriesIdx];

	if (!show && gaps && gaps.length) {
		const [firstIdx, lastIdx] = series.idxs;
		const xData = u.data[0];
		const yData = u.data[seriesIdx];
		const firstPos = Math.round(u.valToPos(xData[firstIdx], 'x', true));
		const lastPos = Math.round(u.valToPos(xData[lastIdx], 'x', true));

		if (gaps[0][0] === firstPos) {
			filtered.push(firstIdx);
		}

		// show single points between consecutive gaps that share end/start
		for (let i = 0; i < gaps.length; i++) {
			const thisGap = gaps[i];
			const nextGap = gaps[i + 1];

			if (nextGap && thisGap[1] === nextGap[0]) {
				// approx when data density is > 1pt/px, since gap start/end pixels are rounded
				let approxIdx = u.posToIdx(thisGap[1], true);

				if (yData[approxIdx] == null) {
					// scan left/right alternating to find closest index with non-null value
					for (let j = 1; j < 100; j++) {
						if (yData[approxIdx + j] != null) {
							approxIdx += j;
							break;
						}
						if (yData[approxIdx - j] != null) {
							approxIdx -= j;
							break;
						}
					}
				}

				filtered.push(approxIdx);
			}
		}

		if (gaps[gaps.length - 1][1] === lastPos) {
			filtered.push(lastIdx);
		}
	}

	return filtered.length ? filtered : null;
};

function serie (idx: number, threshold: number, alpha = true) {
	return {
		value: (_, v) => intValueOrTilde(v),
		points: {
			filter: pointsFilter,
			show: false,
		},
		width: Math.min(Math.max(2 / devicePixelRatio, 1.25), 2),
		stroke: strokeColors[idx],
		fill: alpha ? fillColorsAlpha[idx] : fillColors[idx],
		gaps: (u, sidx, idx0, idx1, nullGaps) => {
			const xData = u.data[0];
			const yData = u.data[sidx];

			const addlGaps = [];

			for (let i = idx0 + 1; i <= idx1; i++) {
				if (Number.isFinite(yData[i]) && Number.isFinite(yData[i-1])) {
					if (xData[i] - xData[i - 1] > threshold) {
						uPlot.addGap(
							addlGaps,
							Math.round(u.valToPos(xData[i - 1], 'x', true)),
							Math.round(u.valToPos(xData[i],     'x', true)),
						);
					}
				}
			}

			nullGaps.push(...addlGaps);
			nullGaps.sort((a, b) => a[0] - b[0]);

			return nullGaps;
		}
	}
}

function splineGraph (u, seriesIdx, idx0, idx1) {
	return uPlot.paths.spline!()(u, seriesIdx, idx0, idx1)
}

export function intValueOrTilde (v: number | null) {
	return v == null ? '-' : v.toFixed(2)
}

export function series (idx: number, threshold: number, spline = false, alpha = true) {
	if (spline) {
		return {
			...serie(idx, threshold, alpha),
			...{
				drawStyle: 2,
				lineInterpolation: 1,
				paths: splineGraph
			}
		}
	} else {
		return serie(idx, threshold)
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
