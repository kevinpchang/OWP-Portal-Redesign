<template>
  <div class="purchase-history-page">
    <!-- ===================== HEADER  ===================== -->
    <div class="page-top">
      <div class="text-block">
        <h1 class="page-title">Purchase History</h1>
        <p class="page-description">
          View your invoices and payment details for your purchases.
        </p>
      </div>
     
    </div>

    <!-- ===================== MAIN CONTENT (CENTERED) ===================== -->
    <div class="ph">
      <!-- INVOICE LIST VIEW -->
      <section v-if="!selected" class="ph-grid">
        <article
          v-for="inv in invoices"
          :key="inv.id"
          class="inv-card"
          @click="open(inv)"
        >
          <div class="inv-title">Invoice</div>
          <div class="inv-number">#{{ inv.id }}</div>

          <div class="inv-meta">
            <div class="label">Invoice Date:</div>
            <div class="value">{{ fmtDate(inv.invoiceDate) }}</div>
          </div>

          <div class="status paid">Paid</div>
        </article>
      </section>

      <!-- INVOICE DETAIL VIEW -->
      <section v-else class="ph-detail">
        <div class="detail-header">
          <div class="left">
            
            <div class="detail-title">Invoice Details</div>
          </div>

          <div class="right">
            <button class="btn ghost" @click="printReceipt">Receipt</button>
            <button class="btn primary" @click="selected = null">
              Return to Purchase History
            </button>
          </div>
        </div>

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

            <div class="cell h">Billing Address & Phone</div>
            <div class="cell">
              <div class="addr">{{ selected!.billing.name }}</div>
              <div class="addr">{{ selected!.billing.address1 }}</div>
              <div class="addr" v-if="selected!.billing.address2">
                {{ selected!.billing.address2 }}
              </div>
              <div class="addr">
                {{ selected!.billing.city }},
                {{ selected!.billing.state }}
                {{ selected!.billing.zip }}
              </div>
              <div class="addr">{{ selected!.billing.phone }}</div>
            </div>
          </div>
        </div>

        <div class="section-heading">Invoice Items</div>

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

        <div class="section-heading">Payment</div>

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
              <div v-if="selected!.payment.address2">
                {{ selected!.payment.address2 }}
              </div>
              <div>
                {{ selected!.payment.city }},
                {{ selected!.payment.state }}
                {{ selected!.payment.zip }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
  payDate: string;
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
  invoiceDate: string;
  dueDate: string;
  shipped: boolean;
  balanceDue: number;
  placedBy: string;
  billing: Address;
  orderMethod: string;
  status: "Paid" | "Unpaid";
  items: InvoiceItem[];
  payment: Payment;
};

const invoices = ref<Invoice[]>([
  {
    id: 901737,
    invoiceDate: "2025-09-29",
    dueDate: "2025-10-29",
    shipped: false,
    balanceDue: 0,
    placedBy: "David Benjamin",
    billing: {
      name: "BENJAMIN, DAVID",
      address1: "6000 J ST, MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
      phone: "(123) 234-1111",
    },
    orderMethod: "OWP Website",
    status: "Paid",
    items: [{ product: "Operation of Wastewater Treatment Plants, Vol 1", qty: 1, total: 40 }],
    payment: {
      amountPaid: 40,
      payDate: "2025-09-29",
      method: "Visa",
      description: "—",
      madeBy: "David Benjamin",
      phone: "(123) 234-1111",
      address1: "6000 J ST",
      address2: "MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
    },
  },
  {
    id: 901733,
    invoiceDate: "2025-09-26",
    dueDate: "2025-10-26",
    shipped: false,
    balanceDue: 0,
    placedBy: "David Benjamin",
    billing: {
      name: "BENJAMIN, DAVID",
      address1: "6000 J ST, MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
      phone: "(123) 234-1111",
    },
    orderMethod: "OWP Website",
    status: "Paid",
    items: [{ product: "Operation of Wastewater Treatment Plants, Vol 2", qty: 1, total: 45 }],
    payment: {
      amountPaid: 45,
      payDate: "2025-09-26",
      method: "Visa",
      description: "—",
      madeBy: "David Benjamin",
      phone: "(123) 234-1111",
      address1: "6000 J ST",
      address2: "MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
    },
  },
  {
    id: 901731,
    invoiceDate: "2025-09-22",
    dueDate: "2025-10-22",
    shipped: false,
    balanceDue: 0,
    placedBy: "David Benjamin",
    billing: {
      name: "BENJAMIN, DAVID",
      address1: "6000 J ST, MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
      phone: "(123) 234-1111",
    },
    orderMethod: "OWP Website",
    status: "Paid",
    items: [{ product: "Operation of Wastewater Treatment Plants, Vol 3", qty: 1, total: 45 }],
    payment: {
      amountPaid: 45,
      payDate: "2025-09-22",
      method: "Visa",
      description: "—",
      madeBy: "David Benjamin",
      phone: "(123) 234-1111",
      address1: "6000 J ST",
      address2: "MODOC HALL SUITE 1001",
      city: "SACRAMENTO",
      state: "CA",
      zip: "95819",
    },
  },
]);

