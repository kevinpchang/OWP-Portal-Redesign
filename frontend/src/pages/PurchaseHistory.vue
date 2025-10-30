<template>
  <div class="dashboard-page">
    <!-- top: breadcrumb + title + blurb + image slot -->
    <div class="dashboard-top">
      <div class="text">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="crumb">Dashboard</a>
          <span class="crumb-sep">&gt;</span>
          <span class="crumb-current">Purchase History</span>
        </nav>

        <div class="welcome-message">My Purchase History</div>
        <div class="dashboard-description">
          Review your recent purchases, track progress, and download certificates.
        </div>
      </div>

      <div class="image">
        <img src="../assets/owpart.png" alt="OWP art" />
      </div>
    </div>

    <!-- bottom: two columns -->
    <div class="dashboard-bottom">
      <div class="dashboard-left">
        <!-- SUMMARY HEADER -->
        <section class="block">
          <h2 class="block-title">Summary</h2>
          <div class="summary-stats">
            <div class="stat">
              <span class="label">Total Purchases</span>
              <span class="value">{{ totalPurchases }}</span>
            </div>
            <div class="stat">
              <span class="label">Certificates Completed</span>
              <span class="value">{{ certificatesCompleted }}</span>
            </div>
            <div class="stat">
              <span class="label">Total Spent</span>
              <span class="value">\${{ totalSpent.toFixed(2) }}</span>
            </div>
            <div class="stat">
              <span class="label">Last Purchase</span>
              <span class="value">{{ lastPurchaseDate }}</span>
            </div>
          </div>
        </section>

        <!-- RECENT PURCHASES -->
        <section class="block">
          <div class="row-between">
            <h2 class="block-title">Recent Purchases</h2>
            <button class="btn">View All</button>
          </div>

          <div class="purchase-list">
            <div
              class="purchase-card"
              v-for="(purchase, index) in filteredPurchases"
              :key="index"
            >
              <img
                class="purchase-img"
                :src="purchase.image"
                :alt="purchase.title"
              />
              <div class="purchase-info">
                <h3 class="purchase-title">{{ purchase.title }}</h3>
                <p class="purchase-meta">
                  Purchased on {{ purchase.date }} •
                  <strong>{{ purchase.status }}</strong>
                </p>
                <p class="purchase-price">\${{ purchase.price.toFixed(2) }}</p>
                <div class="progress-bar">
                  <div
                    class="progress"
                    :style="{ width: purchase.progress + '%' }"
                  ></div>
                </div>
                <p class="progress-text">Progress: {{ purchase.progress }}%</p>
                <div class="purchase-actions">
                  <button class="btn small">Download Certificate</button>
                  <button class="btn-outline small">View Details</button>
                </div>
              </div>
            </div>

            <div v-if="filteredPurchases.length === 0" class="placeholder">
              No purchases match your filters.
            </div>
          </div>
        </section>
      </div>

      <div class="dashboard-right">
        <!-- FILTERS -->
        <section class="block">
          <h2 class="block-title">Filters</h2>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search by course..."
            class="filter-input"
          />
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
          </select>
        </section>

        <!-- INVOICES -->
        <section class="block">
          <h2 class="block-title">Invoices</h2>
          <ul class="invoice-list">
            <li v-for="(invoice, i) in invoices" :key="i" class="invoice-item">
              <span>{{ invoice.id }}</span>
              <span>{{ invoice.date }}</span>
              <a href="#" class="invoice-link">Download</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// ✅ Import images so Vite resolves them reliably
import keyPng from "../assets/key.png";
import lilGuyPng from "../assets/lil_guy.png";
import owpartPng from "../assets/owpart.png";

type Purchase = {
  title: string;
  date: string;      // ISO or display date
  status: "Completed" | "In Progress" | "Pending";
  price: number;
  progress: number;  // 0..100
  image: string;     // resolved asset url
};

type Invoice = { id: string; date: string };

