<template>
	<section>
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Incidents
				</h1>
			</div>
			<div class="mt-4 md:mt-0 flex flex-col items-start sm:flex-row sm:space-x-4">
				<div class="mb-3 relative self-stretch sm:mb-0 sm:self-end w-[265px]">
					<svg class="absolute left-[12px] top-[13px]" height="14" viewBox="0 0 14 14" width="14">
						<path
							stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" stroke="currentColor"
							d="M13 13L9.61539 9.61539M11.0513 6.02564C11.0513 6.68562 10.9213 7.33913 10.6687 7.94887C10.4162 8.55861 10.046 9.11263 9.57931 9.57931C9.11263 10.046 8.55861 10.4162 7.94887 10.6687C7.33913 10.9213 6.68562 11.0513 6.02564 11.0513C5.36566 11.0513 4.71215 10.9213 4.10241 10.6687C3.49267 10.4162 2.93865 10.046 2.47198 9.57931C2.0053 9.11263 1.63512 8.55861 1.38255 7.94887C1.12999 7.33913 1 6.68562 1 6.02564C1 4.69276 1.52949 3.41447 2.47198 2.47198C3.41447 1.52949 4.69276 1 6.02564 1C7.35852 1 8.63682 1.52949 9.57931 2.47198C10.5218 3.41447 11.0513 4.69276 11.0513 6.02564Z" />
					</svg>

					<input
						type="text" placeholder="Search monitors"
						class="input input-bordered w-full bg-base-300 !pl-[34px] h-10"
						style="font-size: 0.875rem;">
				</div>
			</div>
		</div>
		<div class="mt-12">
			<div class="overflow-x-auto no-scrollbar rounded-lg shadow">
				<table class="table w-full text-[#c5c8cb]">
					<thead>
						<tr>
							<th />
							<th>Server</th>
							<th>Started at</th>
							<th>Length</th>
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
							<td class="text-white text-sm">
								{{ incident.hostname }}
							</td>
							<td>
								{{ moment(incident.started_at).format("hh:mm A - D MMMM YYYY") }}
							</td>
							<td>
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
							console.log(elem);
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