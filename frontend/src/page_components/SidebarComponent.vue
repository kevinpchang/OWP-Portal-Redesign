<script setup lang="ts">
import { useRoute } from 'vue-router'
import { History, SquareUserRound, ListTodo, BookOpen, ReceiptText,
  List, Hash, LayoutGrid, LogOut } from 'lucide-vue-next'
const route = useRoute()
</script>

<template>
  <div class="shell">
    <nav class="sidebar">

      <!-- Dashboard -->
      <router-link to="/" class="dashboard-button" :class="{ active: route.name === 'DashboardPage' }">
        <LayoutGrid class="button-icon" color="#034750" size="20" /> <!-- ✅ Using Lucide icon -->
        <div class="button-text">Dashboard</div>
      </router-link>


      <!-- My Account -->
      <router-link
        :to="{ name: 'MyAccountPage' }"
        class="my-account-button"
        :class="{ active: route.name === 'MyAccountPage' }"
      >
        <SquareUserRound class="button-icon" color="#034750" size="20" />
        <div class="button-text">My Account</div>
      </router-link>

      <!-- My Tasks -->
      <router-link
        to="/my-tasks"
        class="my-tasks-button"
        :class="{ active: route.name === 'MyTasksPage' }"
      >
        <ListTodo class="button-icon" color="#034750" size="20" />
        <div class="button-text">My Tasks</div>
      </router-link>

      <!-- Slides -->
      <router-link to="/slides" class="slides-button" :class="{ active: route.name === 'SlidesPage' }">
        <BookOpen class="button-icon" color="#034750" size="20" /> <!-- ✅ Add this icon -->
        <div class="button-text">Slides</div>
      </router-link>

      <!-- Courses -->
      <router-link
        to="/courses"
        class="courses-button"
        :class="{ active: route.name === 'CoursesPage' }"
      >
        <List class="button-icon" color="#034750" size="20" />
        <div class="button-text">Courses</div>
      </router-link>

      <!-- Operator Numbers -->
      <router-link
        to="/operatornumbers"
        class="operator-numbers-button"
        :class="{ active: route.name === 'Operator Numbers' }"
      >
        <Hash class="button-icon" color="#034750" size="20" />
        <div class="button-text">Operator Numbers</div>
      </router-link>


      <!-- Certificates -->
      <router-link
        to="/certificates"
        class="certificates-button"
        :class="{ active: route.name === 'CertificatesPage' }"
      >
        <ReceiptText class="button-icon" color="#034750" size="20" /> <!-- ✅ Added icon -->
        <div class="button-text">Certificates</div>
      </router-link>

      <!-- Purchase History -->
      <router-link
        to="/purchase-history"
        class="purchase-history-button"
        :class="{ active: route.name === 'PurchaseHistory' }"
      >
        <History class="button-icon" color="#034750" size="20" />
        <div class="button-text">Purchase History</div>
      </router-link>
    </nav>

    <!-- Logout button moved outside sidebar -->
    <router-link to="/logout" class="logout-button" :class="{ active: route.name === 'LogoutPage' }">
      <LogOut class="button-icon" color="#034750" size="20" /> <!-- ✅ Added Lucide icon -->
      <div class="button-text">Logout</div>
    </router-link>

    <div class="right-line"></div>
    <div class="bottom-line"></div>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
}

.right-line {
  grid-column: 2;
  grid-row: 1;
  width: 0px;
  height: 892rem;
  border: 1px solid #D9D9D9;
  margin-top: 4.5px;
}

.bottom-line {
  grid-column: 1;
  grid-row: 1;
  width: 295px;
  height: 0px;
  border: 1px solid #D9D9D9;
  margin-top: 813rem;
}

.sidebar {
  grid-column: 1;
  grid-row: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.button-text {
  font-family: Myriad Pro;
  font-size: 20px;
  font-weight: 600;
  margin-left: 20px;
  color: #034750;
}

.dashboard-button,
.my-account-button,
.my-tasks-button,
.slides-button,
.courses-button,
.operator-numbers-button,
.certificates-button,
.purchase-history-button {
  grid-column: 1;
  width: 250px;
  height: 47px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  text-decoration: none;
}

/* Active background for all buttons */
.dashboard-button.active,
.my-tasks-button.active,
.slides-button.active,
.operator-numbers-button.active,
.certificates-button.active,
.purchase-history-button.active,
.courses-button.active {
  background-color: #F2F1F2;
}

.sidebar .active {
  background-color: #F2F1F2;
}

/* Dashboard Button Icon */
.dashboard-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 5px;
  text-decoration: none;
  color: inherit;
}

/* Courses Button */
.courses-button {
  display: flex;
  align-items: center;
  width: 250px;
  height: 47px;
  border-radius: 8px;
  margin-top: 10px;
}

.courses-button.active {
  background-color: #F2F1F2;
}

.courses-button .courses-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
  width: 100%;
  padding-left: 35px;
}

.courses-button .button-text {
  font-size: 20px;
  color: #034750;
  font-family: "Myriad Pro Semibold";
  font-weight: 600;
  margin: 0;
}

.operator-numbers-button {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #034750;
  width: 250px;
  height: 47px;
  border-radius: 8px;
  margin-top: 10px;
  padding-left: 0;
  position: static;
}


.operator-numbers-button.active {
  background-color: #F2F1F2;
}

.logout-button {
  position: fixed;
  bottom: 20px; /* distance from bottom of screen */
  left: 10px;   /* adjust to align with sidebar edge */
  width: 250px;
  height: 47px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: white;
  color: #034750;
  font-family: Myriad Pro;
  font-weight: 600;
  font-size: 20px;
  z-index: 1000;
}

.logout-button.active {
  background-color: #F2F1F2;
}

.logout-button .button-text {
  margin-left: 0;
  /*text-align: center; /* optional - centers text horizontally */
  width: 100%;
}

.purchase-history-button .button-text {
  margin-left: 5px;  /* Move text closer to icon */
}

.my-account-button .button-text {
  margin-left: 5px;
}

.my-tasks-button .button-text {
  margin-left: 5px;
}

.slides-button .button-text {
  margin-left: 5px;  /* Move text closer to icon */
}

.certificates-button .button-text {
  margin-left: 5px;
}

.courses-button .button-text {
  margin-left: 5px;  /* Move text closer to icon */
}

.operator-numbers-button .button-text {
  margin-left: -3px;  /* Move text closer to icon */
}

.dashboard-button .button-text {
  margin-left: 0px;  /* Move text closer to icon */
}
.sidebar, .logout-button .button-icon {
  margin-left: 20px;
  margin-right: 10px;
}
</style>
