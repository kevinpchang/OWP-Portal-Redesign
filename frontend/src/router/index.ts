 import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import OPnum from '../pages/OperatorNumbers.vue'
import CertificatesPage from '@/pages/CertificatesPage.vue'
import PurchaseHistory from '../pages/PurchaseHistory.vue'

const routes = [
  { path: "/", name: 'DashboardPage', component: DashboardPage }, // KEVIN'S DASHBOARD
  { path: "/MyAccountPage", name: 'MyAccountPage', component: MyAccountPage}, // CRISTOBEL'S MY_ACCOUNT
  { path: '/operatornumbers', name: 'Operator Numbers', component: OPnum }, // RYAN OPNUM
  { path: '/courses', name: 'CoursesPage', component: CoursesPage }, //NICK's COURSES PAGE
  { path: '/courses/:id', name: 'ActiveCourse', component: () => import ('../pages/ActiveCourse.vue'), props: true}, //NICK
  { path: '/Certificates', name: 'CertificatesPage', component: CertificatesPage }, // UDAY KYAMA
  { path: '/purchase-history', name: 'PurchaseHistory', component: PurchaseHistory } // VINCENT LAM
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
