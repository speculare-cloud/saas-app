<template>
	<IncidentsBase :incidents="incidents" :loading="loadingIncidents">
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
						Incidents
					</h1>
				</div>
			</div>
		</div>
	</IncidentsBase>
</template>

<script lang="ts">
import { nextTick } from 'vue';
import type { IncidentsJoined } from '@martichou/sproot';

import IncidentsBase from '@/components/IncidentsBase.vue';

export default {
	name: "Incidents",

	components: { IncidentsBase },

	data() {
		return {
			loadingIncidents: true,
			incidents: new Array<IncidentsJoined>()
		};
	},

	mounted: function () {
		nextTick(async () => {
			await this.refreshList();
		});
	},

	methods: {
		refreshList: async function () {
			await this.$http.get(this.$serverBase(this.$route.params.berta as string) + "/api/incidents?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					resp.data.forEach((elem: IncidentsJoined) => {
						const idx = this.incidents.findIndex(el => el.id == elem.id);
						if (idx !== -1) {
							this.incidents[idx] = elem;
						}
						else {
							this.incidents.push(elem);
						}
					});
				}).catch((err) => {
					// TODO - Handle errors
					console.error(err);
				});

			this.loadingIncidents = false;
		}
	},
}
</script>