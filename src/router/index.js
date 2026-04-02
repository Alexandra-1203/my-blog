import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blog/:userId',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('@/views/PostView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
  ],
})

// router.beforeEach((to) => {
//   const user = localStorage.getItem('user')
//   if (to.meta.requiresAuth && !user) {
//     return '/login'
//   }
//   return true
// })

export default router
