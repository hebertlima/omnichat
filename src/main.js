import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

import './styles/app.css'
	
const app = createApp(App)

app.use(router)
	.mount('#app')
