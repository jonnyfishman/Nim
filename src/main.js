import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import './assets/page.css'

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes: [
    {
      name: 'Hide',
      path: '/:hide',
      component: App
    },
    {
      name: 'Home',
      path: '/:pathMatch(.*)*',
      component: App
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
