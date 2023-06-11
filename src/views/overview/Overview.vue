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
			<div id="overview" class="flex flex-col md:grid grid-cols-2 xl:grid-cols-3 gap-4">
				<div class="flex flex-col p-5 bg-base-300 shadow-md rounded-lg gap-1">
					<h6 class="text-[#c5c8cb]">
						Servers
					</h6>
					<p class="text-[13px]">
						Number of configured servers
					</p>
					<div class="flex-1 flex justify-center items-center p-4 w-full">
						<h4 class="text-white text-2xl">
							{{ $serversStore.configuredKeys.length }}
						</h4>
					</div>
				</div>
				<ServersStatus />
				<ActiveIncidents />
				<MostIncidents />
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { useServersStore } from '@/stores/servers';
import { storeToRefs } from 'pinia';
import { defineAsyncComponent, nextTick } from 'vue'

export default {
	name: 'Billing',

	components: {
		ActiveIncidents: defineAsyncComponent({
			loader: () => import('@/views/overview/components/ActiveIncidents.vue'),
		}),
		ServersStatus: defineAsyncComponent({
			loader: () => import('@/views/overview/components/ServersStatus.vue'),
		}),
		MostIncidents: defineAsyncComponent({
			loader: () => import('@/views/overview/components/MostIncidents.vue'),
		})
	},

	setup() {
		const serverStore = useServersStore();

		const { bertas } = storeToRefs(serverStore)

		return { bertas }
	},

	watch: {
		bertas: {
			async handler() {
				await this.$incidentsStore.refresh(this.bertas.keys(), this);
			},
			deep: true
		}
	},

	mounted() {
		nextTick(async () => await this.$incidentsStore.refresh(this.bertas.keys(), this))
	},
}
</script>