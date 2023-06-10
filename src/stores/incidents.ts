import type { IncidentsJoined } from '@martichou/sproot';
import { defineStore } from 'pinia'
import type { ComponentCustomProperties } from 'vue'

export const useIncidentsStore = defineStore('incidents', {
	state: () => {
		return {
			incidents: new Array<IncidentsJoined>(),
			loadingIncidents: true,
		}
	},
	actions: {
		async refresh(bertas: IterableIterator<string>, vm: ComponentCustomProperties) {
			for (const berta of bertas) {
				await vm.$http.get(vm.$serverBase(berta) + "/api/incidents")
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
					}).finally(() => this.loadingIncidents = false);
			}
		},
	}
})
