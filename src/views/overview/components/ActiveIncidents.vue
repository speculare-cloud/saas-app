<template>
	<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
		<h6 class="text-[#c5c8cb]">
			Active incidents
		</h6>
		<p class="text-[13px]">
			Breakdown of the active incidents by types accross all servers
		</p>
		<div class="pt-4 flex flex-row justify-around items-center gap-20">
			<div class="text-sm flex flex-row gap-4">
				<div class="space-y-2">
					<p class="pl-2 border-l-2 border-[#FF4136]">
						Critical
					</p>
					<p class="pl-2 border-l-2 border-[#EAB839]">
						Warning
					</p>
				</div>
				<div class="space-y-2 text-center text-white font-medium">
					<p>
						{{ incidentsStatus[0] }}
					</p>
					<p>
						{{ incidentsStatus[1] }}
					</p>
				</div>
			</div>

			<div class="relative h-28 w-28 flex justify-center items-center">
				<Doughnut v-if="arrSum(incidentsStatus) !== 0 && isData" :options="dognOpt" :data="(isData as any)" />
				<div v-else class="text-center">
					No active incidents
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Doughnut } from 'vue-chartjs'

import { Chart as ChartJS, ArcElement, type ChartData } from 'chart.js'
import { nextTick } from 'vue'
import { opt, arrSum } from '../../../utils/help';
import { storeToRefs } from 'pinia';
import { useIncidentsStore } from '../../../stores/incidents';
import { dognOpt } from '../../../utils/graphs';

ChartJS.register(ArcElement)

export default {
	name: 'ActiveIncidents',

	components: {
		Doughnut,
	},

	setup() {
		const incidentsStore = useIncidentsStore();

		const { incidents } = storeToRefs(incidentsStore);

		return { incidents, dognOpt, arrSum }
	},

	data() {
		return {
			isData: opt<ChartData>(),
		}
	},

	watch: {
		incidents: {
			handler() {
				this.refreshIncidentsStatus();
			},
			deep: true
		},
	},

	computed: {
		incidentsStatus() {
			const active = this.incidents.filter((el) => el.resolved_at === null)
			const critCount = active.filter((el) => el.severity === 1).length;
			return [
				critCount,
				active.length - critCount,
			]
		}
	},

	mounted() {
		nextTick(async () => this.refreshIncidentsStatus())
	},

	methods: {
		refreshIncidentsStatus: function() {
			this.isData = {
				datasets: [{
					data: [
						this.incidentsStatus[0],
						this.incidentsStatus[1],
					],
					backgroundColor: [
						'#FF4136',
						'#EAB839',
					],
				}]
			};
		}
	}
}
</script>