import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import OPnum from '../pages/OperatorNumbers.vue'

const routes = [
  //{path: "/", name: 'DashboardPage', component: DashboardPage} //KEVIN'S DASHBOARD
  {path: "/", name: 'Learning Portal', component: DashboardPage}, // CRISTOBE
  // L'S MY_ACCOUNT
  { path: '/courses', name: 'CoursesPage', component: CoursesPage,},
  { path: '/operatornumbers', name: 'Operator Numbers', component:OPnum,}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
