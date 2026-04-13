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
      <!-- status -->
      <div v-if="loading" style="padding: 12px; color: #555">Loading…</div>
      <div v-else-if="error" style="padding: 12px; color: #b42318">
        {{ error }}
      </div>

      <!-- INVOICE LIST VIEW -->
 <section v-if="!selected" class="ph-grid">
  <router-link
    v-for="inv in invoices"
    :key="inv.id"
    :to="`/purchase-history/${inv.id}`"
    class="inv-card"
    @click="open(inv)"
  >
    <div class="inv-title">Invoice</div>
    <div class="inv-number">#{{ inv.id }}</div>

    <div class="inv-meta">
      <div class="label">Invoice Date:</div>
      <div class="value">{{ fmtDate(inv.invoiceDate) }}</div>
    </div>

    <div class="status paid">{{ inv.status ?? "Paid" }}</div>
  </router-link>
</section>

      <!-- INVOICE DETAIL VIEW -->
      <section v-else class="ph-detail">
        <div class="detail-header">
          <div class="left">
            <div class="detail-title">Invoice Details</div>
          </div>

          <div class="right">
            <button class="btn ghost" @click="downloadAndOpenReceipt" :disabled="receiptLoading">
              {{ receiptLoading ? "Loading…" : "Receipt" }}
            </button>
            <button class="btn primary" @click="goBack">
            Return to Purchase History
            </button>
          </div>
        </div>

        <div class="detail-table">
          <div class="row">
            <div class="cell h">Invoice Num</div>
            <div class="cell">#{{ selected.id }}</div>
            <div class="cell h">Invoice Date</div>
            <div class="cell">{{ fmtDate(selected.invoiceDate) }}</div>
            <div class="cell h">Invoice Due Date</div>
            <div class="cell">{{ fmtDate(selected.dueDate) }}</div>
          </div>

          <div class="row">
            <div class="cell h">Shipped</div>
            <div class="cell">{{ selected.shipped ? "Yes" : "No" }}</div>
            <div class="cell h">Balance Due</div>
            <div class="cell">{{ fmtMoneySigned(selected.balanceDue) }}</div>
            <div class="cell h">Order Method</div>
            <div class="cell">{{ selected.orderMethod }}</div>
          </div>

          <div class="row multi">
            <div class="cell h">Order Placed By</div>
            <div class="cell">{{ selected.placedBy }}</div>

            <div class="cell h">Billing Address & Phone</div>
            <div class="cell">
              <div class="addr">{{ selected.billing.name }}</div>
              <div class="addr">{{ selected.billing.address1 }}</div>
              <div class="addr" v-if="selected.billing.address2">
                {{ selected.billing.address2 }}
              </div>
              <div class="addr">
                {{ selected.billing.city }},
                {{ selected.billing.state }}
                {{ selected.billing.zip }}
              </div>
              <div class="addr">{{ selected.billing.phone }}</div>
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

          <div v-for="(it, i) in selected.items" :key="i" class="items-row">
            <div class="c product">{{ it.product }}</div>
            <div class="c qty">{{ fmtQtySigned(it.qty) }}</div>
            <div class="c total">{{ fmtMoneySigned(it.total) }}</div>
          </div>

          <div v-if="selected.items.length === 0" class="items-row">
            <div class="c product" style="color:#64748b">No items returned.</div>
            <div class="c qty"></div>
            <div class="c total"></div>
          </div>
        </div>

        <div class="section-heading">Payment</div>

        <div class="payment">
          <div class="p-row">
            <div class="p-h">{{ selected.payment.amountPaid < 0 ? "Amount Refunded" : "Amount Paid" }}</div>
            <div class="p-v">{{ fmtMoneySigned(selected.payment.amountPaid) }}</div>

            <div class="p-h">Pay Date</div>
            <div class="p-v">{{ fmtDate(selected.payment.payDate) }}</div>

            <div class="p-h">Pay Method</div>
            <div class="p-v">{{ selected.payment.method }}</div>
          </div>

          <div class="p-row">
            <div class="p-h">Description</div>
            <div class="p-v">{{ selected.payment.description }}</div>

            <div class="p-h">Payment Made By</div>
            <div class="p-v">{{ selected.payment.madeBy }}</div>

            <div class="p-h">Payment Phone</div>
            <div class="p-v">{{ selected.payment.phone }}</div>
          </div>

          <div class="p-row">
            <div class="p-h">Payment Address</div>
            <div class="p-v">
              <div>{{ selected.payment.address1 }}</div>
              <div v-if="selected.payment.address2">
                {{ selected.payment.address2 }}
              </div>
              <div>
                {{ selected.payment.city }},
                {{ selected.payment.state }}
                {{ selected.payment.zip }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "@/services/owpAPI";

const invoices = ref([]);
const selected = ref(null);
const loading = ref(false);
const error = ref(null);
const receiptLoading = ref(false);

// TODO later: come from login/store/session
const pid = 458860;
const router = useRouter();
const route = useRoute();

// Failure Checking
const hadFailure = ref(false);

function toStr(x) {
  return x == null ? "" : String(x);
}
function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}
function toInt(x) {
  const n = Number(x);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

function emptyBilling() {
  return { name: "", address1: "", city: "", state: "", zip: "", phone: "" };
}
function emptyPayment() {
  return {
    amountPaid: 0,
    payDate: "",
    method: "",
    description: "—",
    madeBy: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
  };
}

function parseFmtdAddr(html) {
  const s = toStr(html);
  if (!s) return {};

  const lines = s
    .replace(/<br\s*\/?>/gi, "\n")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const name = lines[0] ?? "";
  const address1 = lines[1] ?? "";
  const cityStateZip = lines[2] ?? "";

  const m = cityStateZip.match(/^(.+?)\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  const city = m?.[1]?.trim() ?? "";
  const state = m?.[2]?.trim() ?? "";
  const zip = m?.[3]?.trim() ?? "";

  return { name, address1, city, state, zip };
}

function normalizeDate(s) {
  const t = toStr(s).trim();
  if (!t) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;

  return t;
}

function goBack() {
  selected.value = null
  router.push("/purchase-history")
}

async function loadInvoices() {
  loading.value = true;
  error.value = null;

  try {
    let list = [];
    try {
      const raw = await api.getInvoices(pid);
      list = Array.isArray(raw?.response) ? raw.response : [];
    }
    catch {
      hadFailure.value = true;
      list = api.loadFromSession("getInvoices") ?? [];
    }

    invoices.value = list
      .map((x) => {
        const id = Number(x.invoicenum);
        return {
          id,
          invoiceDate: normalizeDate(x.invoicedate),
          dueDate: "",
          shipped: false,
          balanceDue: toNum(x.balancedue),
          placedBy: "",
          billing: emptyBilling(),
          orderMethod: "—",
          status: "Paid",
          items: [],
          payment: emptyPayment(),
        }
      })
      .filter((inv) => Number.isFinite(inv.id));
  } catch (e) {
    invoices.value = [];
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

function buildProductName(r) {
  const fee = toStr(r.feetypename).trim();
  const comment = toStr(r.mstfeecomment).trim();
  const course = toStr(r.coursetitle).trim();

  const detail = course || comment;
  if (fee && detail) return `${fee}: ${detail}`;
  return detail || fee || "Item";
}

async function open(inv) {

  router.push(`/purchase-history/${inv.id}`);
  loading.value = true;
  error.value = null;

  try {
    let rows = [];
    const key = "getInvoiceData-"+inv.id;
    try {
      console.log("invoice id:", inv.id);
      const raw = await api.getInvoiceData(inv.id);
      console.log("in try")
      rows = Array.isArray(raw?.response) ? raw.response : [];
    }
    catch {
      hadFailure.value = true;
      const sessionResponse = api.loadFromSession(key) ?? [];
      rows = Array.isArray(sessionResponse) ? sessionResponse : [];
      console.log(rows.value);
    }

    if (rows.length === 0) {
      selected.value = inv;
      return;
    }

    const h = rows[0];

    const billParsed = parseFmtdAddr(h.billfmtdaddr);
    const billing = {
      ...emptyBilling(),
      ...billParsed,
      phone: toStr(h.billfmtdphn) || "",
    };

    const payParsed = parseFmtdAddr(h.pmtfmtdaddr);
    const payment = {
      ...emptyPayment(),
      amountPaid: toNum(h.payamt),
      payDate: normalizeDate(h.paydate),
      method: toStr(h.paymethodname),
      description: toStr(h.description) || "—",
      madeBy: toStr(h.entityname),
      phone: toStr(h.pmtfmtdphn),
      address1: payParsed.address1 ?? "",
      address2: "",
      city: payParsed.city ?? "",
      state: payParsed.state ?? "",
      zip: payParsed.zip ?? "",
    };

    const items = rows.map((r) => {
      return {
        product: buildProductName(r),
        qty: toInt(r.itmqty),
        total: toNum(r.itmamt),
      };
    });

    selected.value = {
      ...inv,
      invoiceDate: normalizeDate(h.invoicedate) || inv.invoiceDate,
      dueDate: normalizeDate(h.invoiceduedate) || "",
      shipped: toStr(h.shippedflag) === "1",
      balanceDue: toNum(h.balancedue),
      placedBy: toStr(h.entityname),
      orderMethod: toStr(h.cssagent) || "OWP Website",
      status: "Paid",
      billing,
      items,
      payment,
    };
  } catch (e) {
    selected.value = null;
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

async function loadInvoiceFromRoute() {

  const id = route.params.id;

  if (!id) {
    selected.value = null;
    return;
  }

  const inv = invoices.value.find(i => i.id === Number(id));

  if (!inv) return;

  await open(inv);

}



function fmtMoneySigned(n) {
  const abs = Math.abs(n);
  const s = `$${abs.toFixed(2)}`;
  return n < 0 ? `(${s})` : s;
}

function fmtQtySigned(n) {
  return String(n); // show -1 exactly as backend returns
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

async function downloadAndOpenReceipt() {
  if (!selected.value) return;
  receiptLoading.value = true;
  error.value = null;

  try {
    // owp.js has: fetch(`${BASE}/receipt/download/${invoiceNum}`)
    let b64 = null;
    try {
      const raw = await api.downloadReceipt(selected.value.id);
      b64 = raw?.response;
    }
    catch {
      alert("Error retrieving receipt. Please wait a moment and try again. If problem persists contact a site admin.");
    }
    if (!b64 || typeof b64 !== "string") throw new Error("Receipt API returned no PDF data.");

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");

    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${selected.value.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (e) {
    error.value = e?.message ?? String(e);
  } finally {
    receiptLoading.value = false;
  }
}

onMounted(async () => {

  await loadInvoices();

  if (route.params.id) {
    await loadInvoiceFromRoute();
  }

  if (hadFailure.value) { alert('Some data could not be refreshed. Showing saved session data where available which may be old. Refresh the page to attempt to fetch new data.'); }
});



watch(
  () => route.params.id,
  async () => {
    await loadInvoiceFromRoute();
  }
);
</script>

<style scoped>
/* ===================== PAGE SHELL  ===================== */

.purchase-history-page {
  font-family: "Myriad Pro", sans-serif;
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
  transition: box-shadow 0.15s ease, transform 0.15s ease,
    border-color 0.15s ease;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  color: #034750;
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
  color: #034750;
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
