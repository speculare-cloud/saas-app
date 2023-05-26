<template>
	<section>
		<div class="md:flex justify-between items-center">
			<div>
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
			<div class="mt-4 md:mt-0 flex flex-col items-start sm:flex-row sm:space-x-4">
				<router-link key="new_alert" :to="{ name: 'NewAlert' }" class="btn btn-md btn-info min-h-[2.5rem] h-[2.5rem]">
					create an alert
				</router-link>
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
						<div class="tooltip" :data-tip="activeLoading != alert.id ? (alert.active ? 'Pause' : 'Resume') : 'Loading'">
							<button
								@click="switchActiveAlert(alert)" class="status-indicator status-indicator--xs"
								:class="activeLoading != alert.id ? (alert.active ? 'status-indicator--success' : 'status-indicator--danger') : 'status-indicator--warning'">
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
							<span v-if="deleteLoading != alert.id">delete</span>
							<span v-else>loading...</span>
						</button>
						<label for="my-modal-4" class="btn btn-md group-hover:btn-info" @click="defineEditingAlert(alert)">
							Edit
						</label>
					</div>
				</div>
			</div>
		</div>

		<input type="checkbox" id="my-modal-4" class="modal-toggle" ref="updateToggle">
		<UpdateAlertModal
			v-if="editingAlert.original && editingAlert.editing"
			:alert="editingAlert"
			@close="defineEditingAlert(null)"
			@update:alert="(alert) => alertUpdated(alert)"
			@update:editing="(alert) => editingAlert.editing = alert" />
	</section>
</template>

<script lang="ts">
import { defineAsyncComponent, nextTick } from 'vue';
import type { Alerts, AlertsDTO } from '@martichou/sproot';
import { opt } from '@/utils/help';

export default {
	name: 'Alerts',

	components: {
		UpdateAlertModal: defineAsyncComponent(() => import('@/components/UpdateAlertModal.vue')),
	},

	data() {
		return {
			alerts: new Array<Alerts>(),
			editingAlert: {
				original: opt<AlertsDTO>(),
				editing: opt<AlertsDTO>()
			},
			activeLoading: null,
			deleteLoading: null,
		}
	},

	mounted: function () {
		nextTick(async () => {
			await this.refreshList();
		})
	},

	methods: {
		defineEditingAlert: function(alert) {
			if (alert == null) {
				this.editingAlert = {
					original: null,
					editing: null,
				};
				// Force close to avoid issues (fails to reopen on first click next)
				(this.$refs.updateToggle as any).checked = false;
				return;
			}

			this.editingAlert = {
				original: alert,
				editing: Object.assign({}, alert)
			}
		},
		refreshList: async function() {
			await this.$http.get(this.$serverBase(this.$route.params.berta as string) + "/api/alerts?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					resp.data.forEach((elem: Alerts) => {
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
			if (this.activeLoading) return;
			this.activeLoading = alert.id;

			const payload = { whole: alert, update: { active: !alert.active }};
			await this.$http.patch(this.$serverBase(this.$route.params.berta as string) + "/api/alerts?id=" + alert.id, payload)
				.then((resp) => {
					const elem = resp.data as Alerts;

					const idx = this.alerts.findIndex(el => el.id == elem.id);
					if (idx !== -1) {
						this.alerts[idx] = elem
					} else {
						this.alerts.push(elem);
					}
				}).catch((err) => {
					// TODO - Handle erros
					console.log(err)
				});

			this.activeLoading = null;
		},
		deleteAlert: async function(alert) {
			if (this.deleteLoading) return;
			this.deleteLoading = alert.id;

			await this.$http.delete(this.$serverBase(this.$route.params.berta as string) + "/api/alerts?id=" + alert.id)
				.then((resp) => {
					if (resp.data === 1) {
						const idx = this.alerts.findIndex(el => el.id == alert.id);
						this.alerts.splice(idx, 1);
					}
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});

			this.deleteLoading = null;
		},
		alertUpdated: function(alert) {
			const idx = this.alerts.findIndex(el => el.id == alert.id);
			if (idx !== -1) {
				this.alerts[idx] = alert
			} else {
				this.alerts.push(alert);
			}
		}
	}
}
</script>

<style scoped lang="css">
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