<script setup lang="ts">
  import { useRoute} from 'vue-router'
  const route = useRoute()
</script>

<template>
  <div class="shell">
    <nav class="sidebar">
      <div class="dashboard-button" :class="{ active: route.name === 'MyAccountPage' }">
        <div class="button-text">Dashboard</div>
      </div>
      <!-- CHANGE active: route.name === "YOURPAGENAME_INSIDE_pages_DIRECTORY" -->
      <div class="my-tasks-button" :class="{ active: route.name === 'MyAccountPage'}">
        <div class="button-text">My Tasks</div>
      </div>
      <div class="slides-button" :class="{ active: route.name === 'MyAccountPage'}">
        <div class="button-text">Slides</div>
      </div>
      <div class="courses-button" :class="{ active: route.name === 'MyAccountPage' }">
        <div class="button-text">Courses</div>
      </div>
      <div class="operator-numbers-button" :class="{ active: route.name === 'MyAccountPage' }">
        <div class="button-text">Operator Numbers</div>
      </div>
      <div class="certificates-button" :class="{ active: route.name === 'MyAccountPage' }">
        <div class="button-text">Certificates</div>
      </div>
      <div class="purchase-history-button" :class="{ active: route.name === 'MyAccountPage' }">
        <div class="button-text">Purchase History</div>
      </div>
    </nav>
    
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
    border: 1px, solid, #D9D9D9;
    margin-top: 4.5px;
  }

  .bottom-line {
    grid-column: 1;
    grid-row: 1;
    width: 295px;
    height: 0px;
    border: 1px, solid, #D9D9D9;
    margin-top: 813rem;
  }

  .sidebar {
    grid-column: 1;
    grid-row: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .button-text {
    font-family: Myriad Pro;
    font-size: 20px;
    font-weight: 600;
    margin-left: 39.25rem;
    color: #034750;
  }

  .dashboard-button, .my-tasks-button, .slides-button, .courses-button, .operator-numbers-button, .certificates-button, .purchase-history-button {
    grid-column: 1;
    width: 250px;
    height: 47px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin-top: 21px;
  }

  .dashboard-button.active {
    background-color: #F2F1F2;
  }

  /* BROADENED: any .active inside .sidebar gets the gray background */
  .sidebar .active {
    background-color: #F2F1F2;
  }
</style>
