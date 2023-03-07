<template>
	<section>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Incidents
				</h1>
			</div>
		</div>
		<div class="mt-12">
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
								{{ moment(incident.started_at).format("hh:mm A - D MMMM YYYY") }}
							</td>
							<td  class="min">
								{{ getLength(incident.started_at, incident.updated_at, incident.resolved_at) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="mt-8 flex justify-center">
				<div class="btn-group">
					<button class="btn btn-active">
						1
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue';
import { useIncidentsStore } from '@/stores/incidents';
import { useServersStore } from '@/stores/servers';
import { fmtDuration } from '@/utils/help';
import moment from 'moment';

export default {
	name: 'Incidents',

	setup () {
		const store = useIncidentsStore();
		const serverStore = useServersStore();
		const { bertas } = storeToRefs(serverStore)
		return { store, serverStore, bertas, moment }
	},

	data () {
		return {
			incidents: []
		}
	},

	mounted: function () {
		const vm = this

		nextTick(async () => {
			await vm.refreshList();
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
		getLength: function(from, to, tox) {
			return fmtDuration(moment.duration(moment(to ?? tox).diff(moment(from))).asSeconds());
		},
		refreshList: async function() {
			for (const berta of this.bertas.keys()) {
				await this.$http.get(this.$serverBase(berta) + '/api/incidents')
					.then((resp) => {
						resp.data.forEach(elem => {
							const idx = this.incidents.findIndex(el => el.id == elem.id);
							if (idx !== -1) {
								this.incidents[idx] = elem
							} else {
								this.incidents.push(elem);
							}
						})
					}).catch((err) => {
						console.error(err)
					})
			}
		}
	}
}
</script>