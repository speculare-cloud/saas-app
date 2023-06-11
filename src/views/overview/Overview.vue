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
				<ServersStatus />
				<ActiveIncidents />
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue'

export default {
	name: 'Billing',

	components: {
		ActiveIncidents: defineAsyncComponent({
			loader: () => import('@/views/overview/components/ActiveIncidents.vue'),
		}),
		ServersStatus: defineAsyncComponent({
			loader: () => import('@/views/overview/components/ServersStatus.vue'),
		})
	},
}
</script>