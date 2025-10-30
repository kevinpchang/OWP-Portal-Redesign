<script setup lang="ts">
import HeaderComponent from './page_components/HeaderComponent.vue';
import SidebarComponent from './page_components/SidebarComponent.vue';
import DashboardPage from './pages/DashboardPage.vue';
</script>

<template>
  <div class="shell">
    <HeaderComponent />
    <SidebarComponent />
    <main class="content">

      <DashboardPage />
      <router-view />
    </main>
  </div>
</template>

<style>
  :root {
    font-size: min(calc(100vw / 1628), calc(100vh / 1080));
    --header-h: 100px;
    --sidebar-w: 295px;
  }

  body, html {
    margin: 0;
    padding: 0;
    height:100%;
    overflow:hidden;
  }
</style>

<style scoped>
  .shell {
    height: 100vh;
    display: grid;
    grid-template-rows: var(--header-h) 1fr;
    grid-template-columns: var(--sidebar-w) 1fr;
  }

  .header {
    grid-column: 1 / -1;
    grid-row: 1 / 2;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .sidebar {
    grid-column: 1 / 2;
    grid-row: 2 / -1;
    position: sticky;
    top: var(--header-h);
    align-self: start;
    z-index: 5;
  }

  .content {
    grid-column: 2 / -1;
    grid-row: 2 / -1;
    overflow-y: auto;
    height: calc(100vh - var(--header-h));
  }
</style>
