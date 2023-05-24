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

	cleaning: (ws: boolean = true) => void;
	addNewData: (elem: any, update: boolean = false) => void;
	wsMessageHandle: (event: any) => void;
	unshiftEmpty: (date: number) => void;
	pushValue: (date: number, ...args: any[]) => void;
	spliceData: (start: number, nb: number) => void;
	spliceNull: (start: number, nb: number) => void;
	getThreshold: () => number;
	swapItem: (iA: number, iB: number) => void;

	predicateGrouped?: (el: any, disk: any) => boolean;
	loadingMessage?: string;
	groupedSkip?: number;

	$cdcBase: (b: string) => string;
	$serverBase: (b: string) => string;
	$route: Route;
	$http: AxiosInstance;
}

interface WsVM {
	connection: opt<WebSocket>;
	wsMessageHandle: (event: any) => void;
	loadingMessage?: string;
}

interface ChartComponents {
	hovered: boolean;
	chart: opt<uPlot>;
	chartdata: Array<(number | null)[]>;
	unit: string;
	destroyChart: () => void;
	createChart: (data: any) => void;
	stack?: (d: any, o: any) => {data: any[], bands: uPlot.Band[]};
	$el: any;
}