const selected = ref<Invoice | null>(null);

function open(inv: Invoice) {
  selected.value = inv;
}
function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}
function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
function printReceipt() {
  window.print();
}
</script>

<style scoped>
/* ===================== PAGE SHELL  ===================== */

.purchase-history-page {
  font-family: 'Myriad Pro', sans-serif;
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.text-block {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #034750; 
  margin: 0;
}

.page-description {
  font-size: 16px;
  color: #555;
  margin: 8px 0 0;
}


/* ===================== MAIN CONTENT (CENTERED WRAPPER) ===================== */

.ph {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 48px;
  padding: 16px 20px 32px 20px;
  display: grid;
  gap: 20px;
}

/* ===================== INVOICE GRID ===================== */

.ph-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr));
  gap: 16px;
}

.inv-card {
  background: white;
  border: 1px solid #e4e6ea;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
}

.inv-card:hover {
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}

.inv-title {
  font-size: 13px;
  font-weight: 600;
  color: #5a6b70;
}

.inv-number {
  color: #0b7285;
  font-weight: 800;
  margin-top: 4px;
  font-size: 14px;
}

.inv-meta {
  margin-top: 6px;
  font-size: 13px;
  color: #4b5563;
}

.inv-meta .label {
  font-weight: 600;
}

.status {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
}

.status.paid {
  color: #2f855a;
}

/* ===================== DETAIL VIEW ===================== */

.ph-detail {
  background: white;
  border: 1px solid #e4e6ea;
  border-radius: 10px;
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.right {
  display: flex;
  gap: 16px;
}

/* Invoice Details title color matches scheme */
.detail-title {
  font-size: 24px;
  font-weight: 800;
  color: #034750;
}

.btn {
  padding: 8px 18px;
  font-weight: 700;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease,
    box-shadow 0.15s ease, transform 0.1s ease;
}

.btn.primary {
  background: #034750;
  color: white;
}

.btn.primary:hover {
  background: #02333a;
  box-shadow: 0 3px 8px rgba(3, 71, 80, 0.35);
  transform: translateY(-1px);
}

.btn.ghost {
  border: 2px solid #034750;
  color: #034750;
  background: white;
}

.btn.ghost:hover {
  background: #034750;
  color: white;
  box-shadow: 0 3px 8px rgba(3, 71, 80, 0.25);
  transform: translateY(-1px);
}

/* ===================== TABLES ===================== */

.detail-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 18px;
}

.row {
  display: grid;
  grid-template-columns: 160px 1fr 160px 1fr 160px 1fr;
  font-size: 14px;
}

.row.multi {
  grid-template-columns: 160px 1fr 200px 1fr;
}

.cell {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f3f5;
  border-right: 1px solid #f1f3f5;
}

.cell.h {
  background: #f8fafc;
  font-weight: 700;
  color: #034750; /* match scheme for header cells */
}

.addr {
  line-height: 1.3;
}

/* ===================== SECTION HEADERS ===================== */

.section-heading {
  font-size: 20px;
  font-weight: 800;
  color: #034750;
  margin: 16px 0 10px;
}

/* ===================== INVOICE ITEMS ===================== */

.items {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 18px;
}

.items-row {
  display: grid;
  grid-template-columns: 1fr 140px 160px;
  font-size: 14px;
}

.items-row.head {
  background: #f8fafc;
  font-weight: 700;
}

.c {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f3f5;
}

.c.qty,
.c.total {
  text-align: right;
}

/* ===================== PAYMENT ===================== */

.payment {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.p-row {
  display: grid;
  grid-template-columns: 160px 1fr 160px 1fr 160px 1fr;
  font-size: 14px;
}

.p-h {
  padding: 10px 12px;
  background: #f8fafc;
  font-weight: 700;
  color: #034750; /* match scheme */
}

.p-v {
  padding: 10px 12px;
}

/* ===================== RESPONSIVE ===================== */
@media (max-width: 900px) {
  .ph-grid {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 640px) {
  .ph-grid {
    grid-template-columns: 1fr;
  }
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .right {
    align-self: stretch;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
