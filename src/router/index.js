import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index.js'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Home from '../views/Home.vue'
import Facsimile from '../views/Facsimile.vue'
import Card from '../views/Card.vue'
import Contracts from '../views/Contracts.vue'
import Tarif from "../views/Tarifs.vue";
import Utilizations from '../views/Utilizations.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/facsimile',
    name: 'facsimile',
    component: Facsimile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Contracts,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/card',
    name: 'card',
    component: Card,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tariffs',
    name: 'tarif',
    component: Tarif,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/utilizations',
    name: 'utilizations',
    component: Utilizations,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
