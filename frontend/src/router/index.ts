import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'

const routes = [
  //{path: "/", name: 'DashboardPage', component: DashboardPage} //KEVIN'S DASHBOARD
  {path: "/", name: 'MyAccountPage', component: MyAccountPage} // CRISTOBE
  // L'S MY_ACCOUNT
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
