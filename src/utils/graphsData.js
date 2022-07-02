import { drainWsBuffer } from '@/utils/graphsWebsockets'
import moment from 'moment'

function sanitizeGraphData (dataSize, scaleTime, chartLabels, threshold, spliceData, nullData) {
	// Be sure the date are following in order (by 1s for now)
	const now = moment().utc().unix()
	const min = moment.utc().subtract(scaleTime, 'seconds').unix()
	for (let i = dataSize - 1; i >= 0; i--) {
		// Iterate in the reverse order, and find if any missing data from the latest we have
		// Also compare start against current time, if over threshold, might be some missing data

		// If the current data is too old, get rid of it
		if (chartLabels[i] < min) {
			spliceData(i, 1)
			continue
		}

		if (i === dataSize - 1) {
			// Check against now to see if we're missing starting data
			if (!(now - threshold <= chartLabels[i] && chartLabels[i] <= now + threshold)) {
				// Change last labels by now to ensure gap if no previous data
				chartLabels[i] = now
				nullData(i)
			}
		} else {
			if (chartLabels[i + 1] > chartLabels[i] + threshold) {
				// Don't need to change the Labels, uPlot already handle this
				nullData(i)
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

export function fetchInit (vm) {
	// Fetching old data with the API
	vm.$http
		.get(vm.$serverBase(vm.$route.params.berta) + "/api/" + vm.table + "?uuid=" + vm.uuid + getRangeParams(vm.graphRange))
		.then(resp => {
			const dataLength = resp.data.length
			// Add data in reverse order (push_back) and uPlot use last as most recent
			for (let i = dataLength - 1; i >= 0; i--) {
				vm.addNewData(resp.data[i], i == 0)
			}

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
	// TODO - Check the threshold value
	// TODO - The threshold can be adjusted based on the network link too
	sanitizeGraphData(
		vm.chartLabels.length,
		vm.graphRange.scale,
		vm.chartLabels,
		vm.graphRange.scale / 60 + 15,
		vm.spliceData,
		vm.nullData,
	)
	// Update the datacollection so that uPlot update the chart
	updateFunc()
}