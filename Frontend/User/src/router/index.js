import { createRouter, createWebHistory } from 'vue-router'
import { authAPI } from '@/services/api'
import QueueDetailView from '@/views/QueueDetailView.vue'
import UserManagementView from '../views/UserManagementView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/',
    redirect: '/blog'
  },
  {
    path: '/blog',
    name: 'BlogManager',
    component: () => import('@/views/BlogManagerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/BlogCategory',
    name: 'BlogCategory',
    component: () => import('@/views/BlogCategory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/contact',
    name: 'ContactTable',
    component: () => import('@/views/ContactView.vue'),
    meta: { requiresAuth: true }
  }, 
  {
    path: '/test-management',
    name: 'TestManagement',
    component: () => import('@/views/TestManagementView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/test-detail/:id',
    name: 'TestDetail',
    component: () => import('@/views/TestDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/queue-management',
    name: 'QueueManagement',
    component: () => import('@/views/QueueManagementView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/booking/:id',
    name: 'BookingDetail',
    component: () => import('@/views/BookingDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/queue-detail/:id',
    name: 'QueueDetail',
    component: QueueDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('@/views/ChartDataAssignment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: UserManagementView,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authAPI.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
