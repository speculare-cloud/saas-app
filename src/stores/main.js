import { defineStore } from 'pinia'
import { useToast, POSITION, TYPE } from 'vue-toastification'

const toast = useToast()

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
		},
		showToast(message, type=TYPE.SUCCESS, position=POSITION.TOP_LEFT) {
			toast(message, {
				type: type,
				position: position,
				timeout: 5000,
				closeOnClick: true,
				pauseOnFocusLoss: true,
				pauseOnHover: true,
				draggable: true,
				draggablePercent: 0.6,
				showCloseButtonOnHover: true,
				hideProgressBar: true,
				closeButton: "button",
				icon: true,
			});
		}
	},
	persist: true,
})