const purchases = ref<Purchase[]>([
  {
    title: "Operations of Wastewater Treatment Plants, Vol 2 Certificate",
    date: "10/11/2024",
    status: "Completed",
    price: 45.0,
    progress: 100,
    image: keyPng,
  },
  {
    title: "Operations of Wastewater Treatment Plants, Vol 1 Certificate",
    date: "09/28/2024",
    status: "In Progress",
    price: 45.0,
    progress: 70,
    image: lilGuyPng,
  },
  {
    title: "Water Treatment Plant Operation, Vol 1 Certificate",
    date: "08/15/2024",
    status: "Pending",
    price: 45.0,
    progress: 0,
    image: owpartPng,
  },
]);

const invoices = ref<Invoice[]>([
  { id: "INV-12345", date: "10/11/2024" },
  { id: "INV-12346", date: "09/28/2024" },
  { id: "INV-12347", date: "08/15/2024" },
]);

// Summary
const totalPurchases = computed(() => purchases.value.length);
const certificatesCompleted = computed(
  () => purchases.value.filter((p) => p.status === "Completed").length
);
const totalSpent = computed(() =>
  purchases.value.reduce((sum, p) => sum + p.price, 0)
);
const lastPurchaseDate = computed(() => purchases.value?.[0]?.date ?? "—");


// Filters (and actually use them so TS doesn't complain)
const searchTerm = ref("");
const statusFilter = ref<Purchase["status"] | "">("");

// Apply filters to list
const filteredPurchases = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  const status = statusFilter.value;

  return purchases.value.filter((p) => {
    const matchesTerm = term
      ? p.title.toLowerCase().includes(term)
      : true;
    const matchesStatus = status ? p.status === status : true;
    return matchesTerm && matchesStatus;
  });
});
</script>

<style scoped>
.dashboard-page {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 32px;
  justify-content: center;
  align-items: start;
}

/* --- top layout --- */
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
  color: #034750;
}

.image > img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  display: block;
}

.welcome-message {
  font-size: 56px;
  font-weight: 700;
  color: #00a5b5;
  margin: 8px 0 16px 24px;
}

.dashboard-description {
  width: 395px;
  font-size: 19px;
  color: #747474;
  margin: 0 0 16px 24px;
}

/* --- breadcrumb --- */
.breadcrumb {
  margin: 0 0 8px 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.crumb {
  color: #2563eb;
  text-decoration: none;
}
.crumb:hover {
  text-decoration: underline;
}
.crumb-sep {
  color: #6b7280;
}
.crumb-current {
  color: #111827;
  font-weight: 600;
}

/* --- bottom grid --- */
.dashboard-bottom {
  grid-row: 2;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16rem;
  margin-bottom: 48px;
}

.block {
  background: #f2f1f2;
  border-radius: 14px;
  padding: 20px 24px;
  min-height: 160px;
}
.block-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 800;
  color: #034750;
}

/* --- summary --- */
.summary-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 12px;
}
.stat {
  display: flex;
  flex-direction: column;
}
.label {
  font-size: 14px;
  color: #6b7280;
}
.value {
  font-weight: 700;
  color: #034750;
}

/* --- purchase list --- */
.purchase-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.purchase-card {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.purchase-card:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.purchase-img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
.purchase-title {
  font-size: 16px;
  font-weight: 700;
  color: #034750;
}
.purchase-meta {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}
.purchase-price {
  font-size: 14px;
  font-weight: 600;
  color: #00a5b5;
  margin-top: 6px;
}

/* --- progress bar --- */
.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 8px 0;
  width: 200px;
}
.progress {
  height: 6px;
  background: #00a5b5;
  border-radius: 4px;
}
.progress-text {
  font-size: 12px;
  color: #6b7280;
}

/* --- actions --- */
.purchase-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn:hover {
  filter: brightness(0.95);
}
.btn-outline {
  background: transparent;
  border: 2px solid #2563eb;
  color: #2563eb;
}
.small {
  font-size: 13px;
  padding: 4px 10px;
}

/* --- filters --- */
.filter-input,
.filter-select {
  width: 100%;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

/* --- invoices --- */
.invoice-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}
.invoice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}
.invoice-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
}
.invoice-link:hover {
  text-decoration: underline;
}
</style>
