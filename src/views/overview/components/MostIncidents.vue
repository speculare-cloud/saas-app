import { groupBy } from '../../../utils/help';
<template>
	<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1 col-span-2">
		<h6 class="text-[#c5c8cb]">
			Reliability
		</h6>
		<p class="text-[13px]">
			Breakdown of the least reliable servers (by incidents count)
		</p>
		<div class="scroll-bg-300 mt-4 h-full overflow-x-auto overflow-y-auto rounded-lg">
			<table class="table alternate w-full text-[#c5c8cb]">
				<thead>
					<tr>
						<th>Server</th>
						<th class="text-right">
							Incidents
						</th>
					</tr>
				</thead>
				<tbody v-if="leaderboard.length > 0">
					<tr v-for="el in leaderboard" :key="el.host_uuid">
						<td>{{ el.hostname }}</td>
						<td class="text-right">
							{{ el.count >= 100 ? '100+' : el.count }}
						</td>
					</tr>
				</tbody>
			</table>
			<section v-if="leaderboard.length === 0" class="mt-10 flex justify-center items-center">
				<div class="prose-sm max-w-sm">
					<h3>Nothing to show.</h3>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import { groupBy } from "@/utils/help";

export default {
	name: 'MostIncidents',

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
						count: arr[idx].count + 1
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
				if (a.count < b.count) {
					return 1
				}

				return -1
			});

			return arr.slice(0, 5);
		}
	}
}
</script>