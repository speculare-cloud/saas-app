import { drainWsBuffer } from '@/utils/graphsWebsockets'
import moment from 'moment'

function sanitizeGraphData (vm) {
	const dataSize = vm.chartLabels.length;
	const threshold = dataSize / 60 + 15;
	// Be sure the date are following in order (by 1s for now)
	const now = moment().utc().unix()
	const min = moment.utc().subtract(vm.graphRange.scale, 'seconds').unix()
	// Add the first item as the oldest to avoid big blank.
	if (vm.chartLabels.length == 0 || vm.chartLabels[0] >= min + threshold) {
		console.log(vm.table + ": first triggered");
		vm.unshiftEmpty(min + threshold - 1, null)
	}
	// Set the newest as null in case it does not exists.
	// TODO - Review
	if (vm.chartLabels.length == 0 || vm.chartLabels[vm.chartLabels.length - 1] <= now - threshold) {
		vm.pushValue(now)
		vm.nullData(vm.chartLabels.length)
	}
	// vm.nullData(vm.chartLabels.length)
	for (let i = dataSize - 1; i >= 0; i--) {
		// Iterate in the reverse order, and find if any missing data from the latest we have
		// Also compare start against current time, if over threshold, might be some missing data

		// If the current data is too old, get rid of it
		if (vm.chartLabels[i] < min) {
			vm.spliceData(i, 1)
			continue
		}

		if (i === dataSize - 1) {
			// Check against now to see if we're missing starting data
			if (!(now - threshold <= vm.chartLabels[i] && vm.chartLabels[i] <= now + threshold)) {
				// Change last labels by now to ensure gap if no previous data
				vm.chartLabels[i] = now
				// TODO - might just push empty value ?
				vm.nullData(i)
			}
		} else {
			if (vm.chartLabels[i + 1] > vm.chartLabels[i] + threshold) {
				// Don't need to change the Labels, uPlot already handle this
				// TODO - might just push empty value ?
				vm.nullData(i)
			}
		}
	}
}

function getRangeParams (graphRange) {
	if (graphRange.start != null) {
		return '&min_date=' + graphRange.start + '&max_date=' + graphRange.end;
	} else {
		// Substract vm.scaleTime seconds as this is pretty much the minimum time for the graph
		const min = moment().utc().subtract(graphRange.scale + 5, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS')
		// Add 5 seconds to minimize the risks of missing data
		const max = moment().utc().add(5, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS')
		return '&min_date=' + min + '&max_date=' + max
	}
}

function basicRespHandler (vm, data) {
	const dataLength = data.length
	// - data in reverse order (push_back) as uPlot use last as most recent
	for (let i = dataLength - 1; i >= 0; i--) {
		vm.addNewData(data[i], i == 0)
	}
}

function groupedRespHandler (vm, data) {
	const dataLength = data.length
	// - data in reverse order (push_back) as uPlot use last as most recent
	// - skip intNumber by intNumber
	for (let i = dataLength - 1; i >= 0; i -= vm.groupedSkip) {
		if (vm.groupedSkip > 1) {
			const currentData = []
			for (let y = 0; y < vm.groupedSkip; y++) {
				currentData.push(data[i - y])
			}
			vm.addNewData(currentData, i == 0 || i == 1)
		} else {
			vm.addNewData([data[i]], i == 0)
		}
	}
}

export function fetchInit (vm, grouped) {
	console.log("fetchInit: " + vm.table + " is grouped: " + grouped)
	// Fetching old data with the API
	vm.$http
		.get(vm.$serverBase(vm.$route.params.berta) + "/api/" + vm.table + "?uuid=" + vm.uuid + getRangeParams(vm.graphRange))
		.then(resp => {
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

export function updateGraph (vm, updateFunc) {
	// Sanitize the Data in case of gap but also remove too old element
	sanitizeGraphData(vm)
	// Update the datacollection so that uPlot update the chart
	updateFunc()
}