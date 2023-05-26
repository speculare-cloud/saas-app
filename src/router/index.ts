import { createRouter, createWebHistory } from 'vue-router'

import Base from '@/layouts/Base.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () =>
			import('@/views/miscs/404.vue'),
		meta: {
			accessibleBoth: true
		}
	}, {
		path: '/',
		component: Base,
		redirect: ({
			name: 'Overview'
		}),
		children: [{
			path: 'overview',
			name: 'Overview',
			component: () =>
				import('@/views/Overview.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'servers',
			name: 'Servers',
			component: () =>
				import('@/views/server/List.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'servers/:berta/:uuid/:hostname',
			name: 'DetailsServer',
			component: () =>
				import('@/views/server/Details.vue'),
			meta: {
				requireAuth: true,
				child: 'servers',
				pageName: 'Details server'
			},
		}, {
			path: 'servers/:berta/:uuid/:hostname/alerts',
			name: 'AlertsServer',
			component: () =>
				import('@/views/server/Alerts.vue'),
			meta: {
				requireAuth: true,
				child: 'servers',
				pageName: 'Alerts server'
			}
		}, {
			path: 'servers/:berta/:uuid/:hostname/incidents',
			name: 'IncidentsServer',
			component: () =>
				import('@/views/server/Incidents.vue'),
			meta: {
				requireAuth: true,
				child: 'servers',
				pageName: 'Incidents server'
			}
		}, {
			path: 'servers/new',
			name: 'NewServer',
			component: () =>
				import('@/views/server/New.vue'),
			meta: {
				requireAuth: true,
				child: 'servers',
				pageName: 'New server'
			}
		}, {
			path: 'servers/new/:secretKey',
			name: 'NewDetails',
			component: () =>
				import('@/views/server/New.vue'),
			meta: {
				requireAuth: true,
				child: 'servers',
				pageName: 'New server'
			}
		}, {
			path: 'incidents',
			name: 'Incidents',
			component: () =>
				import('@/views/Incidents.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'notifications',
			name: 'Notifications',
			component: () =>
				import('@/views/mngmt/Notifications.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'billing',
			name: 'Billing',
			component: () =>
				import('@/views/mngmt/Billing.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'account',
			name: 'Account',
			component: () =>
				import('@/views/mngmt/Account.vue'),
			meta: {
				requireAuth: true
			}
		}, {
			path: 'help',
			name: 'Help',
			component: () =>
				import('@/views/miscs/Help.vue'),
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
})

export default router
