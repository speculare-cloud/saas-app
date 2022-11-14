import { defineStore } from 'pinia'

export const useIncidentsStore = defineStore('incidents', {
	state: () => {
		return {
			incidents: []
		}
	}
})
