<template>
	<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
		<h6 class="text-[#c5c8cb]">
			Servers by status
		</h6>
		<p class="text-[13px]">
			Breakdown of the servers (un.configureds)
		</p>
		<div class="flex-1 mt-4 flex flex-row justify-around items-center gap-20">
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
				<div v-else class="text-center">
					No servers
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
import { useServersStore } from '@/stores/servers';
import { dognOpt } from '../../../utils/graphs';
import { isServerOnline } from '@/utils/time';

ChartJS.register(ArcElement)

export default {
	name: 'ActiveIncidents',

	components: {
		Doughnut,
	},

	setup() {
		const serverStore = useServersStore();

		const { configuredKeys, unconfiguredKeys } = storeToRefs(serverStore);

		return { configuredKeys, unconfiguredKeys, dognOpt, arrSum }
	},

	data() {
		return {
			ssData: opt<ChartData>(),
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
	},

	mounted() {
		nextTick(async () => this.refreshServerStatus());
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
	}
}
</script>