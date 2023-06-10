<template>
	<section>
		<div class="flex-col">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Overview
				</h1>
			</div>
		</div>
		<div class="mt-12">
			<div class="flex flex-col md:flex-row gap-4">
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
					<div class="pt-2 flex flex-row justify-around items-center gap-20">
						<div class="text-sm flex flex-row gap-4">
							<div class="space-y-2">
								<p class="pl-2 border-l-2 border-[#34D399]">
									Online
								</p>
								<p class="pl-2 border-l-2 border-[#EAB839]">
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

						<div class="relative h-28 w-28">
							<Doughnut v-if="ssData" :options="ssOpt" :data="(ssData as any)" />
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
import { opt } from '../utils/help';

ChartJS.register(Tooltip, ArcElement)

export default {
	name: 'Billing',

	components: { Doughnut },

	data() {
		return {
			ssOpt: {
				responsive: true
			},
			ssData: opt<ChartData>()
		}
	},

	computed: {
		serverStatus() {
			const onlineCount = this.$serversStore.configuredKeys
				.filter((el) => isServerOnline(el.host.updated_at) == 2).length

			return [
				onlineCount,
				this.$serversStore.configuredKeys.length - onlineCount,
				this.$serversStore.unconfiguredKeys.length,
			]
		}
	},

	mounted() {
		nextTick(() => {
			this.ssData = {
				datasets: [{
					data: [
						this.serverStatus[0],
						this.serverStatus[1],
						this.serverStatus[2]
					],
					backgroundColor: [
						'#34D399',
						'#EAB839',
						'#DA70D6'
					],
				}]
			}
		})
	},
}
</script>