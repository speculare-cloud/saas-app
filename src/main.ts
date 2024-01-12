import 'vue-toastification/dist/index.css'
import '@/assets/uPlot.css'
import '@/assets/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useMainStore } from '@/stores/main'
import { useIncidentsStore } from '@/stores/incidents'
import { useServersStore } from '@/stores/servers'

import App from '@/App.vue'
import router from '@/router'

import axios, { type AxiosInstance } from "axios"
import PersistedState from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'
import type { useRoute, useRouter } from 'vue-router'

const pinia = createPinia().use(PersistedState)
const app = createApp(App)
app.use(pinia)

const mainStore = useMainStore()
const incidentsStore = useIncidentsStore()
const serversStore = useServersStore()

const bertaOverride = import.meta.env.VITE_BERTA_OVERRIDE
const cdcOverride = import.meta.env.VITE_CDC_OVERRIDE

app.config.globalProperties.$mainStore = mainStore
app.config.globalProperties.$incidentsStore = incidentsStore
app.config.globalProperties.$serversStore = serversStore

app.config.globalProperties.$authBase = import.meta.env.VITE_AUTH_SERVER
app.config.globalProperties.$authCdc = import.meta.env.VITE_AUTH_CDC

const client = axios.create({
	timeout: 10000,
	withCredentials: true
})

app.config.globalProperties.$http = client

function getBaseCDCUrl (berta) {
	return cdcOverride || 'wss://rt.' + berta + '.speculare.cloud'
}

app.config.globalProperties.$cdcBase = getBaseCDCUrl
app.config.globalProperties.$serverBase = function getBaseServer (berta) {
	return bertaOverride || 'https://' + berta + '.speculare.cloud'
};

// Logout the user if he's not logged at loading
(async () => {
	if (mainStore.isLogged) {
		await client.get(app.config.globalProperties.$authBase + '/api/whoami')
			.then(() => {
				// do nothing.
			}).catch(() => {
				mainStore.logout()
				router.replace({ name: 'Login' })
			})
	}
})()

// Enforce auth requirement for the views
router.beforeEach(async (toRoute, _fromRoute, next) => {
	if (toRoute.meta.requireAuth && !mainStore.isLogged) {
		next({ name: 'Login' })
	} else if (!toRoute.meta.requireAuth) {
		await client.get(app.config.globalProperties.$authBase + '/api/whoami')
			.then(async (resp) => {
				mainStore.logged(resp.data)
				if (toRoute.meta.accessibleBoth) {
					next()
				} else {
					next({ name: 'Overview' })
				}
			}).catch(() => {
				mainStore.logout()
				next()
			})
	} else {
		window.document.title = (toRoute.meta.pageName ?? toRoute.name) + ' - Speculare Console'
		next()
	}
})

app.use(Toast)
app.use(router)
app.mount('#app')

router.currentRoute;

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$http: AxiosInstance;
		$authBase: string;
		$authCdc: string;
		$cdcBase: (b: string) => string;
		$serverBase: (b: string) => string;
		$mainStore: ReturnType<typeof useMainStore>;
		$incidentsStore: ReturnType<typeof useIncidentsStore>;
		$serversStore: ReturnType<typeof useServersStore>;
		$route: ReturnType<typeof useRoute>;
		$router: ReturnType<typeof useRouter>;
	}
}
