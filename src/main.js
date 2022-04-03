import { createApp } from 'vue'
import { router } from '@/router'
import { store } from '@/store'
import VueCookies from 'vue-cookies'
import App from '@/App.vue'

import '@/assets/app.css'

const app = createApp(App)

// Check if we're logged
store.commit({
	type: 'setLogged',
	isLogged: VueCookies.isKey("SP-CKS")
});

// Enforce auth requirement for the views
router.beforeEach((toRoute, _fromRoute, next) => {
	// Check if the page need auth (and if so and logged out, redirect)
	if (toRoute.meta.requireAuth && !store.state.isLogged) next({ name: 'Login' })
	window.document.title = toRoute.name + " - Speculare Console";
	next();
})

app.use(router)
app.use(store)

app.mount('#app')