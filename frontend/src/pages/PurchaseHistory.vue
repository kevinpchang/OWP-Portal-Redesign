<template>
  <div class="ph">

    <!-- ===== HERO (welcome header + image) ===== -->
    <section class="hero">
      <div class="hero-text">
        <div class="hero-date">{{ todayNice }}</div>
        <h1 class="hero-title">Purchase History</h1>
        <p class="hero-sub">
          View all invoices and their details.
        </p>
      </div>
      <div class="hero-img-wrap">
        <img :src="heroImg" alt="OWP illustration" class="hero-img" />
      </div>
    </section>

    <!-- ===== PAGE HEADER ===== -->
    <section class="ph-header">
      <div class="title">My Purchase History</div>
      <div class="sub">Click on any invoices and view their details.</div>
    </section>

    <!-- ===== LIST VIEW ===== -->
    <section v-if="!selected" class="ph-grid">
      <article
        v-for="inv in invoices"
        :key="inv.id"
        class="inv-card"
        @click="open(inv)"
        role="button"
        tabindex="0"
      >
        <div class="inv-title">Invoice</div>
        <div class="inv-number">#{{ inv.id }}</div>

        <div class="inv-meta">
          <div class="label">Invoice Date:</div>
          <div class="value">{{ fmtDate(inv.invoiceDate) }}</div>
        </div>

        <div class="status" :class="inv.status.toLowerCase()">
          {{ inv.status }}
        </div>
      </article>
    </section>

    <!-- ===== DETAIL VIEW ===== -->
    <section v-else class="ph-detail">
      <div class="detail-header">
        <div class="left">
          <div class="detail-title">Invoice</div>
        </div>
        <div class="right">
          <button class="btn ghost" @click="printReceipt">Receipt</button>
          <button class="btn primary" @click="selected = null">Return to Purchase History</button>
        </div>
      </div>

      <!-- INVOICE TABLE -->
      <div class="detail-table">
        <div class="row">
          <div class="cell h">Invoice Num</div>
          <div class="cell">#{{ selected!.id }}</div>

          <div class="cell h">Invoice Date</div>
          <div class="cell">{{ fmtDate(selected!.invoiceDate) }}</div>

          <div class="cell h">Invoice Due Date</div>
          <div class="cell">{{ fmtDate(selected!.dueDate) }}</div>
        </div>

        <div class="row">
          <div class="cell h">Shipped</div>
          <div class="cell">{{ selected!.shipped ? 'Yes' : 'No' }}</div>

          <div class="cell h">Balance Due</div>
          <div class="cell">{{ fmtMoney(selected!.balanceDue) }}</div>

          <div class="cell h">Order Method</div>
          <div class="cell">{{ selected!.orderMethod }}</div>
        </div>

        <div class="row multi">
          <div class="cell h">Order Placed By</div>
          <div class="cell">{{ selected!.placedBy }}</div>

          <div class="cell h">Billing Address and Phone</div>
          <div class="cell">
            <div class="addr" v-if="selected!.billing.name">{{ selected!.billing.name }}</div>
            <div class="addr">{{ selected!.billing.address1 }}</div>
            <div class="addr" v-if="selected!.billing.address2">{{ selected!.billing.address2 }}</div>
            <div class="addr">
              {{ selected!.billing.city }}, {{ selected!.billing.state }} {{ selected!.billing.zip }}
            </div>
            <div class="addr" v-if="selected!.billing.phone">{{ selected!.billing.phone }}</div>
          </div>
        </div>
      </div>

      <!-- INVOICE ITEMS -->
      <h3 class="section-title">Invoice Items</h3>
      <div class="items">
        <div class="items-row head">
          <div class="c product">Product Name</div>
          <div class="c qty">Item Quantity</div>
          <div class="c total">Total Cost</div>
        </div>

        <div
          v-for="(it, i) in selected!.items"
          :key="i"
          class="items-row"
        >
          <div class="c product">{{ it.product }}</div>
          <div class="c qty">{{ it.qty }}</div>
          <div class="c total">{{ fmtMoney(it.total) }}</div>
        </div>
      </div>

      <!-- PAYMENT -->
      <h3 class="section-title">Payment</h3>
      <div class="payment">
        <div class="p-row">
          <div class="p-h">Amount Paid</div>
          <div class="p-v">{{ fmtMoney(selected!.payment.amountPaid) }}</div>

          <div class="p-h">Pay Date</div>
          <div class="p-v">{{ fmtDate(selected!.payment.payDate) }}</div>

          <div class="p-h">Pay Method</div>
          <div class="p-v">{{ selected!.payment.method }}</div>
        </div>

        <div class="p-row">
          <div class="p-h">Description</div>
          <div class="p-v">{{ selected!.payment.description }}</div>

          <div class="p-h">Payment Made By</div>
          <div class="p-v">{{ selected!.payment.madeBy }}</div>

          <div class="p-h">Payment Phone</div>
          <div class="p-v">{{ selected!.payment.phone }}</div>
        </div>

        <div class="p-row">
          <div class="p-h">Payment Address</div>
          <div class="p-v">
            <div>{{ selected!.payment.address1 }}</div>
            <div v-if="selected!.payment.address2">{{ selected!.payment.address2 }}</div>
            <div>{{ selected!.payment.city }}, {{ selected!.payment.state }} {{ selected!.payment.zip }}</div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import heroImg from '../assets/owpart.png'; // make sure this asset exists

