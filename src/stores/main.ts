import { defineStore } from 'pinia';
import { opt } from '@/utils/help';

export const useMainStore = defineStore('main', {
	state: () => {
		return {
			isLogged: false,
			userId: opt<string>(),
		}
	},
	actions: {
		logged (userId: string) {
			this.isLogged = true
			this.userId = userId
		},
		logout () {
			this.isLogged = false
			this.userId = null
		},
	},
	persist: true
})
