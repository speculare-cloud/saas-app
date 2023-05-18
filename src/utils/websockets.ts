export const CDC_VALUES = 'columnvalues'

// TODO - Rework params into named params
export function initWS (wsUrl, table, eventType, filter, callback: Function | null, vm: WsVM, handle = null, callbackarg = null) {
	console.log('[' + table + '] %cStarting %cconnection to WebSocket Server', 'color:green;', 'color:black;')
	if (vm.connection == null) {
		vm.connection = new WebSocket(wsUrl + '/ws?query=' + eventType + ':' + table + (filter ?? ''))
	}

	vm.connection.addEventListener("error", (event) => {
		console.error('[' + table + '] >> webSocket error', event)
		vm.loadingMessage = "Realtime error"

		// Still proceed to continue, maybe it's just an issue with the WS server
		// but that other (REST API) still works correctly
		callback && callback(vm, callbackarg)
	});

	vm.connection.addEventListener('open', function () {
		console.log('[' + table + '] >> webSocket opened')
		callback && callback(vm, callbackarg)
	})

	// Setup onmessage listener
	vm.connection.addEventListener('message', handle || vm.wsMessageHandle)
}

export function closeWS (table, vm: WsVM) {
	console.log('[' + table + '] %cClosing %cthe WebSocket connection', 'color:red;', 'color:black;')
	if (vm.connection != null) {
		vm.connection.close()
		vm.connection = null
	}
}
