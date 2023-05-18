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
						Incidents
					</h1>
				</div>
			</div>
		</div>
		<div class="mt-12 mb-12">
			<div class="overflow-x-auto no-scrollbar rounded-lg shadow">
				<table class="table w-full text-[#c5c8cb]">
					<thead>
						<tr>
							<th />
							<th class="flex flex-col">
								<span>Server</span>
								<span>↪ Alert</span>
							</th>
							<th>Started at</th>
							<th>Duration</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="incident in incidents" :key="incident.id" class="text-[13px]">
							<td class="min">
								<span v-if="!incident.status">ongoing&nbsp;</span>
								<span v-if="incident.status" class="text-success">resolved</span>
								<span v-else-if="incident.severity" class="text-error">critical</span>
								<span v-else class="text-warning">warning</span>
							</td>
							<td class="flex flex-col">
								<span class="text-sm text-white">{{ incident.hostname }}</span>
								<span class="text-[13px]">↪ {{ incident.alert.name }} ({{ incident.alert.info ?? incident.alert.lookup }})</span>
							</td>
							<td>
								{{ fmtStarted(incident.started_at) }}
							</td>
							<td  class="min">
								{{ getLength(incident.started_at, incident.updated_at, incident.resolved_at) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { nextTick } from 'vue';
import { fmtDuration } from '@/utils/help';
import { DateTime } from 'luxon';
import type { IncidentsJoined } from '@martichou/sproot';

export default {
	name: 'Incidents',

	data () {
		return {
			incidents: new Array<IncidentsJoined>()
		}
	},

	mounted: function () {
		const vm = this

		nextTick(async () => {
			await vm.refreshList();
		})
	},

	methods: {
		fmtStarted: function(started_at) {
			return DateTime.fromISO(started_at).toFormat("hh:mm A - D MMMM YYYY");
		},
		getLength: function(from, to, tox) {
			return fmtDuration(DateTime.fromISO(to ?? tox).diff(DateTime.fromISO(from)).seconds);
		},
		refreshList: async function() {
			await this.$http.get(this.$serverBase(this.$route.params.berta) + "/api/incidents?uuid=" + this.$route.params.uuid)
				.then((resp) => {
					resp.data.forEach((elem: IncidentsJoined) => {
						const idx = this.incidents.findIndex(el => el.id == elem.id);
						if (idx !== -1) {
							this.incidents[idx] = elem
						} else {
							this.incidents.push(elem);
						}
					})
				}).catch((err) => {
					// TODO - Handle errors
					console.error(err)
				})
		}
	}
}
</script>