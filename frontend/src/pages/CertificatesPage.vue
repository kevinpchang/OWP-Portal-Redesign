<script setup>
import { ref, computed, onMounted } from "vue";
import {
  getAccountDetails,
  getActiveEnrollment,
  getEnrollmentRecord,
  getInvoiceData,
  getInvoices,
  loadFromSession,
} from "@/services/owpAPI.js";

import certificate from '@/assets/icons/owp-2color/certificate-icon.svg'
import history from '@/assets/icons/owp-2color/history-icon.svg'
import mail from '@/assets/icons/owp-2color/mail-icon.svg'

const pid = 458860;
const hadFailure = ref(false);


// --- Account state ---
const loadingAccount = ref(true);
const accountError = ref("");
const accountName = ref("");

// --- Certificates state ---
const loadingCerts = ref(true);
const certsError = ref("");
const certificates = ref([]);

// --- Search ---
const searchQuery = ref("");

// --- Download loading tracker ---
const downloadingId = ref(null);

// --- Filtered certificates ---
const filteredCertificates = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return certificates.value;
  return certificates.value.filter((c) =>
    c.title.toLowerCase().includes(q)
  );
});

// invoice refs
const invoices = ref([]);
const invoicedata = ref({});

// Messaging
const MESSAGING_API_BASE = "https://owp-portal-redesign-db.onrender.com";
const messagingUserId = 1;

const messages = ref([]);
const loadingMessages = ref(true);
const messagesError = ref("");

