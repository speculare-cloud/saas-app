import { openSpecificWS } from '@/utils/graphsWebsockets'
import { fetchInit } from '@/utils/graphsData'

export function graphScrollObs (vm, grouped=false) {
	// Observe if the $el is visible or not
	return new IntersectionObserver((entries) => {
		if (entries[0].intersectionRatio > 0) {
			openSpecificWS(vm, grouped)
		} else {
			vm.cleaning()
		}
	}, {
		// Trigger 100px before and after
		rootMargin: '258px 0px 258px 0px',
		// Trigger as soon as 0.001 is in the threttleshot
		threshold: 0.001
	})
}

export function rebuildGraph (vm, newVal, oldVal, grouped=false) {
	console.log('[' + vm.table + '] graphRange changed')
	if (newVal.start != null) {
		// Clear the data and close the websocket
		vm.cleaning()
		// Refetch the data
		fetchInit(vm, grouped)
	} else {
		if (newVal.scale != null) {
			// Clear the data and close the websocket if needed
			vm.cleaning(newVal.scale !== 300)
			// Check if we have to open the WS (if we're trying to get the last 5 minutes)
			if (newVal.scale === 300 && vm.connection === null) {
				// Open the websocket and refetch the data
				openSpecificWS(vm, grouped)
			} else {
				// Refetch the data
				fetchInit(vm, grouped)
			}
		} else {
			// If we're here, this means that we cleared the selection and so we fallback to the default value for scale.
			// We have to check if previous scale was 300, if it is we don't do anything, else we clean + handle/fetch.
			if (oldVal.scale !== null && oldVal.scale !== 300) {
				vm.cleaning()
				openSpecificWS(vm, grouped)
			}
		}
	}
}