import { groupBy } from '../../../utils/help';
<template>
	<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
		<h6 class="text-[#c5c8cb]">
			Reliability score
		</h6>
		<p class="text-[13px]">
			Breakdown of the least reliable servers (by incidents count)
		</p>
		<div class="pt-4">
			<div class="overflow-x-auto rounded-lg shadow">
				<table class="table w-full text-[#c5c8cb]">
					<thead>
						<tr>
							<th>Server</th>
							<th class="text-right">
								Incidents
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="el in leaderboard" :key="el[0]">
							<td>{{ el[1].hostname }}</td>
							<td class="text-right">
								{{ el[1].count }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { groupBy } from "@/utils/help";

export default {
	name: 'ActiveIncidents',

	setup() {
		return { groupBy }
	},

	computed: {
		leaderboard() {
			const arr = new Array<{host_uuid: string, hostname: string, count: number}>();

			this.$incidentsStore.incidents.forEach(element => {
				const idx = arr.findIndex((el) => el.host_uuid === element.host_uuid);
				if (idx !== -1) {
					arr[idx] = {
						...arr[idx],
						count: arr[idx].count++
					}
				} else {
					arr.push({
						host_uuid: element.host_uuid,
						hostname: element.hostname,
						count: 1
					});
				}
			});

			arr.sort((a, b) => {
				if (a.count > b.count) {
					return 1
				}

				return -1
			});
			arr.slice(0, 5);

			return arr;
		}
	}
}
</script>