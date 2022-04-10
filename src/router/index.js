import { createRouter, createWebHistory } from 'vue-router'

import Base from '@/layouts/Base'

const routes = [{
	path: '/',
	component: Base,
	redirect: ({
		name: 'Home'
	}),
	children: [{
		path: 'home',
		name: 'Home',
		component: () =>
			import ('@/views/HomeView'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'billing',
		name: 'Billing',
		component: () =>
			import ('@/views/BillingView'),
		meta: {
			requireAuth: true,
		}
	}]
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