import { createApp } from 'vue'
import { router } from '@/router'
import { createPinia } from 'pinia'
import { useMainStore } from '@/stores/main'

import PersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'

import axios from 'axios'
import moment from 'moment'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import '@/assets/app.css'
import '@/assets/uPlot.css'

import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

const httpAxios = axios.create({
	timeout: 10000,
	withCredentials: true
})

const pinia = createPinia().use(PersistedState)
const app = createApp(App)

// Init pinia before using it
app.use(pinia)

const store = useMainStore()

const bertaOverride = import.meta.env.VITE_BERTA_OVERRIDE
const cdcOverride = import.meta.env.VITE_CDC_OVERRIDE

app.config.globalProperties.$authBase = import.meta.env.VITE_AUTH_SERVER
app.config.globalProperties.$authCdc = import.meta.env.VITE_AUTH_CDC
app.config.globalProperties.$bertaOverride = bertaOverride
app.config.globalProperties.$cdcOverride = cdcOverride
app.config.globalProperties.$http = httpAxios

app.config.globalProperties.$cdcBase = function getBaseCDCUrl (berta) {
	return cdcOverride || 'wss://rt.' + berta + '.speculare.cloud:9641'
}
app.config.globalProperties.$serverBase = function getBaseServer (berta) {
	return bertaOverride || 'https://' + berta + '.speculare.cloud'
};

// Logout the user if he's not logged at loading
(async () => {
	if (store.isLogged) {
		await httpAxios.get(app.config.globalProperties.$authBase + '/api/whoami')
			.then(() => {}).catch(() => {
				store.logout()
				router.replace({ name: 'Login' })
			})
	}
})()

// Enforce auth requirement for the views
router.beforeEach(async (toRoute, _fromRoute, next) => {
	if (toRoute.meta.requireAuth && !store.isLogged) {
		next({ name: 'Login' })
	} else if (!toRoute.meta.requireAuth) {
		await httpAxios.get(app.config.globalProperties.$authBase + '/api/whoami')
			.then((resp) => {
				store.logged(resp.data)
				if (toRoute.meta.accessibleBoth) {
					next()
				} else {
					next({ name: 'Servers' })
				}
			}).catch(() => {
				store.logout()
				next()
			})
	} else {
		window.document.title = (toRoute.meta.pageName ?? toRoute.name) + ' - Speculare Console'
		next()
	}
})

app.use(router)

app.use(Toast)

app.mount('#app')
