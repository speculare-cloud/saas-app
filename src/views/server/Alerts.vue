<template>
	<section>
		<div class="flex-col">
			<router-link
				:to="{ name: 'DetailsServer', params: { berta: $route.params.berta, uuid: $route.params.uuid, hostname: $route.params.hostname } }"
				class="btn btn-sm md:btn-md btn-ghost gap-2 normal-case lg:gap-3 !pl-0 !pr-2">
				<svg
					xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 fill-current md:h-8 md:w-8" width="24" height="24"
					viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
				<div class="flex flex-col items-start">
					<span class="text-base-content hidden text-xs font-normal md:block">Prev</span>
					<span class="text-white">Details of {{ $route.params.hostname }}</span>
				</div>
			</router-link>
			<div class="prose-sm flex items-center gap-4 mt-4">
				<div class="flex flex-col align-middle gap-1">
					<h1 class="mb-0">
						Alerts
					</h1>
				</div>
			</div>
		</div>
		<div class="mt-12 mb-12">
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				<div v-for="alert in alerts" :key="alert.id" class="group flex flex-col gap-4 p-5 bg-base-300 shadow-md rounded-lg">
					<div class="flex flex-row justify-between gap-2 items-center">
						<div class="flex flex-col flex-1 gap-2">
							{{ alert.name }}
							<p class="text-sm">
								↪ Running every {{ alert.timing }}s
							</p>
						</div>
						<div class="tooltip" :data-tip="!(alert.activeLoading ?? false) ? (alert.active ? 'Pause' : 'Resume') : 'Loading'">
							<button
								@click="switchActiveAlert(alert)" class="status-indicator status-indicator--xs"
								:class="!(alert.activeLoading ?? false) ? (alert.active ? 'status-indicator--success' : 'status-indicator--danger') : 'status-indicator--warning'">
								<div class="circle circle--animated circle-main" />
								<div class="circle circle--animated circle-secondary" />
								<div class="circle circle--animated circle-tertiary" />
							</button>
						</div>
					</div>
					<div class="mockup-code flex flex-col">
						<code>Lookup: {{ alert.lookup }}</code>
						<code v-if="alert.where_clause">Where: {{ alert.where_clause }}</code>
						<code>Warning: {{ alert.warn }}</code>
						<code>Critical: {{ alert.crit }}</code>
					</div>
					<div class="flex flex-row justify-end gap-2">
						<button @click="deleteAlert(alert)" class="invisible opacity-0 group-hover:visible group-hover:opacity-100 btn btn-md btn-error transition-opacity">
							<span v-if="!alert.deleting">delete</span>
							<span v-if="alert.deleting">loading...</span>
						</button>
						<label for="my-modal-4" class="btn btn-md group-hover:btn-info" @click="editingAlert = Object.assign({}, alert)">
							Edit
						</label>
					</div>
				</div>
			</div>
		</div>

		<input type="checkbox" id="my-modal-4" class="modal-toggle">
		<label for="my-modal-4" class="modal cursor-pointer">
			<label class="modal-box relative flex flex-col gap-4" for="" v-if="editingAlert">
				<h3 class="text-lg font-bold">{{ editingAlert.name }}</h3>

				<div class="flex flex-col gap-1">
					<p>Warning threshold:</p>
					<codemirror
						v-model="editingAlert.warn"
						placeholder="Enter the warning threshold (use $this to compare)"
						:indent-with-tab="true"
						:tab-size="4"
						:extensions="extensions"
						@ready="handleReady" />
				</div>

				<div class="flex flex-col gap-1">
					<p>Critical threshold:</p>
					<codemirror
						v-model="editingAlert.crit"
						placeholder="Enter the critical threshold (use $this to compare)"
						:indent-with-tab="true"
						:tab-size="4"
						:extensions="extensions"
						@ready="handleReady" />
				</div>

				<div class="modal-action justify-between mt-0">
					<label for="my-modal-4" class="btn btn-md" @click="editingAlert = null">
						<svg
							class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
							viewBox="0 0 18 18">
							<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
						</svg>
					</label>
					<div class="flex flex-row gap-2">
						<button class="btn btn-md btn-info" @click="testAlert(editingAlert)">
							{{ editingAlert.testLoading ? 'loading...' : 'test' }}
						</button>
						<button class="btn btn-md btn-success" @click="updateAlert(editingAlert, {whole: editingAlert, update: editingAlert})">
							{{ editingAlert.loading ? 'loading...' : 'apply' }}
						</button>
					</div>
				</div>

				<div v-if="editingAlert.alertContent" class="alert px-4 py-2 shadow-lg" :class="editingAlert.alertSuccess ? 'alert-success' : 'alert-error'">
					<code>{{ editingAlert.alertContent }}</code>
				</div>
			</label>
		</label>
	</section>
