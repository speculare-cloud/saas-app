import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
	state: () => {
		return {
			isLogged: false,
			userId: null,
		}
	},
	actions: {
		setLogged(newIsLogged) {
			this.isLogged = newIsLogged;
		},
		setUserId(userId) {
			this.userId = userId;
		}
	},
	persist: true,
})