import { createApp } from 'vue'
import { router } from '@/router'
import { store } from '@/store'
import { pluralize } from 'pluralize'
import App from '@/App.vue'

import '@/assets/app.css'

const app = createApp(App)

router.beforeEach((toRoute, _fromRoute, next) => {
	window.document.title = toRoute.name + " - Speculare Console";
	next();
})

app.use(router)
app.use(store)

app.config.globalProperties.$filters = {
	pluralize(value, number) {
		return pluralize(value, number)
	}
}

app.mount('#app')