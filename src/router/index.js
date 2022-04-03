import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
	path: '/',
	redirect: ({
		name: 'login'
	}),
}, {
	path: '/login',
	name: 'login',
	component: () =>
		import ('@/views/LoginView.vue')
}, {
	path: '/register',
	name: 'register',
	component: () =>
		import ('@/views/RegisterView.vue')
}]

export const router = createRouter({
	history: createWebHistory(),
	routes
})