<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  History,
  SquareUserRound,
  ListTodo,
  BookOpen,
  ReceiptText,
  List,
  Hash,
  LayoutGrid,
  LogOut,
  Images,
} from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div class="shell">
    <nav class="sidebar">
      <!-- Dashboard -->
      <router-link
        to="/"
        class="dashboard-button"
        :class="{ active: route.name === 'DashboardPage' }"
      >
        <LayoutGrid class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Dashboard</div>
      </router-link>

      <!-- My Account -->
      <router-link
        :to="{ name: 'MyAccountPage' }"
        class="my-account-button"
        :class="{ active: route.name === 'MyAccountPage' }"
      >
        <SquareUserRound class="button-icon" color="#034750" :size="20" />
        <div class="button-text">My Account</div>
      </router-link>

      <!-- My Tasks -->
      <router-link
        to="/my-tasks"
        class="my-tasks-button"
        :class="{ active: route.name === 'MyTasksPage' }"
      >
        <ListTodo class="button-icon" color="#034750" :size="20" />
        <div class="button-text">My Tasks</div>
      </router-link>

      <!-- Slides -->
      <router-link
        to="/slides"
        class="slides-button"
        :class="{ active: route.name === 'SlidesPage' }"
      >
        <BookOpen class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Slides</div>
      </router-link>

      <!-- Media -->
      <router-link
        to="/media"
        class="media-button"
        :class="{ active: route.name === 'MediaPage' }"
      >
        <Images class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Media</div>
      </router-link>

      <!-- Courses -->
      <router-link
        to="/courses"
        class="courses-button"
        :class="{ active: route.name === 'CoursesPage' }"
      >
        <List class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Courses</div>
      </router-link>

      <!-- Operator Numbers -->
      <router-link
        to="/operatornumbers"
        class="operator-numbers-button"
        :class="{ active: route.name === 'OperatorNumbers' }"
      >
        <Hash class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Operator Numbers</div>
      </router-link>

      <!-- Certificates -->
      <router-link
        to="/certificates"
        class="certificates-button"
        :class="{ active: route.name === 'CertificatesPage' }"
      >
        <ReceiptText class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Certificates</div>
      </router-link>

      <!-- Purchase History -->
      <router-link
        to="/purchase-history"
        class="purchase-history-button"
        :class="{ active: route.name === 'PurchaseHistory' }"
      >
        <History class="button-icon" color="#034750" :size="20" />
        <div class="button-text">Purchase History</div>
      </router-link>
    </nav>

    <!-- Logout button moved outside sidebar -->
    <router-link
      to="/logout"
      class="logout-button"
      :class="{ active: route.name === 'LogoutPage' }"
    >
      <LogOut class="button-icon" color="#034750" :size="20" />
      <div class="button-text">Logout</div>
    </router-link>

    <!-- Sidebar borders + footer background -->
    <div class="right-line"></div>
    <div class="bottom-line"></div>
    <div class="sidebar-footer-bg"></div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
}

/*  Vertical divider */
.right-line {
  position: fixed;
  left: 295px;
  top: 0;
  height: 100vh; /* full viewport height */
  border-left: 1px solid #D9D9D9;
  z-index: 0; /* below header and logout */
}

/* Horizontal divider above footer */
.bottom-line {
  position: fixed;
  bottom: 80px; /* sits above logout button */
  left: 0;
  width: 295px; /* match sidebar width */
  border-top: 1px solid #D9D9D9;
  z-index: 2;
}

/* White background under bottom line */
.sidebar-footer-bg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 295px;
    height: 100px;
    background-color: white;
    z-index: 1; /* stays under logout button */
  }

/* Sidebar layout */
.sidebar {
  position: fixed;
  top: 120px;
  left: 0;
  width: 295px;
  height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background-color: white;   /* keep background consistent */
  z-index: 2;                /* below header, above background */
}


/* Button text style */
.button-text {
  font-size: 20px;
  font-weight: 600;
  margin-left: 20px;
  color: #034750;
}

/* Sidebar buttons */
.dashboard-button,
.my-account-button,
.my-tasks-button,
.slides-button,
.media-button,
.courses-button,
.operator-numbers-button,
.certificates-button,
.purchase-history-button {
  width: 250px;
  height: 47px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  text-decoration: none;
}

/* Active background */
.sidebar .active {
  background-color: #f2f1f2;
}

/* Dashboard */
.dashboard-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 5px;
  text-decoration: none;
  color: inherit;
}

/* Operator Numbers */
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

/* Logout button (fixed on top of white footer) */
.logout-button {
  position: fixed;
  bottom: 20px;
  left: 10px;
  width: 250px;
  height: 47px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background-color: white;
  color: #034750;
  font-weight: 600;
  font-size: 20px;
  z-index: 2; /* ensure it’s above footer */
}

.logout-button.active {
  background-color: #f2f1f2;
}

.logout-button .button-text {
  margin-left: 0;
  width: 100%;
}

/* Icon spacing */
.sidebar .button-icon,
.logout-button .button-icon {
  margin-left: 20px;
  margin-right: 10px;
}

/* Text alignment adjustments per button */
.purchase-history-button .button-text,
.my-account-button .button-text,
.my-tasks-button .button-text,
.slides-button .button-text,
.media-button .button-text,
.certificates-button .button-text,
.courses-button .button-text {
  margin-left: 5px;
}

.operator-numbers-button .button-text {
  margin-left: -3px;
}

.dashboard-button .button-text {
  margin-left: 0;
}
</style>
