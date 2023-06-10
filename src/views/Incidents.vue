<template>
	<IncidentsBase :incidents="$incidentsStore.incidents" :loading="$incidentsStore.loadingIncidents">
		<div class="md:flex justify-between">
			<div class="prose-sm flex justify-between items-center">
				<h1>
					Incidents
				</h1>
			</div>
		</div>
	</IncidentsBase>
</template>

<script lang="ts">
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue';
import { useServersStore } from '@/stores/servers';

import IncidentsBase from '@/components/IncidentsBase.vue';

export default {
	name: 'Incidents',

	components: { IncidentsBase },

	setup () {
		const serverStore = useServersStore();
		const { bertas } = storeToRefs(serverStore)

		return { bertas }
	},

	mounted: function () {
		nextTick(async () => {
			await this.$incidentsStore.refresh(this.bertas.keys(), this);
		})
	},

	watch: {
		// execute the refresh when the bertas get updated too (in case of new bertas).
		bertas: {
			async handler() {
				await this.$incidentsStore.refresh(this.bertas.keys(), this);
			},
			deep: true
		}
	},
}
</script>