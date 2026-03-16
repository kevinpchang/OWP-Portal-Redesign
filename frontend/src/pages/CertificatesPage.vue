<script setup>
import { ref, computed, onMounted } from "vue";
import { Award, Mail, FileText, History } from "lucide-vue-next";
import {
  getAccountDetails,
  getActiveEnrollment,
  getEnrollmentRecord,
} from "@/services/owpAPI.js";

import certificate from '@/assets/icons/owp-2color/certificate-icon.svg'
import transcript from '@/assets/icons/owp-2color/transcipt-icon.svg'
import history from '@/assets/icons/owp-2color/history-icon.svg'
import mail from '@/assets/icons/owp-2color/mail-icon.svg'

const pid = Number(localStorage.getItem("pid")) || 458860;

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

// --- Load account name ---
async function loadAccount() {
  loadingAccount.value = true;
  accountError.value = "";
  try {
    const data = await getAccountDetails(pid);
    accountName.value = data?.response?.fullname ?? "";
  } catch (e) {
    accountError.value = e?.message ?? String(e);
  } finally {
    loadingAccount.value = false;
  }
}

// --- Load certificates from activeEnrollment ---
// No dedicated /certificates endpoint exists in the OWP API.
// We derive certificates from completed enrollments with grade "CR" (Credit = Pass).
// CEUs and contact hours are fetched per-enrollment from enrollmentRecord.
async function loadCertificates() {
  loadingCerts.value = true;
  certsError.value = "";
  try {
    const data = await getActiveEnrollment(pid);
    const rows = data?.response ?? [];

    const completed = rows.filter(
      (r) =>
        r.statustxt === "Complete" &&
        String(r.grade ?? "").trim() === "CR"
    );

    // Fetch enrollmentRecord for CEUs + contact hours
    const enriched = await Promise.all(
      completed.map(async (r) => {
        let ceus = "—";
        let contactHours = "—";
        try {
          const rec = await getEnrollmentRecord(r.enrollid);
          const record = Array.isArray(rec?.response)
            ? rec.response[0]
            : rec?.response;
          if (record) {
            const rawCeu = Number(record.ceus ?? record.ceu);
            ceus = Number.isFinite(rawCeu) ? rawCeu.toFixed(1) : "—";
            contactHours = record.contacthour ?? record.contacthours ?? "—";
          }
        } catch (_) {
          // silently fallback — CEUs/hours not critical
        }
        return {
          id: r.enrollid,
          enrollId: r.enrollid,
          title: r.title || "Course title unavailable",
          completedDate: r.completedate || "—",
          grade: "CR (Pass)",
          ceus,
          contactHours,
        };
      })
    );

    certificates.value = enriched;
  } catch (e) {
    certsError.value = e?.message ?? String(e);
    certificates.value = [];
  } finally {
    loadingCerts.value = false;
  }
}

