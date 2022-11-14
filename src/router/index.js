import { createRouter, createWebHistory } from 'vue-router'

import Base from '@/layouts/Base'

const routes = [{
	path: '/:pathMatch(.*)*',
	name: '404',
	component: () =>
		import('@/views/404'),
	meta: {
		accessibleBoth: true
	}
}, {
	path: '/',
	component: Base,
	redirect: ({
		name: 'Servers'
	}),
	children: [{
		path: 'servers',
		name: 'Servers',
		component: () =>
			import('@/views/Servers'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'servers/:berta/:uuid/:hostname',
		name: 'DetailsServer',
		component: () =>
			import('@/views/server/Details'),
		meta: {
			requireAuth: true,
			child: 'servers',
			pageName: 'Details server'
		}
	}, {
		path: 'servers/new',
		name: 'NewServer',
		component: () =>
			import('@/views/NewServer'),
		meta: {
			requireAuth: true,
			child: 'servers',
			pageName: 'New server'
		}
	}, {
		path: 'incidents',
		name: 'Incidents',
		component: () =>
			import('@/views/Incidents'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'notifications',
		name: 'Notifications',
		component: () =>
			import('@/views/Notifications'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'billing',
		name: 'Billing',
		component: () =>
			import('@/views/Billing'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'help',
		name: 'Help',
		component: () =>
			import('@/views/Help'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'account',
		name: 'Account',
		component: () =>
			import('@/views/Account'),
		meta: {
			requireAuth: true
		}
	}]
}, {
	path: '/login',
	name: 'Login',
	component: () =>
		import('@/views/auth/Login.vue'),
	meta: {
		requireAuth: false
	}
}, {
	path: '/register',
	name: 'Register',
	component: () =>
		import('@/views/auth/Register.vue'),
	meta: {
		requireAuth: false
	}
}, {
	path: '/wait',
	name: 'Wait',
	component: () =>
		import('@/views/auth/OpenMailbox.vue'),
	meta: {
		requireAuth: false
	}
}, {
	path: '/callback',
	component: () =>
		import('@/views/auth/Callback.vue'),
	meta: {
		requireAuth: false
	}
}]

export const router = createRouter({
	history: createWebHistory(),
	routes
})
