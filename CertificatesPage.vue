<script setup lang="ts">
interface Certificate {
  id: string
  name: string
  course: string
  issued: string // ISO date string or '' if none
  pdfUrl?: string // if missing, disable download
}

// ---- Mock Data (C) ----
const issuedCertificates: Certificate[] = [
  { id: 'wqb-101', name: 'Water Quality Basics', course: 'WQB‑101', issued: '2025-09-30', pdfUrl: '/mock/Water_Quality_Basics.pdf' },
  { id: 'top-201', name: 'Treatment Operations L1', course: 'TOP‑201', issued: '2025-08-12', pdfUrl: '/mock/Treatment_Operations_L1.pdf' },
  { id: 'dss-310', name: 'Distribution Systems Safety', course: 'DSS‑310', issued: '2025-06-05' }, // no PDF yet
]

const inProgress: Certificate[] = [
  { id: 'alm-405', name: 'Advanced Lab Methods', course: 'ALM‑405', issued: '' },
]

// ---- Download behavior (D2) ----
function downloadCert(cert: Certificate) {
  if (!cert.pdfUrl) return
  window.location.href = cert.pdfUrl
}

// Top date (nice touch, optional)
const dateStr = new Date().toLocaleDateString(undefined, {
  weekday: 'long', month: 'long', day: 'numeric'
})
</script>

<template>
  <div class="certificates-page">
    <!-- ===== Top Section ===== -->
    <header class="top">
      <div class="text">
        <div class="kicker">{{ dateStr }}</div>
        <h1 class="title">Certificates</h1>
        <p class="subtitle">View, track, and download your course completion certificates.</p>
      </div>
      <div class="image">
        <img src="@/assets/owpart.png" alt="Certificates Graphic" />
      </div>
    </header>

    <!-- ===== Bottom Section ===== -->
    <main class="bottom">
      <!-- Left -->
      <section class="left">
        <!-- Panel: Issued Certificates (A + B + C) -->
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Issued Certificates</h2>
          </div>
          <div class="cards">
            <article
              v-for="cert in issuedCertificates"
              :key="cert.id"
              class="card fancy"
            >
              <div class="card-left">
                <div class="badge">PDF</div>
                <div class="meta">
                  <div class="name">{{ cert.name }}</div>
                  <div class="course">Course: {{ cert.course }}</div>
                  <div class="date">Issued: {{ cert.issued || '—' }}</div>
                </div>
              </div>
              <div class="card-right">
                <button
                  class="btn"
                  :disabled="!cert.pdfUrl"
                  @click="downloadCert(cert)"
                  aria-label="Download certificate as PDF"
                >
                  <!-- download icon -->
                  <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                    <path d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"/>
                  </svg>
                  <span>{{ cert.pdfUrl ? 'Download PDF' : 'Pending PDF' }}</span>
                </button>
              </div>
            </article>

            <!-- Show skeletons if you prefer placeholders for loading -->
            <!-- <div class="card skeleton"></div> -->
          </div>
        </div>

        <!-- Panel: In Progress -->
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">Certificates In Progress</h2>
          </div>
          <div class="cards two">
            <article v-for="cert in inProgress" :key="cert.id" class="card fancy muted">
              <div class="card-left">
                <div class="badge">WIP</div>
                <div class="meta">
                  <div class="name">{{ cert.name }}</div>
                  <div class="course">Course: {{ cert.course }}</div>
                  <div class="date">Issued: —</div>
                </div>
              </div>
              <div class="card-right">
                <button class="btn" disabled>
                  <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
                    <path d="M5 20h14v-2H5v2Zm7-18v10.17l3.59-3.58L17 10l-5 5-5-5 1.41-1.41L11 12.17V2h1Z"/>
                  </svg>
                  <span>Download PDF</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Right -->
      <aside class="right">
        <div class="panel">
          <div class="panel-head">
            <h2 class="panel-title">History</h2>
          </div>
          <ul class="history-list">
            <li>2025‑05‑18 — Sample course completed</li>
            <li>2025‑03‑02 — Sample course completed</li>
          </ul>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
/* ===== Page Layout ===== */
.certificates-page { display: grid; grid-template-rows: auto 1fr; gap: 32px; padding: 16px; }
.top { display: grid; grid-template-columns: 508px 508px; gap: 24px; margin-top: 32px; align-items: center; }
.bottom { display: grid; grid-template-columns: 700px 300px; column-gap: 16rem; }
.left, .right { display: flex; flex-direction: column; gap: 16px; }

/* ===== Top Styles ===== */
.text { color: #034750; }
.kicker { font-size: 14px; color: #6d8a8d; margin-bottom: 6px; }
.title { font-size: 48px; font-weight: 800; color: #00A5B5; margin: 0; }
.subtitle { font-size: 18px; color: #747474; margin: 6px 0 0; }
.image img { width: 100%; object-fit: contain; display: block; }

/* ===== Panels ===== */
.panel { background: #F2F1F2; border-radius: 24px; padding: 16px; box-shadow: 0 1px 0 rgba(0,0,0,.02) inset; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.panel-title { margin: 0; color: #034750; font-size: 18px; font-weight: 800; letter-spacing: .2px; }

/* ===== Cards (Style 3 — Fancy) ===== */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.cards.two { grid-template-columns: repeat(2, 1fr); }

.card.fancy { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; padding: 14px; border-radius: 20px; background: #fff; box-shadow: 0 6px 24px rgba(0, 52, 58, 0.06), 0 1px 2px rgba(0,0,0,.04); }
.card.fancy:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0, 52, 58, 0.10), 0 2px 6px rgba(0,0,0,.06); transition: .18s ease; }
.card.fancy.muted { opacity: .8; filter: grayscale(.1); }

.card-left { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
.badge { background: #E6F7F9; color: #00A5B5; border-radius: 999px; padding: 4px 10px; font-weight: 700; font-size: 12px; letter-spacing: .3px; }
.meta { display: grid; gap: 4px; }
.name { font-weight: 800; color: #034750; font-size: 16px; }
.course, .date { color: #6e6e6e; font-size: 13.5px; }

.card-right { display: flex; align-items: center; justify-content: flex-end; }
.btn { display: inline-flex; align-items: center; gap: 8px; border: none; border-radius: 12px; padding: 10px 12px; background: #00A5B5; color: #fff; cursor: pointer; font-weight: 700; box-shadow: 0 2px 0 #008898 inset; }
.btn:hover:not(:disabled) { filter: brightness(1.02); transform: translateY(-1px); }
.btn:disabled { background: #b6dfe3; color: #f5fbfc; cursor: not-allowed; box-shadow: none; }
.icon { width: 18px; height: 18px; fill: currentColor; }

/* ===== History ===== */
.history-list { margin: 0; padding-left: 18px; color: #555; display: grid; gap: 6px; }

/* ===== Skeleton Option (if needed) ===== */
.skeleton { position: relative; height: 120px; border-radius: 16px; background: #fff; overflow: hidden; }
.skeleton::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.06), rgba(0,0,0,0)); transform: translateX(-100%); animation: shimmer 1.4s infinite; }
@keyframes shimmer { 100% { transform: translateX(100%); } }

/* ===== Responsive ===== */
@media (max-width: 1100px) {
  .top { grid-template-columns: 1fr; }
  .bottom { grid-template-columns: 1fr; column-gap: 0; }
  .cards { grid-template-columns: 1fr; }
  .cards.two { grid-template-columns: 1fr; }
}
</style>
