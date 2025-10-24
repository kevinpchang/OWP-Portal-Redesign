<template>
  <div class="dashboard-page">
    <!-- top: breadcrumb + title + (optional) blurb + image slot -->
    <div class="dashboard-top">
      <div class="text">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="crumb">Dashboard</a>
          <span class="crumb-sep">&gt;</span>
          <span class="crumb-current">Purchase History</span>
        </nav>

        <div class="welcome-message">My Purchase History</div>
        <div class="dashboard-description">
          Review your recent purchases, filter by date/status, and access invoices.
        </div>
      </div>

      <div class="image">
        <img src="../assets/owpart.png" alt="OWP art" />
      </div>
    </div>

    <!-- bottom: two columns, left carries Header + Recent Purchases; right carries Filters + Invoices -->
    <div class="dashboard-bottom">
      <div class="dashboard-left">
        <!-- HEADER (summary) -->
        <section class="block">
          <h2 class="block-title">Header</h2>
          <p class="muted">Place quick stats here (Total Orders / Total Spend / Avg Order Value).</p>
        </section>

        <!-- RECENT PURCHASES -->
        <section class="block">
          <div class="row-between">
            <h2 class="block-title">Recent Purchases</h2>
            <button class="btn">View All</button>
          </div>
          <div class="placeholder">table/list placeholder</div>
        </section>
      </div>

      <div class="dashboard-right">
        <!-- FILTERS -->
        <section class="block">
          <h2 class="block-title">Filters</h2>
          <div class="placeholder">search / status / date range</div>
        </section>

        <!-- INVOICES -->
        <section class="block">
          <h2 class="block-title">Invoices</h2>
          <div class="placeholder">invoices table placeholder</div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// pure skeleton: no state/logic yet
</script>

<style scoped>
/* keep your base grid feel */
.dashboard-page {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 32px;
  justify-content: center;
  align-items: start;
}

.dashboard-top {
  grid-row: 1;
  display: grid;
  grid-template-columns: 508px 508px;
  margin-top: 32px;
}

.text {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 240px;
  font-family: Myriad Pro, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #034750;
}

.image { grid-column: 2; }
.image > img { width: 100%; height: 100%; object-fit: scale-down; display: block; }

.welcome-message {
  font-size: 56px;
  font-weight: 700;
  color: #00A5B5;
  margin: 8px 0 16px 24px;
}
.dashboard-description {
  width: 395px;
  font-size: 19px;
  color: #747474;
  margin: 0 0 16px 24px;
}

.breadcrumb {
  margin: 0 0 8px 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.crumb { color: #2563eb; text-decoration: none; }
.crumb:hover { text-decoration: underline; }
.crumb-sep { color: #6b7280; }
.crumb-current { color: #111827; font-weight: 600; }

.dashboard-bottom {
  grid-row: 2;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16rem;
  margin-bottom: 48px;
}

.dashboard-left, .dashboard-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* simple rounded light blocks to match your look */
.block {
  background: #F2F1F2;
  border-radius: 14rem;
  padding: 20px 24px;
  min-height: 160px;
}
.block-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 800;
  color: #034750;
}
.muted { color: #6b7280; font-size: 14px; margin: 4px 0 0; }

.placeholder {
  margin-top: 12px;
  background: #ffffff;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px;
  color: #6b7280;
  text-align: center;
}

.row-between { display: flex; justify-content: space-between; align-items: center; }

.btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn:hover { filter: brightness(0.95); }
</style>
