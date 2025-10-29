<<<<<<< HEAD
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import MyAccountPage from '../pages/MyAccountPage.vue'
import CoursesPage from '../pages/CoursesPage.vue'
import OPnum from '../pages/OperatorNumbers.vue'
import CertificatesPage from '@/pages/CertificatesPage.vue'

const routes = [
  //{path: "/", name: 'DashboardPage', component: DashboardPage} //KEVIN'S DASHBOARD
  {path: "/", name: 'Learning Portal', component: DashboardPage}, // CRISTOBE
  // L'S MY_ACCOUNT
  { path: '/courses', name: 'CoursesPage', component: CoursesPage,},
  { path: '/operatornumbers', name: 'Operator Numbers', component:OPnum,},
  { path: '/Certificates', name:'CertificatesPage', component: CertificatesPage,} //UDAY KYAMA
]
=======
//tets commit
import { createRouter, createWebHistory } from 'vue-router';
import PurchaseHistory from '../pages/PurchaseHistory.vue';

const routes = [
  {
    path: '/purchase-history',
    name: 'purchase-history',
    component: PurchaseHistory,
  },
];
>>>>>>> vincent-purchasehistory-page

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