// --- Generate and download a certificate PDF using jsPDF ---
// jsPDF is loaded dynamically from CDN — no npm install needed.
async function downloadCertificate(cert) {
  if (downloadingId.value === cert.id) return;
  downloadingId.value = cert.id;

  try {
    // Dynamically load jsPDF from CDN if not already present
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

    // ── Background ──────────────────────────────────────────────
    doc.setFillColor(3, 71, 80);           // #034750 deep teal
    doc.rect(0, 0, W, H, "F");

    // Light inner panel
    doc.setFillColor(242, 241, 242);       // #F2F1F2
    doc.roundedRect(14, 14, W - 28, H - 28, 6, 6, "F");

    // Green accent bar on left
    doc.setFillColor(109, 190, 75);        // #6DBE4B
    doc.rect(14, 14, 8, H - 28, "F");

    // Teal accent bar on top
    doc.setFillColor(0, 165, 181);         // #00A5B5
    doc.rect(22, 14, W - 36, 6, "F");

    // ── OWP header ───────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(3, 71, 80);
    doc.text("OFFICE OF WATER PROGRAMS", 38, 34);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(112, 112, 112);
    doc.text("California State University, Sacramento", 38, 40);

    // Horizontal rule
    doc.setDrawColor(0, 165, 181);
    doc.setLineWidth(0.5);
    doc.line(38, 44, W - 22, 44);

    // ── "Certificate of Completion" ──────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(3, 71, 80);
    doc.text("Certificate of Completion", W / 2, 68, { align: "center" });

    // ── "This certifies that" ────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("This certifies that", W / 2, 82, { align: "center" });

    // ── Recipient name ───────────────────────────────────────────
    const displayName = accountName.value || "Student";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 165, 181);
    doc.text(displayName, W / 2, 96, { align: "center" });

    // Underline name
    const nameWidth = doc.getTextWidth(displayName);
    doc.setDrawColor(0, 165, 181);
    doc.setLineWidth(0.4);
    doc.line(W / 2 - nameWidth / 2, 98, W / 2 + nameWidth / 2, 98);

    // ── "has successfully completed" ─────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text("has successfully completed the course", W / 2, 108, { align: "center" });

    // ── Course title ─────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(3, 71, 80);
    const titleLines = doc.splitTextToSize(cert.title, 200);
    doc.text(titleLines, W / 2, 120, { align: "center" });

    // ── Metadata row ─────────────────────────────────────────────
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

    // ── Signature line ───────────────────────────────────────────
    doc.setDrawColor(3, 71, 80);
    doc.setLineWidth(0.5);
    doc.line(W / 2 - 40, 170, W / 2 + 40, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(112, 112, 112);
    doc.text("Director, Office of Water Programs", W / 2, 175, { align: "center" });

    // ── Footer ───────────────────────────────────────────────────
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Certificate ID: OWP-${cert.enrollId}  ·  Issued by OWP Learning Portal  ·  owp.csus.edu`,
      W / 2, H - 18, { align: "center" }
    );

    // ── Decorative seal ──────────────────────────────────────────
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

    // ── Save ─────────────────────────────────────────────────────
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
  await Promise.all([loadAccount(), loadCertificates()]);
});
</script>

<template>
  <div class="certificates-page">
    <!-- Top Section -->
    <div class="courses-top">
      <div class="text-block">
        <h1 class="courses-header">Certificates</h1>
        <p class="page-description">View and download your earned certificates</p>
        <div style="margin-top: 10px; font-size: 14px; color: #707070;">
          <span v-if="loadingAccount">Loading account…</span>
          <span v-else-if="accountError" style="color: #9F3323;">{{ accountError }}</span>
          <span v-else>Logged in as: <strong>{{ accountName }}</strong></span>
        </div>
      </div>

      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search certificates..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="courses-bottom">
      <!-- Left: Certificates List -->
      <div class="courses-left">
        <div class="tiles-container">
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
      </div>

      <!-- Right: Sidebar -->
      <div class="courses-right">
        <div class="side-card">
          <div class="side-header">
            <div class="side-icon">
              <img :src="mail" alt="Messages icon" />
            </div>
            <div class="side-title">Messages</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div class="side-link">Email message (11/10/2025)</div>
            <div class="side-link">Email message (11/08/2025)</div>
            <div class="side-link">Email message (11/05/2025)</div>
          </div>
          <router-link to="/messages" class="side-footer">(View all messages)</router-link>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="side-icon">
              <img :src="mail" alt="Transcript icon" />
            </div>
            <div class="side-title">Transcripts</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div class="side-link">View Transcript</div>
            <div class="side-link">Purchase Transcript</div>
          </div>
          <div class="side-footer">(View all transcripts)</div>
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
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 1</div>
            <div class="side-link">Advanced Water Treatment</div>
            <div class="side-link">Water Distribution System Operation</div>
          </div>
          <router-link to="/purchase-history" class="side-footer">(View all purchases)</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.certificates-page {
  font-family: "Roboto", sans-serif;
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 5;
  padding-bottom: 8px;
}

.courses-header { font-size: 32px; font-weight: 700; color: #034750; margin: 0; }
.page-description { font-size: 16px; color: #555; margin: 8px 0 0; }
.search-container { position: relative; }

.search-input {
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 260px;
  outline: none;
}

.search-input:focus {
  border-color: #00a5b5;
  box-shadow: 0 0 0 3px rgba(0, 165, 181, 0.15);
}

.search-input::placeholder { color: #999; }

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16px;
  padding: 0 20px;
}

.courses-left { display: flex; flex-direction: column; }

.tiles-container {
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.course-card {
  background-color: #f2f1f2;
  border-radius: 14px;
  padding: 16px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
  margin-left: 20px;
}

.header-icon, .side-icon { width: 26px; height: 34px; }
.card-title, .side-title { font-size: 20px; font-weight: 700; color: #034750; margin: 0; }

.divider { width: 100%; border-top: 1px solid #ffffff; margin: 12px 0 8px 0; }

.state-message { padding: 12px 20px; font-size: 16px; }
.loading-message, .empty-message { color: #707070; }
.error-message { color: #9f3323; font-weight: 600; }

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}

.card-body::-webkit-scrollbar { width: 6px; }
.card-body::-webkit-scrollbar-track { background: transparent; }
.card-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }

.certificate-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  padding: 16px 20px;
  margin: 0 -20px;
  width: calc(100% + 40px);
  transition: background-color 0.2s ease;
}

.certificate-item:hover { background-color: #d9d9d9; }

.cert-thumbnail {
  width: 70px;
  height: 90px;
  background: linear-gradient(135deg, #5aa843 0%, #6dbe4b 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.owp-text { color: white; font-weight: bold; font-size: 18px; }

.cert-info {
  display: flex;
  flex-direction: column;
  gap: 7px;
  justify-content: center;
}

.cert-title {
  font-size: 16px;
  font-weight: 600;
  color: #707070;
  text-decoration: underline;
  line-height: 1.4;
}

.cert-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.meta-chip {
  font-size: 13px;
  color: #555;
  background-color: #e8e8e8;
  border-radius: 20px;
  padding: 3px 10px;
  white-space: nowrap;
}

.meta-chip strong { color: #034750; }

.download-section { margin-top: 4px; }

.download-btn {
  background-color: #00a5b5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 7px 16px;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.download-btn:hover:not(:disabled) {
  background-color: #008c9a;
  transform: translateY(-1px);
}

.download-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.courses-right { display: flex; flex-direction: column; gap: 16px; margin-top: 46px; }

.side-card {
  background-color: #f2f1f2;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-header { display: flex; align-items: center; gap: 10px; margin: 16px 20px 0 20px; }
.side-body { display: flex; flex-direction: column; gap: 14px; margin: 0 20px; }

.side-link {
  font-size: 16px;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px 0;
  transition: background-color 0.2s ease;
}

.side-link:hover { background-color: #d9d9d9; }

.side-footer {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 18px;
  font-weight: 400;
  margin: 0 20px 20px 20px;
  cursor: pointer;
  color: #034750;
  text-decoration: none;
}

.side-footer:hover { text-decoration: underline; color: #007c8a; }

@media (max-width: 768px) {
  .courses-bottom { grid-template-columns: 1fr; }
  .courses-right { margin-top: 20px; }
  .search-input { width: 200px; }
}
</style>