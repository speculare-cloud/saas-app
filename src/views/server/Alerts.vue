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
						<div class="tooltip" :data-tip="!(alert.loading ?? false) ? (alert.active ? 'Pause' : 'Resume') : 'Loading'">
							<button
								@click="actionAlert(alert)" class="status-indicator status-indicator--xs"
								:class="!(alert.loading ?? false) ? (alert.active ? 'status-indicator--success' : 'status-indicator--danger') : 'status-indicator--warning'">
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
					<div class="text-right">
						<button class="w-fit btn group-hover:btn-info !h-10 !min-h-[2.5rem] normal-case" key="add_server">
							Edit
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { nextTick } from 'vue';

export default {
	name: 'Incidents',

	data() {
		return {
			alerts: [],
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
		actionAlert: async function(alert) {
			alert.loading = true;
			const payload = { active: !alert.active};
			await this.$http.patch(this.$serverBase(this.$route.params.berta) + "/api/alerts?id=" + alert.id, payload)
				.then((resp) => {
					const elem = resp.data;
					const idx = this.alerts.findIndex(el => el.id == elem.id);
					if (idx !== -1) {
						this.alerts[idx] = elem
					} else {
						this.alerts.push(elem);
					}
				}).catch((err) => {
					// TODO - Handle errors
					console.log(err);
				});
			alert.loading = false;
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