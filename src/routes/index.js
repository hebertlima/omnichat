import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: () => import('@/views/Dashboard.vue'),
		children: [
			{
				path: '',
				name: 'attendance',
				component: () => import('@/pages/Attendance.vue')
			}, {
				path: '/widgets',
				name: 'widgets',
				component: () => import('@/pages/Widgets.vue')
			}
		]
	},
	{
		path: '/chat',
		name: 'Chat',
		component: () => import('@/views/Chat.vue')
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior () {
		return { top: 0 }
	}
})

export default router