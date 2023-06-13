import type { AlertTestingComponent, BaseHttp } from "@/types/ParamsHelper";
import type { AlertsDTO } from '@martichou/sproot';

export async function testAlert (vm: AlertTestingComponent) {
	if (vm.testLoading) return;
	vm.testLoading = true;

	await performTest(vm, vm.$route.params.berta  as string, vm.editing)
		.then(async (resp) => {
			vm.lastAlertTested = Object.assign({}, vm.editing);
			vm.alertContent = resp.data;
			vm.alertSuccess = true;
		}).catch((err) => {
			console.error(err);
			vm.alertContent = "error: " + err.request.response ?? err.message;
			vm.alertSuccess = false;
		});

	vm.testLoading = false;
}

export async function performTest(vm: BaseHttp, berta: string, alert: AlertsDTO) {
	return await vm.$http.post(vm.$serverBase(berta) + "/api/alerts/test", alert)
}