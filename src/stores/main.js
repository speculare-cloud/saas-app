import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
	state: () => {
		return { isLogged: false, }
	},
	actions: {
		setLogged(newIsLogged) {
			this.isLogged = newIsLogged;
		},
	},
	persist: true,
})