function formatInboxDate(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

async function loadMessages() {
  loadingMessages.value = true;
  messagesError.value = "";

  try {
    const url = new URL(`${MESSAGING_API_BASE}/api/messaging/threads`);
    url.searchParams.set("userId", String(messagingUserId));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    messages.value = (data.threads || []).slice(0, 3).map((row) => ({
      id: Number(row.ThreadId),
      sender: row.LastSenderName || row.LastSenderEmail || "Unknown",
      date: formatInboxDate(row.LastSentAt || row.LastMessageAt || row.CreatedAt),
    }));
  } catch (e) {
    console.error("Failed to load messages:", e);
    messagesError.value = e?.message ?? "load-failed";
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
}

// --- Load account name ---
async function loadAccount() {
  loadingAccount.value = true;
  accountError.value = "";
  try {
    const data = await getAccountDetails(pid);
    accountName.value = data?.response?.fullname ?? "";
  } catch (e) {
    hadFailure.value = true
    accountError.value = e?.message ?? String(e);
    const data = loadFromSession("getAccountDetails")  ?? [];
    accountName.value = data?.response?.fullname ?? "";
  } finally {
    loadingAccount.value = false;
  }
}

// --- Load certificates from activeEnrollment ---
async function loadCertificates() {
  loadingCerts.value = true;
  certsError.value = "";
  try {
    let rows = [];
    try {
      const data = await getActiveEnrollment(pid);
      rows = data?.response ?? [];
    }
    catch {
      hadFailure.value = true;
      rows = loadFromSession("getActiveEnrollment") ?? [];
    }

    const completed = rows.filter(
      (r) =>
        r.statustxt === "Complete" &&
        String(r.grade ?? "").trim() === "CR"
    );

    const recordRequests = completed.map((r) => ({
      row: r,
      promise: getEnrollmentRecord(r.enrollid),
    }));

    const recordResults = await Promise.allSettled(
      recordRequests.map((item) => item.promise)
    );

    const enriched = recordRequests.map((item, index) => {
      const result = recordResults[index];
      const recordKey = "getEnrollmentRecord-"+item.row.enrollid;
      let ceus = "—";
      let contactHours = "—";

      if (result.status === "fulfilled") {
        const record = Array.isArray(result.value?.response)
          ? result.value.response[0]
          : result.value?.response;

        if (record) {
          const rawCeu = Number(record.ceus ?? record.ceu);
          ceus = Number.isFinite(rawCeu) ? rawCeu.toFixed(1) : "—";
          contactHours = record.contacthour ?? record.contacthours ?? "—";
        }
      } else {
        hadFailure.value = true;

        const cachedRecord = loadFromSession(recordKey);
        const record = Array.isArray(cachedRecord)
          ? cachedRecord[0]
          : cachedRecord;

        if (record) {
          const rawCeu = Number(record.ceus ?? record.ceu);
          ceus = Number.isFinite(rawCeu) ? rawCeu.toFixed(1) : "—";
          contactHours = record.contacthour ?? record.contacthours ?? "—";
        }
      }
      return {
        id: item.row.enrollid,
        enrollId: item.row.enrollid,
        title: item.row.title || "Course title unavailable",
        completedDate: item.row.completedate || "—",
        grade: "CR (Pass)",
        ceus,
        contactHours,
      };
    });

    certificates.value = enriched;
  } catch (e) {
    certsError.value = e?.message ?? String(e);
    certificates.value = [];
  } finally {
    loadingCerts.value = false;
  }
}

// Invoices
function getInvoiceName(invoicenum) {
  const items = invoicedata.value[invoicenum] ?? [];
  const match = items.find((item) => item?.coursetitle != null);
  return match?.coursetitle || "Course title unavailable";
}

async function loadInvoices() {

  try {
    try {
      const inv = await getInvoices(pid);
      invoices.value = inv?.response ?? [];
    } catch {
      hadFailure.value = true;
      invoices.value = loadFromSession("getInvoices") ?? [];
    }

    const invoiceRequests = invoices.value.map((v) => ({
      invoicenum: v.invoicenum,
      promise: getInvoiceData(v.invoicenum),
    }));

    const invoiceResults = await Promise.allSettled(
      invoiceRequests.map((item) => item.promise)
    );

    invoiceRequests.forEach((item, index) => {
      const result = invoiceResults[index];
      const key = "getInvoiceData-" + item.invoicenum;

      if (result.status === "fulfilled") {
        invoicedata.value[item.invoicenum] = result.value.response ?? [];
      } else {
        hadFailure.value = true;
        invoicedata.value[item.invoicenum] = loadFromSession(key) ?? [];
      }
    });
  } catch (err) {
    console.error("Failed to load purchase history:", err);
    sidebarError.value = "load-failed";
    invoices.value = [];
  } finally {
    loadingSidebar.value = false;
  }
}


// --- Generate and download a certificate PDF using jsPDF ---
async function downloadCertificate(cert) {
  if (downloadingId.value === cert.id) return;
  downloadingId.value = cert.id;

  try {
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Failed to load PDF library. Check your connection."));
        document.head.appendChild(script);
      });
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const W = 297;
    const H = 210;

    doc.setFillColor(3, 71, 80);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(242, 241, 242);
    doc.roundedRect(14, 14, W - 28, H - 28, 6, 6, "F");
    doc.setFillColor(109, 190, 75);
    doc.rect(14, 14, 8, H - 28, "F");
    doc.setFillColor(0, 165, 181);
    doc.rect(22, 14, W - 36, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(3, 71, 80);
    doc.text("OFFICE OF WATER PROGRAMS", 38, 34);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(112, 112, 112);
    doc.text("California State University, Sacramento", 38, 40);
    doc.setDrawColor(0, 165, 181);
    doc.setLineWidth(0.5);
    doc.line(38, 44, W - 22, 44);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(3, 71, 80);
    doc.text("Certificate of Completion", W / 2, 68, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("This certifies that", W / 2, 82, { align: "center" });
    const displayName = accountName.value || "Student";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 165, 181);
    doc.text(displayName, W / 2, 96, { align: "center" });
    const nameWidth = doc.getTextWidth(displayName);
    doc.setDrawColor(0, 165, 181);
    doc.setLineWidth(0.4);
    doc.line(W / 2 - nameWidth / 2, 98, W / 2 + nameWidth / 2, 98);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("has successfully completed the course", W / 2, 108, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(3, 71, 80);
    const titleLines = doc.splitTextToSize(cert.title, 200);
    doc.text(titleLines, W / 2, 120, { align: "center" });
    const metaY = 148;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(38, metaY - 8, W - 22, metaY - 8);
    const metaCols = [
      { label: "Completion Date", value: cert.completedDate, x: 60 },
      { label: "Grade",           value: cert.grade,          x: W / 2 - 30 },
      { label: "CEUs",            value: String(cert.ceus),   x: W / 2 + 30 },
      { label: "Contact Hours",   value: String(cert.contactHours), x: W - 52 },
    ];
    for (const col of metaCols) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(3, 71, 80);
      doc.text(col.label, col.x, metaY, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(col.value, col.x, metaY + 7, { align: "center" });
    }
    doc.setDrawColor(3, 71, 80);
    doc.setLineWidth(0.5);
    doc.line(W / 2 - 40, 170, W / 2 + 40, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(112, 112, 112);
    doc.text("Director, Office of Water Programs", W / 2, 175, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Certificate ID: OWP-${cert.enrollId}  ·  Issued by OWP Learning Portal  ·  owp.csus.edu`,
      W / 2, H - 18, { align: "center" }
    );
    doc.setDrawColor(109, 190, 75);
    doc.setLineWidth(1.5);
    doc.circle(W - 45, 160, 18, "S");
    doc.setLineWidth(0.5);
    doc.circle(W - 45, 160, 15, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(109, 190, 75);
    doc.text("CERTIFIED", W - 45, 158, { align: "center" });
    doc.text("OWP", W - 45, 164, { align: "center" });
    const safeName = cert.title
      .replace(/[^a-z0-9]/gi, "_")
      .replace(/_+/g, "_")
      .slice(0, 40);
    doc.save(`OWP_Certificate_${safeName}.pdf`);

  } catch (e) {
    alert(`Could not generate certificate: ${e?.message ?? String(e)}`);
  } finally {
    downloadingId.value = null;
  }
}

onMounted(async () => {
  await Promise.all([loadAccount(), loadCertificates(), loadMessages(), loadInvoices()]);
  if (hadFailure.value) { alert('Some data could not be refreshed. Showing saved session data where available which may be old. Refresh the page to attempt to fetch new data.'); }
});
</script>

<template>
  <div class="certificates-page">
    <!-- Top Section -->
    <h1 class="page-title">Certificates</h1>

    <div class="page-layout">
      <!-- Left: Certificates List -->
      <div class="left-col">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search certificates..."
            class="search-input"
          />
        </div>

        <div class="course-card">
          <div class="card-header">
            <div class="header-icon">
              <img :src="certificate" alt="Certificate icon"/>
            </div>
            <h2 class="card-title">Earned Certificates</h2>
          </div>
          <div class="divider"></div>

          <div v-if="loadingCerts" class="state-message loading-message">
            Loading certificates…
          </div>
          <div v-else-if="certsError" class="state-message error-message">
            We couldn't load your certificates right now.
          </div>
          <div v-else-if="certificates.length === 0" class="state-message empty-message">
            No earned certificates found.
          </div>
          <div v-else-if="filteredCertificates.length === 0" class="state-message empty-message">
            No certificates match "{{ searchQuery }}".
          </div>

          <div v-else class="card-body">
            <div
              v-for="cert in filteredCertificates"
              :key="cert.id"
              class="certificate-item"
            >
              <div class="cert-thumbnail">
                <span class="owp-text">OWP</span>
              </div>
              <div class="cert-info">
                <div class="cert-title">{{ cert.title }}</div>
                <div class="cert-meta-row">
                  <span class="meta-chip">📅 Completed: <strong>{{ cert.completedDate }}</strong></span>
                  <span class="meta-chip">🎓 Grade: <strong>{{ cert.grade }}</strong></span>
                  <span class="meta-chip">CEUs: <strong>{{ cert.ceus }}</strong></span>
                  <span class="meta-chip">Contact Hours: <strong>{{ cert.contactHours }}</strong></span>
                </div>
                <div class="download-section">
                  <button
                    class="download-btn"
                    :disabled="downloadingId === cert.id"
                    @click="downloadCertificate(cert)"
                  >
                    <span v-if="downloadingId === cert.id">Generating…</span>
                    <span v-else>⬇ Download Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="right-col">
        <div class="side-card">
          <div class="side-header">
            <div class="side-icon">
              <img :src="mail" alt="Messages icon" />
            </div>
            <div class="side-title">Messages</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div v-if="loadingMessages" class="state-message loading-message">
              Loading messages…
            </div>
            <div v-else-if="messages.length === 0" class="state-message empty-message">
              No messages available.
            </div>
            <template v-else>
              <router-link
                v-for="message in messages.slice(0, 3)"
                :key="message.id"
                :to="`/messages?threadId=${message.id}`"
                class="side-link"
              >
                Email Message from: {{ message.sender }} {{ message.date }}
              </router-link>
          </template>
          </div>
          <router-link to="/messages" class="side-footer">(View all messages)</router-link>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="side-icon">
              <img :src="history" alt="History icon" />
            </div>
            <div class="side-title">Purchase History</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <router-link class="side-link" v-for="v in invoices.slice(0, 3)" :key="v.invoicenum" :to="`/purchase-history/${v.invoicenum}`">
                Invoice: {{ v.invoicenum }} - {{ getInvoiceName(v.invoicenum) }}
            </router-link>
          </div>
          <router-link to="/purchase-history" class="side-footer">(View all purchases)</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificates-page {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 32rem;
  justify-content: center;
  align-items: start;
  padding: 16rem 0 42rem;
  color: #034750;
}

.page-title {
  justify-self: start;
  width: 1016rem;
  padding: 0 16rem;
  margin: 0;
  font-size: 28rem;
  font-weight: 800;
  color: #034750;
}

.page-layout {
  display: grid;
  grid-template-columns: 700rem 300rem;
  column-gap: 16rem;
  row-gap: 16rem;
  margin: 0 auto;
  padding: 0 16rem;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

/* Search */
.search-container { width: 100%; }
.search-input {
  padding: 10rem 16rem;
  border: 1rem solid #ccc;
  border-radius: 8rem;
  font-size: 16rem;
  width: 100%;
  outline: none;
  box-sizing: border-box;
}
.search-input:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3rem rgba(0, 165, 181, 0.15);
}
.search-input::placeholder { color: #999; }

/* Main card */
.course-card {
  background-color: #f2f1f2;
  border-radius: 14rem;
  padding: 16rem 20rem 20rem 20rem;
  display: flex;
  flex-direction: column;
  gap: 12rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8rem;
  padding-top: 4rem;
  margin-left: 20rem;
}

.header-icon { width: 26rem; height: 34rem; }
.card-title { font-size: 20rem; font-weight: 700; color: #034750; margin: 0; }

.divider { width: 100%; border-top: 1rem solid #ffffff; }

.state-message { padding: 12rem 20rem; font-size: 16rem; }
.loading-message, .empty-message { color: #707070; }
.error-message { color: #9f3323; font-weight: 600; }

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-height: 520rem;
  overflow-y: auto;
  padding-right: 4rem;
}

.card-body::-webkit-scrollbar { width: 6rem; }
.card-body::-webkit-scrollbar-track { background: transparent; }
.card-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3rem; }

.certificate-item {
  display: grid;
  grid-template-columns: 70rem 1fr;
  gap: 16rem;
  padding: 16rem 20rem;
  margin: 0 -20rem;
  width: calc(100% + 40rem);
  transition: background-color 0.2s ease;
}
.certificate-item:hover { background-color: #d9d9d9; }

.cert-thumbnail {
  width: 70rem;
  height: 90rem;
  background: linear-gradient(135deg, #5aa843 0%, #6dbe4b 100%);
  border-radius: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rem 8rem rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.owp-text { color: white; font-weight: bold; font-size: 18rem; }

.cert-info {
  display: flex;
  flex-direction: column;
  gap: 7rem;
  justify-content: center;
}
.cert-title {
  font-size: 16rem;
  font-weight: 600;
  color: #707070;
  text-decoration: underline;
  line-height: 1.4;
}

.cert-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6rem;
  margin-top: 2rem;
}
.meta-chip {
  font-size: 13rem;
  color: #555;
  background-color: #e8e8e8;
  border-radius: 20rem;
  padding: 3rem 10rem;
  white-space: nowrap;
}
.meta-chip strong { color: #034750; }

.download-section { margin-top: 4rem; }
.download-btn {
  background-color: #00a5b5;
  color: white;
  border: none;
  border-radius: 6rem;
  padding: 7rem 16rem;
  font-size: 14rem;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.download-btn:hover:not(:disabled) {
  background-color: #008c9a;
  transform: translateY(-1rem);
}
.download-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Sidebar */
.side-card {
  background-color: #f2f1f2;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
}
.side-icon { width: 26rem; height: 34rem; }
.side-header { display: flex; align-items: center; gap: 10rem; margin: 16rem 20rem 0 20rem; }
.side-title { font-size: 20rem; font-weight: 700; color: #034750; }
.side-body { width: 100%; height: 172rem; display: flex; flex-direction: column;}
.side-link {
  padding-left: 20rem;
  padding-right: 20rem;
  font-size: 16rem;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  transition: background-color 0.2s ease;
}
.side-link:hover { background-color: #d9d9d9; }
.side-footer {
  height: 32rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 18rem;
  font-weight: 400;
  margin: 0 20rem 20rem 20rem;
  cursor: pointer;
  color: #034750;
  text-decoration: none;
}
.side-footer:hover { text-decoration: underline; color: #007c8a; }
</style>
