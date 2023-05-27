import type { AlertTestingComponent } from "@/types/ParamsHelper";

export async function testAlert (vm: AlertTestingComponent) {
	if (vm.testLoading) return;
	vm.testLoading = true;

	await vm.$http.post(vm.$serverBase(vm.$route.params.berta  as string) + "/api/alerts/test", vm.editing)
		.then((resp) => {
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