import type { AlertTestingComponent, BaseHttp } from "@/types/ParamsHelper";
import type { AlertsDTO } from '@martichou/sproot';

export async function testAlert (vm: AlertTestingComponent) {
	if (vm.testLoading) return;
	vm.testLoading = true;

	await performTest(vm, vm.$route.params.berta  as string, vm.editing, (resp) => {
		vm.lastAlertTested = Object.assign({}, vm.editing);
		vm.alertContent = resp.data;
		vm.alertSuccess = true;
	}, (err) => {
		console.error(err);
		vm.alertContent = "error: " + err.request.response ?? err.message;
		vm.alertSuccess = false;
	});

	vm.testLoading = false;
}

export async function performTest(vm: BaseHttp, berta: string, alert: AlertsDTO, then: ((resp) => void) | null, catched: ((err) => void) | null) {
	await vm.$http.post(vm.$serverBase(berta) + "/api/alerts/test", alert)
		.then(async (resp) => {
			if (then != null) await then(resp);
		}).catch((err) => {
			if (catched != null) catched(err);
		});
}