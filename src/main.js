import { createApp } from 'vue'

import { createRouter, createWebHistory } from 'vue-router'
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress'
import ModalContainer from '@/components/ModalContainer'

import App from './App.vue'
import './assets/page.css'

const router = createRouter({
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
app.use(Vue3ProgressPlugin)
app.component('ModalContainer', ModalContainer)
app.use(router)
app.mount('#app')
