import { createStore } from 'vuex'

export const store = createStore({
	state() {
		return {
			isLogged: false,
		}
	},
	mutations: {
		setLogged(state, payload) {
			console.log("State is now:", payload);
			state.isLogged = payload.isLogged;
		}
	}
})