import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
	state: () => {
		return {
			// List of different Bertas hosted user's servers
			bertas: [],
			// List of owned keys by the user with info from Bertas.
			unconfiguredKeys: [],
			// List of owned keys + hostname and basics info of the server
			configuredKeys: [],
		}
	},
})