</template>

<script>
import { nextTick, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror'
import { oneDark } from '@codemirror/theme-one-dark'
import { rust } from '@codemirror/lang-rust'

export default {
	name: 'Incidents',

	components: {
		Codemirror
	},

	setup() {
		const extensions = [rust(), oneDark]
		const view = shallowRef()
		const handleReady = (payload) => {
			view.value = payload.view
		}

		return { extensions, handleReady };
	},

	data() {
		return {
			alerts: [],
			editingAlert: null
		}
	},

	mounted: function () {
		nextTick(async () => {
			await this.refreshList();
		})
	},

	methods: {
		refreshList: async function() {
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/alerts?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					resp.data.forEach(elem => {
						const idx = this.alerts.findIndex(el => el.id == elem.id);
						if (idx !== -1) {
							this.alerts[idx] = elem
						} else {
							this.alerts.push(elem);
						}
					})
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
		},
		switchActiveAlert: async function(alert) {
			if (alert.activeLoading) return;
			alert.activeLoading = true;
			const payload = {
				whole: alert,
				update: {
					active: !alert.active
				}
			};
			await this.updateAlert(alert, payload);
			alert.activeLoading = false;
		},
		deleteAlert: async function(alert) {
			if (alert.deleting) return;
			alert.deleting = true;
			await this.$http.delete(this.$serverBase(this.$route.params.berta) + "/api/alerts?id=" + alert.id)
				.then((resp) => {
					if (resp.data === 1) {
						const idx = this.alerts.findIndex(el => el.id == alert.id);
						this.alerts.splice(idx, 1);
					}
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			alert.deleting = false;
		},
		updateAlert: async function(alert, payload) {
			if (alert.loading) return;
			alert.loading = true;
			await this.$http.patch(this.$serverBase(this.$route.params.berta) + "/api/alerts?id=" + alert.id, payload)
				.then((resp) => {
					const elem = resp.data;
					const idx = this.alerts.findIndex(el => el.id == elem.id);
					if (idx !== -1) {
						this.alerts[idx] = elem
					} else {
						this.alerts.push(elem);
					}
					alert.alertContent = "alert successfully updated";
					alert.alertSuccess = true;
				}).catch((err) => {
					console.error(err);
					alert.alertContent = "error: " + err.request.response ?? err.message;
					alert.alertSuccess = false;
				});
			alert.loading = false;
		},
		testAlert: async function(alert) {
			if (alert.testLoading) return;
			alert.testLoading = true;
			await this.$http.post(this.$serverBase(this.$route.params.berta) + "/api/alerts/test", alert)
				.then((resp) => {
					alert.alertContent = resp.data;
					alert.alertSuccess = true;
				}).catch((err) => {
					console.error(err);
					alert.alertContent = "error: " + err.request.response ?? err.message;
					alert.alertSuccess = false;
				});
			alert.testLoading = false;
		}
	}
}
</script>

<style scoped>
.mockup-code:before {
	display: none;
}

.mockup-code {
	@apply px-2 py-2;
}

code {
	background-color: transparent;
}
</style>