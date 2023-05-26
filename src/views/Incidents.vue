<template>
	<IncidentsBase :incidents="incidents" :loading="loadingIncidents">
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
import type { IncidentsJoined } from "@martichou/sproot";

import IncidentsBase from '@/components/IncidentsBase.vue';

export default {
	name: 'Incidents',

	components: { IncidentsBase },

	setup () {
		const serverStore = useServersStore();
		const { bertas } = storeToRefs(serverStore)
		return { serverStore, bertas }
	},

	data () {
		return {
			loadingIncidents: true,
			incidents: new Array<IncidentsJoined>()
		}
	},

	mounted: function () {
		nextTick(async () => {
			await this.refreshList();
		})
	},

	watch: {
		// execute the refresh when the bertas get updated too (in case of new bertas).
		bertas: {
			async handler() {
				await this.refreshList();
			},
			deep: true
		}
	},

	methods: {
		refreshList: async function() {
			for (const berta of this.bertas.keys()) {
				await this.$http.get(this.$serverBase(berta) + "/api/incidents")
					.then((resp) => {
						resp.data.forEach((elem: IncidentsJoined) => {
							const idx = this.incidents.findIndex(el => el.id == elem.id);
							if (idx !== -1) {
								this.incidents[idx] = elem
							} else {
								this.incidents.push(elem);
							}
						})
					}).catch((err) => {
						// TODO - Handle errors
						console.error(err)
					})
			}

			this.loadingIncidents = false;
		}
	}
}
</script>