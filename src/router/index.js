import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'

const routes = [{
	path: '/',
	name: 'Home',
	component: HomeView,
	meta: {
		requireAuth: true,
	}
}, {
	path: '/login',
	name: 'Login',
	component: () =>
		import ('@/views/LoginView.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/register',
	name: 'Register',
	component: () =>
		import ('@/views/RegisterView.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/wait',
	name: 'Wait',
	component: () =>
		import ('@/views/CheckmailView.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/callback',
	component: () =>
		import ('@/views/Callback.vue'),
	meta: {
		requireAuth: false,
	}
}]

export const router = createRouter({
	history: createWebHistory(),
	routes
})