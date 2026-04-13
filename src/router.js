import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import ProductsList from './views/ProductsList.vue'
import ProductPage from './views/ProductPage.vue'
import AdminPanel from './views/AdminPanel/AdminPanel.vue'
import ProductEdit from './views/ProductEdit.vue'
import ProfilePage from './views/ProfilePage.vue'
import Auth from './views/Auth.vue'
import NotFound from './views/NotFound.vue'
import AboutPage from './views/AboutPage.vue'
import ContactsPage from './views/ContactsPage.vue'
import SearchResults from './views/SearchResults.vue'

import ProductDescription from './views/ProductPage/ProductDescription.vue'
import ProductSpecs from './views/ProductPage/ProductSpecs.vue'
import ProductReviews from './views/ProductPage/ProductReviews.vue'

import AdminProducts from './views/AdminPanel/AdminProducts.vue'
import AdminAddProduct from './views/AdminPanel/AdminAddProduct.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsPage
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsList
  },
  {
    path: '/search',
    name: 'search',
    component: SearchResults,
    props: (route) => ({ query: route.query.q || '' })
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  {
    path: '/product/:url',
    name: 'product',
    component: ProductPage,
    children: [
      {
        path: '',
        name: 'product-description',
        component: ProductDescription,
        props: true
      },
      {
        path: 'specs',
        name: 'product-specs',
        component: ProductSpecs,
        props: true
      },
      {
        path: 'reviews',
        name: 'product-reviews',
        component: ProductReviews,
        props: true
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPanel,
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-products',
        component: AdminProducts
      },
      {
        path: 'add',
        name: 'admin-add',
        component: AdminAddProduct
      }
    ]
  },
  {
    path: '/product/edit/:url',
    name: 'product-edit',
    component: ProductEdit,
    meta: { requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('currentUser')
  let user = null
  try {
    user = userStr ? JSON.parse(userStr) : null
  } catch (e) {
    console.error('Ошибка парсинга пользователя', e)
  }

  if (to.meta.requiresAdmin) {
    if (user && user.role === 'admin') {
      next()
    } else {
      if (window.$notification) {
        window.$notification.showError('Доступ запрещен! Только для администраторов.')
      } else {
        alert('Доступ запрещен! Только для администраторов.')
      }
      next('/')
    }
  } 
  else if (to.meta.requiresAuth) {
    if (user) {
      next()
    } else {
      if (window.$notification) {
        window.$notification.showError('Необходимо войти в систему')
      } else {
        alert('Необходимо войти в систему')
      }
      next('/auth')
    }
  } 
  else {
    next()
  }
})

export default router