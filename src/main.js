import { createApp } from 'vue'
import { router } from '@/router'
import { store } from '@/store'
import App from '@/App.vue'
import axios from 'axios'

import '@/assets/app.css'

const app = createApp(App)

// Enforce auth requirement for the views
router.beforeEach(async(toRoute, _fromRoute, next) => {
    if (toRoute.meta.requireAuth && !store.state.isLogged) {
        next({ name: 'Login' });
    } else if (!toRoute.meta.requireAuth) {
        await axios.get("https://auth.speculare.cloud/api/whoami", { withCredentials: true })
            .then(() => {
                store.commit({
                    type: 'setLogged',
                    isLogged: true
                });
                next({ name: 'Home' });
            }).catch(() => {
                store.commit({
                    type: 'setLogged',
                    isLogged: false
                });
                next();
            });
    } else {
        window.document.title = toRoute.name + " - Speculare Console";
        next();
    }
})

app.use(router)
app.use(store)

app.mount('#app')