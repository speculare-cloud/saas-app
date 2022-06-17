export function initWS (wsUrl, table, event_type, filter, callback, vm) {
	console.log('[' + table + '] %cStarting %cconnection to WebSocket Server', 'color:green;', 'color:white;')
	if (vm.connection == null) {
		vm.connection = new WebSocket(wsUrl + '/ws?query=' + event_type + ':' + table + (filter ?? ''))
	}

	vm.connection.addEventListener('open', function () {
		console.log('[' + table + '] >> webSocket opened')
		if (callback) vm.fetchInit()
	})

	// Setup onmessage listener
	vm.connection.addEventListener('message', vm.wsMessageHandle)
}

export function closeWS (table, vm) {
	console.log('[' + table + '] %cClosing %cthe WebSocket connection', 'color:red;', 'color:white;')
	if (vm.connection != null) {
		vm.connection.close()
		vm.connection = null
	}
}