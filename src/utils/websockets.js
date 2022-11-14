export const CDC_VALUES = 'columnvalues'

export function initWS (wsUrl, table, eventType, filter, callback = null, vm, handle = null, callbackarg = null) {
	console.log('[' + table + '] %cStarting %cconnection to WebSocket Server', 'color:green;', 'color:black;')
	if (vm.connection == null) {
		vm.connection = new WebSocket(wsUrl + '/ws?query=' + eventType + ':' + table + (filter ?? ''))
	}

	vm.connection.addEventListener('open', function () {
		console.log('[' + table + '] >> webSocket opened')
		callback && callback(vm, callbackarg)
	})

	// Setup onmessage listener
	vm.connection.addEventListener('message', handle || vm.wsMessageHandle)
}

export function closeWS (table, vm) {
	console.log('[' + table + '] %cClosing %cthe WebSocket connection', 'color:red;', 'color:black;')
	if (vm.connection != null) {
		vm.connection.close()
		vm.connection = null
	}
}
