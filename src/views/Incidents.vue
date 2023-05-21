<template>
	<section>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Incidents
				</h1>
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
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue';
import { useServersStore } from '@/stores/servers';
import { DateTime } from 'luxon';
import type { IncidentsJoined } from "@martichou/sproot";
import { fmtDuration } from '@/utils/time';

export default {
	name: 'Incidents',

	setup () {
		const serverStore = useServersStore();
		const { bertas } = storeToRefs(serverStore)
		return { serverStore, bertas }
	},

	data () {
		return {
			incidents: new Array<IncidentsJoined>()
		}
	},

	mounted: function () {
		nextTick(async () => {
			await this.refreshList();
		})
	},

	watch: {
		// execute the refresh when the bertas get updated too (in case of new bertas).
		bertas: {
			async handler() {
				await this.refreshList();
			},
			deep: true
		}
	},

	methods: {
		fmtStarted: function(started_at) {
			return DateTime.fromISO(started_at).toFormat("hh:mm A - D MMMM YYYY");
		},
		getLength: function(from, to, tox) {
			return fmtDuration(DateTime.fromISO(to ?? tox).diff(DateTime.fromISO(from)).as('seconds'));
		},
		refreshList: async function() {
			for (const berta of this.bertas.keys()) {
				await this.$http.get(this.$serverBase(berta) + "/api/incidents")
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
}
</script>