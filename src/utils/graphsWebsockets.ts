import { fetchInit } from '@/utils/graphsData'
import { initWS } from '@/utils/websockets'
import { DateTime } from 'luxon'

// Open the WS if needed (if the scale is not 300, it means we're in the past)
export function openSpecificWS (vm: GraphComponents, grouped) {
	if (vm.graphRange.scale !== 300) {
		return fetchInit(vm, grouped)
	}
	initWS(vm.$cdcBase(vm.berta), vm.table, 'insert', ':host_uuid.eq.' + vm.uuid, fetchInit, vm, null, grouped)
}

// Drain the WS buffer by merging existing data with the new from the buffer
export function drainWsBuffer (vm: GraphComponents) {
	const wsBuffSize = vm.wsBuffer.length
	if (wsBuffSize > 0) {
		console.log('[' + vm.table + '] >>> Merging wsBuffer with already added data')
		for (let i = 0; i <= wsBuffSize - 1; i++) {
			const currItem = vm.wsBuffer[i]
			const date = DateTime.fromISO(currItem.created_at).toUnixInteger()
			// If the current latest date is lower than the date in the buffer
			if (vm.chartLabels[Math.max(0, vm.chartLabels.length - 1)] < date) {
				console.log('[' + vm.table + '] >>>> Adding value to the end of the buffer')
				// Add the new value to the Array
				vm.addNewData(currItem, i === wsBuffSize - 1)
			}
		}
	}
}
