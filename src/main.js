import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElIcon from '@element-plus/icons-vue'
import store from './store'
import http from "./utils/http";
import 'element-plus/dist/index.css'
import VueContextMenu from 'vue-contextmenu'


let app=createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(store)
app.use(VueContextMenu)

Object.keys(ElIcon).forEach((key) => {
    app.component(key, ElIcon[key])
  })
app.config.globalProperties.$http = http
app.mount('#app')
