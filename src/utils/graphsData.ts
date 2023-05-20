import { drainWsBuffer } from '@/utils/graphsWebsockets'
import { DateTime } from 'luxon'
import { SPS_FORMAT } from './help';
import { assert } from '@vue/compiler-core';

function sanitizeGraphData (vm: GraphComponents) {
	// How many points we have to sanitize
	const dataSize = vm.chartLabels.length;

	// console.log(vm.table + ":Source date", vm.chartLabels);
	// assert(vm.chartLabels.every((v,i,a) => !i || a[i-1] <= v), vm.table + ": source array is not in order");

	// Important: the oldest data is at the index 0
	// and the newest data is at the end of the array

	// console.log(vm.table + ":Global information:")
	// console.log(vm.table + ":> scale", vm.graphRange.scale)
	// console.log(vm.table + ":> granularity", vm.graphRange.granularity)
	// console.log(vm.table + ":> dataSize", dataSize)

	const from = vm.graphRange.rangeFrom ?? DateTime.utc().minus({seconds: vm.graphRange.scale});
	const to = vm.graphRange.rangeTo ?? DateTime.utc();
	const fromAsUnix = from.toUnixInteger()
	const toAsUnix = to.toUnixInteger()

	const threshold = vm.getThreshold();
	// console.log(vm.table + ":> threshold", threshold)

	// Iterate in the reverse order, and fill the gaps we may have
	// for (let i = dataSize - 1; i >= 0; i--) {
	// 	// If too old, splice
	// 	if (vm.chartLabels[i] < fromAsUnix - 5) {
	// 		console.log(vm.table + ":Deleting too old data", vm.chartLabels[i]);
	// 		vm.spliceData(i, 1)
	// 		continue;
	// 	}

	// 	if (i === dataSize - 1) continue;
	// 	const next = vm.chartLabels[i + 1];
	// 	const current = vm.chartLabels[i];
	// 	console.log(vm.table, i, "gap check, current vs next diff", next - current, "with current as", current);
	// 	if (next - current > threshold) {
	// 		const toAdd = current + 1;
	// 		console.log(vm.table, i, "> adding null value at", toAdd);
	// 		vm.spliceNull(i + 1, toAdd);
	// 	}
	// }

	// const newDataSize = vm.chartLabels.length;
	// console.log(vm.table + ":Size after cleanup", newDataSize)

	const newDataSize = dataSize;
	// Add null at start to ensure correct graph
	if (newDataSize === 0 || vm.chartLabels[0] > fromAsUnix) {
		console.log(vm.table + ":Adding null value at the start", fromAsUnix)
		vm.unshiftEmpty(fromAsUnix);
	}

	if (vm.chartLabels[newDataSize - 1] + threshold < toAsUnix) {
		console.log(vm.table + ":Adding null value at the end", toAsUnix)
		vm.pushValue(toAsUnix, null);
	}

	// Assert that the function does the job correctly
	assert(vm.chartLabels.every((v,i,a) => !i || a[i-1] <= v), vm.table + ": end array is not in order");
}

function basicRespHandler (vm: GraphComponents, data) {
	const dataLength = data.length
	// - data in reverse order (push_back) as uPlot use last as most recent
	for (let i = dataLength - 1; i >= 0; i--) {
		vm.addNewData(data[i], i === 0)
	}
}

function groupedRespHandler (vm: GraphComponents, data: Array<any>) {
	if (vm.groupedSkip === undefined) return;
	const dataLength = data.length
	// - data in reverse order (push_back) as uPlot use last as most recent
	// - skip intNumber by intNumber
	for (let i = dataLength - 1; i >= 0; i -= vm.groupedSkip) {
		if (vm.groupedSkip > 1) {
			const currentData = new Array<any>()
			for (let y = 0; y < vm.groupedSkip; y++) {
				currentData.push(data[i - y])
			}
			vm.addNewData(currentData, i === 0 || i === 1)
		} else {
			vm.addNewData([data[i]], i === 0)
		}
	}
}

export function getRangeParams (graphRange) {
	if (graphRange.start != null) {
		return '&min_date=' + graphRange.start.toFormat(SPS_FORMAT) + '&max_date=' + graphRange.end.toFormat(SPS_FORMAT)
	} else {
		// Substract vm.scaleTime seconds as this is pretty much the minimum time for the graph
		const min = DateTime.utc().minus({seconds: graphRange.scale + 5}).toFormat(SPS_FORMAT)
		// Add 5 seconds to minimize the risks of missing data
		const max = DateTime.utc().plus({seconds: 5}).toFormat(SPS_FORMAT)
		return '&min_date=' + min + '&max_date=' + max
	}
}

export function fetchInit (vm: GraphComponents, grouped) {
	console.log('[' + vm.table + '] fetchInit: is grouped: ' + grouped)
	// Fetching old data with the API
	vm.$http
		.get(vm.$serverBase(vm.$route.params.berta) + '/api/' + vm.table + '?uuid=' + vm.uuid + getRangeParams(vm.graphRange))
		.then(resp => {
			console.log('[' + vm.table + '] resp received')
			if (!grouped) basicRespHandler(vm, resp.data)
			else groupedRespHandler(vm, resp.data)

			// If data has been received, we drain the wsBuffer
			drainWsBuffer(vm)
			// Define the fetching as done
			vm.fetchingDone = true
			// Clear the wsBuffer
			vm.wsBuffer = []
		})
		.catch(error => {
			console.log('[' + vm.table + '] Failed to fetch previous data', error)
		}).finally(() => {
			vm.loadingMessage = 'No Data'
		})
}

export function updateGraph (vm: GraphComponents, updateFunc) {
	// Sanitize the Data in case of gap but also remove too old element
	sanitizeGraphData(vm)
	// Update the datacollection so that uPlot update the chart
	updateFunc()
}
