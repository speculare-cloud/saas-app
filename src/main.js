import { createApp } from 'vue'
import { router } from '@/router'
import { createPinia } from 'pinia'
import { useMainStore } from '@/stores/main'

import PersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'

import axios from 'axios'
import moment from 'moment'

require("moment-duration-format")(moment);

import '@/assets/app.css'
import '@/assets/uPlot.css'

const httpAxios = axios.create({
	timeout: 10000,
	withCredentials: true
});

const pinia = createPinia().use(PersistedState);
const app = createApp(App);

// Init pinia before using it
app.use(pinia);

const store = useMainStore();

const bertaOverride = process.env.VUE_APP_BERTA_OVERRIDE;
const cdcOverride = process.env.VUE_APP_CDC_OVERRIDE;

app.config.globalProperties.$authBase = process.env.VUE_APP_AUTH_SERVER;
app.config.globalProperties.$authCdc = process.env.VUE_APP_AUTH_CDC;
app.config.globalProperties.$bertaOverride = bertaOverride;
app.config.globalProperties.$cdcOverride = cdcOverride;
app.config.globalProperties.$http = httpAxios;

app.config.globalProperties.$cdcBase = function getBaseCDCUrl (berta) {
	return cdcOverride ? cdcOverride : "wss://rt." + berta + ".speculare.cloud:9641";
}
app.config.globalProperties.$serverBase = function getBaseServer (berta) {
	return bertaOverride ? bertaOverride : "https://" + berta + ".speculare.cloud";
};

// Logout the user if he's not logged at loading
(async() => {
	if (store.isLogged) {
		await httpAxios.get(app.config.globalProperties.$authBase + "/api/whoami")
			.then(() => {}).catch(() => {
				store.logout();
				router.replace({ name: 'Login' })
			});
	}
})();

// Enforce auth requirement for the views
router.beforeEach(async(toRoute, _fromRoute, next) => {
	if (toRoute.meta.requireAuth && !store.isLogged) {
		next({ name: 'Login' });
	} else if (!toRoute.meta.requireAuth) {
		await httpAxios.get(app.config.globalProperties.$authBase + "/api/whoami")
			.then((resp) => {
				store.logged(resp.data);
				if (toRoute.meta.accessibleBoth) {
					next();
				} else {
					next({ name: 'Servers' });
				}
			}).catch((err) => {
				console.log("logged out", err);
				store.logout();
				next();
			});
	} else {
		window.document.title = (toRoute.meta.pageName ?? toRoute.name) + " - Speculare Console";
		next();
	}
});

app.use(router);

app.mount('#app');