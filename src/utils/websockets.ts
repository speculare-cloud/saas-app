interface initWsNamed {
	vm: WsVM,
	wsUrl: string,
	table: string,
	eventType: string,
	filter: string,
	callback?: (a1: GraphComponents, a2: any) => void,
	callbackarg?: null,
	handle?: null,
}

// TODO - Rework params into named params
export function initWS ({
	vm, wsUrl, table, eventType, filter, callback, callbackarg
}: initWsNamed) {
	console.log('[' + table + '] %cStarting %cconnection to WebSocket Server', 'color:green;', 'color:black;')
	if (vm.connection == null) {
		vm.connection = new WebSocket(wsUrl + '/ws?query=' + eventType + ':' + table + (filter ?? ''))
	}

	vm.connection.addEventListener("error", (event) => {
		console.error('[' + table + '] >> webSocket error', event)
		vm.loadingMessage = "Realtime error"

		// Still proceed to continue, maybe it's just an issue with the WS server
		// but that other (REST API) still works correctly
		callback && callback(vm as GraphComponents, callbackarg)
	});

	vm.connection.addEventListener('open', function () {
		console.log('[' + table + '] >> webSocket opened')
		callback && callback(vm as GraphComponents, callbackarg)
	})

	// Setup onmessage listener
	vm.connection.addEventListener('message', vm.wsMessageHandle)
}

export function closeWS (table, vm: WsVM) {
	console.log('[' + table + '] %cClosing %cthe WebSocket connection', 'color:red;', 'color:black;')
	if (vm.connection != null) {
		vm.connection.close()
		vm.connection = null
	}
}