type InvoiceItem = { product: string; qty: number; total: number };
type Address = {
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
};
type Payment = {
  amountPaid: number;
  payDate: string;   // YYYY-MM-DD
  method: string;
  description: string;
  madeBy: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};
type Invoice = {
  id: number;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string;     // YYYY-MM-DD
  shipped: boolean;
  balanceDue: number;
  placedBy: string;
  billing: Address;
  orderMethod: string;
  status: 'Paid' | 'Unpaid';
  items: InvoiceItem[];
  payment: Payment;
};

/* ---- Sample data (includes the 3 courses you requested) ---- */
const invoices = ref<Invoice[]>([
  {
    id: 901737,
    invoiceDate: '2025-09-29',
    dueDate: '2025-10-29',
    shipped: false,
    balanceDue: 0,
    placedBy: 'David Benjamin',
    billing: {
      name: 'BENJAMIN, DAVID',
      address1: '6000 J ST, MODOC HALL SUITE 1001',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819',
      phone: '(123) 234-1111'
    },
    orderMethod: 'OWP Website',
    status: 'Paid',
    items: [
      { product: 'Operation of Wastewater Treatment Plants, Vol 2', qty: 1, total: 45.00 },
      { product: 'Operation of Wastewater Treatment Plants, Vol 1', qty: 1, total: 45.00 },
      { product: 'Operation of Wastewater Treatment Plants, Vol 3', qty: 1, total: 45.00 }
    ],
    payment: {
      amountPaid: 135.00,
      payDate: '2025-09-29',
      method: 'Visa',
      description: 'Course enrollments',
      madeBy: 'David Benjamin',
      phone: '(123) 234-1111',
      address1: '6000 J ST',
      address2: 'MODOC HALL SUITE 1001',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819'
    }
  },
  {
    id: 901733,
    invoiceDate: '2025-09-26',
    dueDate: '2025-10-26',
    shipped: true,
    balanceDue: 0,
    placedBy: 'David Benjamin',
    billing: {
      address1: '6000 J ST',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819',
      phone: '(123) 234-1111'
    },
    orderMethod: 'OWP Website',
    status: 'Paid',
    items: [
      { product: 'Operation of Wastewater Treatment Plants, Vol 2', qty: 1, total: 45.00 }
    ],
    payment: {
      amountPaid: 45.00,
      payDate: '2025-09-26',
      method: 'Visa',
      description: 'Course enrollment',
      madeBy: 'David Benjamin',
      phone: '(123) 234-1111',
      address1: '6000 J ST',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819'
    }
  },
  {
    id: 901731,
    invoiceDate: '2025-09-22',
    dueDate: '2025-10-22',
    shipped: false,
    balanceDue: 0,
    placedBy: 'David Benjamin',
    billing: {
      address1: '6000 J ST',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819'
    },
    orderMethod: 'OWP Website',
    status: 'Paid',
    items: [
      { product: 'Operation of Wastewater Treatment Plants, Vol 1', qty: 1, total: 45.00 }
    ],
    payment: {
      amountPaid: 45.00,
      payDate: '2025-09-22',
      method: 'Visa',
      description: 'Course enrollment',
      madeBy: 'David Benjamin',
      phone: '(123) 234-1111',
      address1: '6000 J ST',
      city: 'SACRAMENTO',
      state: 'CA',
      zip: '95819'
    }
  }
]);

/* ---- List/Detail state ---- */
const selected = ref<Invoice | null>(null);
function open(inv: Invoice) { selected.value = inv; }
function printReceipt() { window.print(); }

/* ---- Helpers ---- */
function fmtMoney(n: number) { return `$${n.toFixed(2)}`; }
function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
}
const todayNice = computed(() =>
  new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
);
</script>

