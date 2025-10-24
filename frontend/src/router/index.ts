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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
