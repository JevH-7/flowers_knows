import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createNotification } from './composables/useNotification'

const app = createApp(App)
app.use(router)

const notification = createNotification()
app.provide('notification', notification)

window.$notification = notification

app.mount('#app')