<style scoped>
/* Slight right padding so content isn’t jammed against the sidebar */
.ph {
  padding: 16px 24px 40px 40px;
  display: grid;
  gap: 20px;
  font-family: Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif;
}

/* ===== HERO ===== */
.hero {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
  align-items: center;
}
.hero-text { display: flex; flex-direction: column; gap: 10px; }
.hero-date { color: #6b7280; font-weight: 600; }
.hero-title { color: #00A5B5; font-weight: 800; font-size: 44px; line-height: 1.05; margin: 0; }
.hero-sub { color: #525252; font-size: 18px; max-width: 56ch; margin: 0; }
.hero-img-wrap { width: 100%; }
.hero-img { width: 100%; height: 220px; object-fit: contain; }

@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; }
  .hero-img { height: 180px; }
}

/* ===== PAGE HEADER ===== */
.ph-header .title {
  color: #034750;
  font-weight: 800;
  font-size: 28px;
}
.ph-header .sub {
  color: #707070;
  font-size: 16px;
  margin-top: 4px;
}

/* ===== LIST (tiles) ===== */
.ph-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 16px;
}
@media (max-width: 1400px) { .ph-grid { grid-template-columns: repeat(3, minmax(220px, 1fr)); } }
@media (max-width: 1024px) { .ph-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)); } }
@media (max-width: 640px)  { .ph-grid { grid-template-columns: 1fr; } }

.inv-card {
  background: #fff;
  border: 1px solid #E4E6EA;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 1px 0 rgba(3,71,80,0.04);
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.inv-card:hover {
  transform: translateY(-2px);
  border-color: #D6DBE1;
  box-shadow: 0 6px 16px rgba(3,71,80,0.08);
}
.inv-title { color: #5a6b70; font-size: 13px; font-weight: 600; }
.inv-number { color: #075985; font-weight: 800; margin-top: 2px; }
.inv-meta { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; margin-top: 8px; font-size: 13px; }
.inv-meta .label { color: #6b7280; }
.inv-meta .value { color: #111827; }
.status { margin-top: 8px; font-weight: 700; font-size: 13px; }
.status.paid { color: #2F855A; }
.status.unpaid { color: #B45309; }

/* ===== DETAIL ===== */
.ph-detail {
  background: #fff;
  border-radius: 10px;
  padding: 18px 20px 24px;
  border: 1px solid #E4E6EA;
}
.detail-header {
  display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 12px;
}
.detail-title { font-size: 26px; font-weight: 800; color: #034750; }
.btn {
  border-radius: 8px; padding: 8px 12px; font-weight: 700; cursor: pointer; border: 2px solid transparent;
}
.btn.primary { background: #034750; color: #fff; }
.btn.ghost { background: transparent; border-color: #034750; color: #034750; }
.btn:hover { filter: brightness(0.96); }

.detail-table {
  border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; margin-bottom: 18px;
}
.detail-table .row { display: grid; grid-template-columns: 160px 1fr 160px 1fr 160px 1fr; }
.detail-table .row.multi { grid-template-columns: 160px 1fr 220px 1fr; }
.detail-table .cell {
  padding: 10px 12px; border-bottom: 1px solid #F1F3F5; border-right: 1px solid #F1F3F5; font-size: 14px;
}
.detail-table .cell.h { background:#F8FAFC; font-weight: 700; color:#374151; }
.detail-table .row:last-child .cell { border-bottom: 0; }
.detail-table .cell:nth-child(6n) { border-right: 0; }
.addr { line-height: 1.35; }

/* Items */
.section-title { margin: 14px 0 8px; color:#034750; font-weight:800; }
.items { border: 1px solid #E5E7EB; border-radius: 8px; overflow:hidden; margin-bottom: 18px; }
.items-row { display:grid; grid-template-columns: 1fr 140px 160px; }
.items-row.head { background:#F8FAFC; font-weight:700; color:#374151; }
.items-row .c { padding:10px 12px; border-bottom: 1px solid #F1F3F5; }
.items-row:last-child .c { border-bottom: 0; }
.items-row .qty, .items-row .total { text-align:right; }

/* Payment */
.payment { border: 1px solid #E5E7EB; border-radius: 8px; overflow:hidden; }
.p-row { display:grid; grid-template-columns: 160px 1fr 160px 1fr 160px 1fr; }
.p-h { padding:10px 12px; background:#F8FAFC; font-weight:700; color:#374151; border-bottom:1px solid #F1F3F5; }
.p-v { padding:10px 12px; border-bottom:1px solid #F1F3F5; }
.p-row:last-child .p-h, .p-row:last-child .p-v { border-bottom: 0; }
</style>
