<template>
	<section>
		<slot />
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
								<span class="text-[13px]" v-if="incident.alert">↪ {{ incident.alert.name }} ({{ incident.alert.info ?? incident.alert.lookup }})</span>
								<span class="text-[13px]" v-else>↪ delete alert</span>
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
			<section v-if="loading" class="mt-12 flex justify-center items-center h-52">
				<div class="prose-sm max-w-sm">
					<h1>Loading...</h1>
					<p>We are retrieving the incidents, please allow us a moment.</p>
				</div>
			</section>
			<section v-if="incidents.length === 0 && !loading" class="mt-12 flex justify-center items-center h-52">
				<div class="prose-sm max-w-sm">
					<h1>No incidents.</h1>
					<div class="w-fit mx-auto flex flex-col">
						<span>┈┈┈┈┈┈▕▔╲</span>
						<span>┈┈┈┈┈┈┈▏▕</span>
						<span>┈┈┈┈┈┈┈▏▕▂▂▂▂</span>
						<span>▂▂▂▂▂▂╱┈▕▂▂▂▏</span>
						<span>▉▉▉▉▉┈┈┈▕▂▂▂▏</span>
						<span>▉▉▉▉▉┈┈┈▕▂▂▂▏</span>
						<span>▔▔▔▔▔▔╲▂▕▂▂▂▏</span>
					</div>
				</div>
			</section>
		</div>
	</section>
</template>

<script lang="ts">
import { DateTime } from 'luxon';
import type { IncidentsJoined } from "@martichou/sproot";
import { fmtDuration } from '@/utils/time';

export default {
	name: 'IncidentsBase',

	props: {
		incidents: {
			type: Array<IncidentsJoined>,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		}
	},

	methods: {
		fmtStarted: function(started_at) {
			return DateTime.fromISO(started_at).toLocaleString(DateTime.DATETIME_SHORT);
		},
		getLength: function(from, to, tox) {
			return fmtDuration(DateTime.fromISO(to ?? tox).diff(DateTime.fromISO(from)).as('seconds'));
		},
	}
}
</script>