 import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import OPnum from '../pages/OperatorNumbers.vue'
import CertificatesPage from '@/pages/CertificatesPage.vue'
import PurchaseHistory from '../pages/PurchaseHistory.vue'

const routes = [
  { path: "/pages", name: 'DashboardPage', component: DashboardPage }, // KEVIN'S DASHBOARD
  { path: "/", name: 'MyAccountPage', component: MyAccountPage }, // CRISTOBE L'S MY_ACCOUNT
  { path: '/', name: 'CoursesPage', component: CoursesPage },
  { path: '/', name: 'Operator Numbers', component: OPnum },
  { path: '/', name: 'CertificatesPage', component: CertificatesPage }, // UDAY KYAMA
  { path: '/', name: 'PurchaseHistory', component: PurchaseHistory } // VINCENT LAM
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
