interface GraphComponents {
	table: string;
	berta: string;
	uuid: string;
	fetchingDone: boolean;
	wsBuffer: Array;
	chartLabels: Array;

	connection: opt<WebSocket>;
	graphRange: opt<{
		granularity: number;
		scale: number;
		start: string | null;
		end: string | null;
	}>;

	cleaning: Function;
	addNewData: Function;
	wsMessageHandle: Function;
	unshiftEmpty: Function;
	pushValue: Function;
	spliceData: Function;
	spliceNull: Function;
	getThreshold: Function;
	swapItem: Function;

	loadingMessage?: string;
	groupedSkip?: number;

	$cdcBase: Function;
	$serverBase: Function;
	$route: Route;
	$http: AxiosInstance;
}

interface WsVM {
	connection: opt<WebSocket>;
	wsMessageHandle: Function;
	loadingMessage?: string;
}

interface ChartComponents {
	hovered: boolean;
	chart: opt<uPlot>;
	chartdata: Array<(number | null)[]>;
	unit: string;
	destroyChart: Function;
	createChart: Function;
	stack?: Function;
	$el: any;
}