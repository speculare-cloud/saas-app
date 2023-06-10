<template>
	<section>
		<div class="flex-col">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Overview
				</h1>
			</div>
		</div>
		<div class="mt-12 mb-12">
			<div class="flex flex-col md:grid grid-cols-2 xl:grid-cols-3 gap-4">
				<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
					<h6 class="text-[#c5c8cb]">
						Servers
					</h6>
					<p class="text-[13px]">
						Number of configured servers
					</p>
					<div class="flex justify-center items-center p-4 w-full h-full">
						<h4 class="text-white text-2xl">
							{{ $serversStore.configuredKeys.length }}
						</h4>
					</div>
				</div>
				<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
					<h6 class="text-[#c5c8cb]">
						Servers by status
					</h6>
					<p class="text-[13px]">
						Breakdown of the servers (un.configureds)
					</p>
					<div class="pt-4 flex flex-row justify-around items-center gap-20">
						<div class="text-sm flex flex-row gap-4">
							<div class="space-y-2">
								<p class="pl-2 border-l-2 border-[#34D399]">
									Online
								</p>
								<p class="pl-2 border-l-2 border-[#008080]">
									Offline
								</p>
								<p class="pl-2 border-l-2 border-[#DA70D6]">
									Waiting
								</p>
							</div>
							<div class="space-y-2 text-center text-white font-medium">
								<p>
									{{ serverStatus[0] }}
								</p>
								<p>
									{{ serverStatus[1] }}
								</p>
								<p>
									{{ serverStatus[2] }}
								</p>
							</div>
						</div>

						<div class="relative h-28 w-28 flex justify-center items-center">
							<Doughnut v-if="arrSum(serverStatus) !== 0 && ssData" :options="dognOpt" :data="(ssData as any)" />
							<div v-else>
								No servers
							</div>
						</div>
					</div>
				</div>
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
							<div v-else>
								No incidents
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Doughnut } from 'vue-chartjs'

import { Chart as ChartJS, Tooltip, ArcElement, type ChartData } from 'chart.js'
import { isServerOnline } from '@/utils/time'
import { nextTick } from 'vue'
import { opt, arrSum } from '../utils/help';
import { storeToRefs } from 'pinia';
import { useServersStore } from '@/stores/servers';
import { useIncidentsStore } from '../stores/incidents';

ChartJS.register(Tooltip, ArcElement)

export default {
	name: 'Billing',

	components: { Doughnut },

	setup() {
		const serverStore = useServersStore();
		const incidentsStore = useIncidentsStore();

		const { configuredKeys, unconfiguredKeys } = storeToRefs(serverStore);
		const { bertas } = storeToRefs(serverStore)
		const { incidents } = storeToRefs(incidentsStore);

		return { bertas, configuredKeys, unconfiguredKeys, incidents, arrSum }
	},

	data() {
		return {
			dognOpt: {
				responsive: true,
				borderWidth: 0,
				cutout: "80%"
			},
			ssData: opt<ChartData>(),
			isData: opt<ChartData>(),
		}
	},

	watch: {
		configuredKeys: {
			handler() {
				this.refreshServerStatus();
			},
			deep: true
		},
		unconfiguredKeys: {
			handler() {
				this.refreshServerStatus();
			},
			deep: true
		},
		incidents: {
			handler() {
				this.refreshIncidentsStatus();
			},
			deep: true
		},
		bertas: {
			async handler() {
				await this.$incidentsStore.refresh(this.bertas.keys(), this);
			},
			deep: true
		}
	},

	computed: {
		serverStatus() {
			const onlineCount = this.configuredKeys
				.filter((el) => isServerOnline(el.host.updated_at) == 2).length

			return [
				onlineCount,
				this.configuredKeys.length - onlineCount,
				this.unconfiguredKeys.length,
			]
		},
		incidentsStatus() {
			const critCount = this.incidents.filter((el) => el.severity === 1).length;
			return [
				critCount,
				this.incidents.length - critCount,
			]
		}
	},

	mounted() {
		nextTick(async () => {
			await this.$incidentsStore.refresh(this.bertas.keys(), this);
		})
	},

	methods: {
		refreshServerStatus: function() {
			this.ssData = {
				datasets: [{
					data: [
						this.serverStatus[0],
						this.serverStatus[1],
						this.serverStatus[2]
					],
					backgroundColor: [
						'#34D399',
						'#008080',
						'#DA70D6'
					],
				}]
			};
		},
		refreshIncidentsStatus: function() {
			this.isData = {
				datasets: [{
					data: [
						this.incidentsStatus[0],
						this.incidentsStatus[1],
					],
					backgroundColor: [
						'#FF4136',
						'#008080',
					],
				}]
			};
		}
	}
}
</script>