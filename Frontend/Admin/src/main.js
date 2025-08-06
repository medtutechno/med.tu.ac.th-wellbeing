import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import main CSS
import './assets/main.css'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all.min.js'
import '@fortawesome/fontawesome-free/js/fontawesome.min.js'
import '@fortawesome/fontawesome-free/js/solid.min.js'
import '@fortawesome/fontawesome-free/js/regular.min.js'
import '@fortawesome/fontawesome-free/js/brands.min.js'

// Import AOS
import 'aos/dist/aos.css'
import AOS from 'aos'

const app = createApp(App)

// Use router
app.use(router)

// Mount app
app.mount('#app')

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true
})
