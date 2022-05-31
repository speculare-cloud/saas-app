import { createApp } from 'vue'
import { router } from '@/router'
import { createPinia } from 'pinia'
import { useMainStore } from '@/stores/main'

import PersistedState from 'pinia-plugin-persistedstate'
import App from '@/App.vue'

import axios from 'axios'

import '@/assets/app.css'

const httpAxios = axios.create({
	withCredentials: true
});

const pinia = createPinia().use(PersistedState);
const app = createApp(App);

// Init pinia before using it
app.use(pinia);

const store = useMainStore();

app.config.globalProperties.$authBase = process.env.VUE_APP_AUTH_SERVER;
app.config.globalProperties.$bertaOverride = process.env.VUE_APP_BERTA_OVERRIDE;
app.config.globalProperties.$http = httpAxios;

// Logout the user if he's not logged at loading
(async() => {
	if (store.isLogged) {
		await httpAxios.get(app.config.globalProperties.$authBase + "/api/whoami")
			.then(() => {
				store.setLogged(true);
				router.replace({ name: 'Home' });
			}).catch(() => {
				store.setLogged(false);
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
			.then(() => {
				store.setLogged(true);
				next({ name: 'Home' });
			}).catch(() => {
				store.setLogged(false);
				next();
			});
	} else {
		window.document.title = toRoute.name + " - Speculare Console";
		next();
	}
});

app.use(router);

app.mount('#app');