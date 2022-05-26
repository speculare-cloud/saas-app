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
			import ('@/views/Home'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'incidents',
		name: 'Incidents',
		component: () =>
			import ('@/views/Incidents'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'notifications',
		name: 'Notifications',
		component: () =>
			import ('@/views/Notifications'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'billing',
		name: 'Billing',
		component: () =>
			import ('@/views/Billing'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'help',
		name: 'Help',
		component: () =>
			import ('@/views/Help'),
		meta: {
			requireAuth: true,
		}
	}, {
		path: 'account',
		name: 'Account',
		component: () =>
			import ('@/views/Account'),
		meta: {
			requireAuth: true,
		}
	}]
}, {
	path: '/login',
	name: 'Login',
	component: () =>
		import ('@/views/auth/Login.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/register',
	name: 'Register',
	component: () =>
		import ('@/views/auth/Register.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/wait',
	name: 'Wait',
	component: () =>
		import ('@/views/auth/OpenMailbox.vue'),
	meta: {
		requireAuth: false,
	}
}, {
	path: '/callback',
	component: () =>
		import ('@/views/auth/Callback.vue'),
	meta: {
		requireAuth: false,
	}
}]

export const router = createRouter({
	history: createWebHistory(),
	routes
})