import { createRouter, createWebHistory } from 'vue-router'

import Base from '@/layouts/Base'

const routes = [{
	path: '/:pathMatch(.*)*',
	name: '404',
	component: () =>
		import('@/views/miscs/404'),
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
			import('@/views/server/List'),
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
		},
	}, {
		path: 'servers/:berta/:uuid/:hostname/alerts',
		name: 'AlertsServer',
		component: () =>
			import('@/views/server/Alerts'),
		meta: {
			requireAuth: true,
			child: 'servers',
			pageName: 'Alerts server'
		}
	}, {
		path: 'servers/:berta/:uuid/:hostname/incidents',
		name: 'IncidentsServer',
		component: () =>
			import('@/views/server/Incidents'),
		meta: {
			requireAuth: true,
			child: 'servers',
			pageName: 'Incidents server'
		}
	}, {
		path: 'servers/new',
		name: 'NewServer',
		component: () =>
			import('@/views/server/New'),
		meta: {
			requireAuth: true,
			child: 'servers',
			pageName: 'New server'
		}
	}, {
		path: 'servers/new/:secretKey',
		name: 'NewDetails',
		component: () =>
			import('@/views/server/New'),
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
			import('@/views/mngmt/Notifications'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'billing',
		name: 'Billing',
		component: () =>
			import('@/views/mngmt/Billing'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'account',
		name: 'Account',
		component: () =>
			import('@/views/mngmt/Account'),
		meta: {
			requireAuth: true
		}
	}, {
		path: 'help',
		name: 'Help',
		component: () =>
			import('@/views/miscs/Help'),
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
