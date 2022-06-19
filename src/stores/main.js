import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
	state: () => {
		return {
			isLogged: false,
			userId: null,
		}
	},
	actions: {
		logged(userId) {
			this.isLogged = true;
			this.userId = userId;
		},
		logout() {
			this.isLogged = false;
			this.userId = null;
		}
	},
	persist: true,
})