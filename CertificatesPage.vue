<template>
  <div class="courses-page">
    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Certificates</div>
        <p class="page-description">View and download your earned certificates</p>
      </div>
      <div class="search-bar">
        <input type="text" placeholder="Search certificates..." />
      </div>
    </div>

    <div class="courses-bottom">
      <!-- Left: Certificates List -->
      <div class="courses-left">
        <div class="tiles-container">
          <div class="course-card certificate-card">
            <div class="card-header">
              <div class="header-icon certificate-icon"></div>
              <h2 class="card-title">Earned Certificates</h2>
            </div>
            <div class="card-body">
              <div
                v-for="cert in certificates"
                :key="cert.id"
                class="course-row certificate-row"
              >
                <div class="course-image certificate-image"></div>
                <div class="course-info">
                  <div class="course-title">{{ cert.title }}</div>
                  <div class="info-subrow">
                    <div class="completion-label">Grade Achieved: {{ cert.grade }}</div>
                  </div>
                  <div class="download-link">
                    Download Certificate:
                    <a :href="cert.downloadUrl" target="_blank" class="download-btn">
                      https://yourwebsite.com/certificates/certificate_{{ cert.id }}.pdf
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Side Panels (Messages, Transcripts, etc.) -->
      <div class="courses-right">
        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon messages-icon"></div>
            <div class="side-title">Messages</div>
          </div>
          <div class="side-body">
            <div class="side-link">Example Email Message (5/8/2025)</div>
            <div class="side-link">Example Email Message (5/3/2025)</div>
            <div class="side-link">Example Email Message (4/21/2025)</div>
          </div>
          <div class="side-footer">(View all messages)</div>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon transcript-icon"></div>
            <div class="side-title">Transcripts</div>
          </div>
          <div class="side-body">
            <div class="side-link">View Transcript</div>
            <div class="side-link">Purchase Transcript</div>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchCertificates } from '@/services/certificates.service'

// Types
export type CertStatus = 'Completed' | 'In Progress' | 'Pending'
export interface Certificate {
  id: string
  title: string
  gradePercent?: number // 0..100 if completed or graded
  status: CertStatus
  issued?: string       // ISO/display date if applicable
  image?: string        // url to cover/thumb
  pdfUrl?: string       // download link
}

// State
const loading = ref(false)
const error = ref<string | null>(null)
const certificates = ref<Certificate[]>([])

// Filters
const searchTerm = ref('')
const statusFilter = ref<CertStatus | ''>('')

// Derived
const filteredCertificates = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const status = statusFilter.value
  return certificates.value.filter(c => {
    const matchesTerm = term ? c.title.toLowerCase().includes(term) : true
    const matchesStatus = status ? c.status === status : true
    return matchesTerm && matchesStatus
  })
})

// Summary-ish counts (optional usage)
const totalCompleted = computed(() => certificates.value.filter(c => c.status === 'Completed').length)

// Actions
function downloadCert(c: Certificate) {
  if (!c.pdfUrl) return
  window.location.href = c.pdfUrl // D2 behavior
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchCertificates()
    certificates.value = data
  } catch (e: any) {
    error.value = e?.message || 'Failed to load certificates.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="dashboard-page" data-page="certificates">
    <!-- ===== Top: breadcrumb + page title + (optional) blurb image ===== -->
    <div class="dashboard-top">
      <div class="text">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="crumb">Dashboard</a>
          <span class="crumb-sep">&gt;</span>
          <span class="crumb-current">Certificates</span>
        </nav>
        <div class="page-pill" aria-hidden="true">Certificates</div>
      </div>
      <div class="image">
        <img src="@/assets/owpart.png" alt="OWP art" />
      </div>
    </div>

    <!-- ===== Bottom: content + sidebar (match Courses page) ===== -->
    <div class="dashboard-bottom">
      <!-- LEFT: Main content -->
      <section class="main-col">
        <!-- Error banner -->
        <div v-if="error" class="alert" role="alert">
          <div class="alert-title">Couldn’t load certificates</div>
          <div class="alert-desc">{{ error }}</div>
          <button class="btn small" @click="load">Retry</button>
        </div>

        <!-- Certificates block -->
        <div class="block">
          <!-- Header row: title + search + (optional) filter -->
          <div class="block-head">
            <h2 class="block-title">Certificates</h2>
            <div class="filters">
              <label class="sr-only" for="search">Search certificates</label>
              <input id="search" v-model="searchTerm" type="text" class="filter-input" placeholder="Search by title..." />

              <label class="sr-only" for="status">Status filter</label>
              <select id="status" v-model="statusFilter" class="filter-select">
                <option value="">All</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <!-- List -->
          <div class="cert-list">
            <!-- Loading skeletons -->
            <div v-if="loading" class="skeleton-list">
              <div class="skeleton-item" v-for="n in 4" :key="n"></div>
            </div>

            <template v-else>
              <article v-for="c in filteredCertificates" :key="c.id" class="cert-item">
                <img class="thumb" :src="c.image || '/placeholder.png'" :alt="c.title" />
                <div class="info">
                  <a class="title" href="#">{{ c.title }}</a>
                  <div class="meta">
                    <span v-if="typeof c.gradePercent === 'number'">Grade Achieved : <strong>{{ c.gradePercent }}%</strong></span>
                    <span v-else>Grade Achieved : <strong>—</strong></span>
                  </div>
                  <div class="download">
                    <template v-if="c.pdfUrl">
                      <button class="linkish" @click="downloadCert(c)">Download Certificate</button>
                    </template>
                    <span v-else class="muted">Certificate not available yet</span>
                  </div>
                </div>
              </article>

              <div v-if="!filteredCertificates.length" class="placeholder">No certificates match your search/filter.</div>
            </template>
          </div>
          <div class="side-footer">(View all transcripts)</div>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon purchase-icon"></div>
            <div class="side-title">Purchase History</div>
          </div>
          <div class="side-body">
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol.1</div>
            <div class="side-link">Advanced Water Treatment</div>
          </div>
          <div class="side-footer">(View all purchases)</div>
        </div>
      </div>
      <!-- RIGHT: Sidebar panels (mirror Courses page) -->
      <aside class="side-col">
        <section class="side block">
          <header class="side-head">
            <div class="side-icon" aria-hidden="true"></div>
            <h3>Messages</h3>
          </header>
          <ul class="side-links">
            <li><a href="#">Example Email Message (5/5/2025)</a></li>
            <li><a href="#">Example Email Message (5/3/2025)</a></li>
            <li><a href="#">Example Email Message (5/1/2025)</a></li>
          </ul>
          <div class="side-foot">(View all messages)</div>
        </section>

        <section class="side block">
          <header class="side-head">
            <div class="side-icon" aria-hidden="true"></div>
            <h3>Transcripts</h3>
          </header>
          <ul class="side-links">
            <li><a href="#">View Transcript</a></li>
            <li><a href="#">Purchase Transcript</a></li>
          </ul>
          <div class="side-foot">(View all messages)</div>
        </section>

        <section class="side block">
          <header class="side-head">
            <div class="side-icon purchase" aria-hidden="true"></div>
            <h3>Purchase History</h3>
          </header>
          <ul class="side-links">
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 1</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 2</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 3</a></li>
          </ul>
          <div class="side-foot">(View all messages)</div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CertificatesPage",
  data() {
    return {
      certificates: [
        {
          id: 1,
          title: "Advanced Water Treatment",
          grade: "90%",
          downloadUrl: "#",
        },
        {
          id: 2,
          title: "Operation and Maintenance of Wastewater Collection Systems, Vol 1",
          grade: "95%",
          downloadUrl: "#",
        },
        {
          id: 3,
          title: "Operation and Maintenance of Wastewater Collection Systems, Vol 2",
          grade: "100%",
          downloadUrl: "#",
        },
        {
          id: 4,
          title: "Water Distribution System Operation and Maintenance",
          grade: "100%",
          downloadUrl: "#",
        },
      ],
    };
  },
});
</script>

<style scoped>
/* Reusing exact same styles from Courses page */
.courses-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  font-family: 'Myriad Pro', sans-serif;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.courses-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.page-description {
  font-size: 16px;
  color: #555;
  margin-top: 8px;
}

.search-bar input {
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 240px;
}

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16px;
  margin: 0 auto 48px auto;
}

.courses-left,
.courses-right {
  display: flex;
  flex-direction: column;
}

.tiles-container {
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.course-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s ease;
}

.course-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.header-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

.certificate-icon {
  background-color: #6DBE4B; /* Green like completed */
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.certificate-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
}

.course-image {
  width: 70px;
  height: 84px;
  background-color: #6DBE4B;
  border-radius: 4px;
  background-image: url('https://via.placeholder.com/70x84/6DBE4B/FFFFFF?text=OWP');
  background-size: cover;
}

.certificate-image {
  background-color: #6DBE4B;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.course-title {
  font-size: 16px;
  color: #034750;
  font-weight: 600;
  line-height: 1.4;
}

.info-subrow {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #707070;
}

.completion-label {
  font-weight: 600;
}

.download-link {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}

.download-btn {
  color: #00A5B5;
  text-decoration: underline;
  font-weight: 600;
}

.download-btn:hover {
  color: #034750;
}

/* Right Sidebar - Reused exactly */
.courses-right {
  gap: 16px;
  margin-top: 46px;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s ease;
}

.side-card:hover {
  box-shadow: 0px 4px 14px rgba(0,0,0,0.18);
  transform: translateY(-3px);
}

.side-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.side-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.side-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

.messages-icon { background-color: #00A5B5; }
.transcript-icon { background-color: #6DBE4B; }
.purchase-icon { background-color: #034750; }

.side-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.side-link {
  font-size: 16px;
  color: #007c8a;
  text-decoration: underline;
  cursor: pointer;
}

.side-footer {
  text-align: center;
  font-size: 16px;
  color: #034750;
  cursor: pointer;
  margin-top: 8px;
}
</style>
/* ===== Shared page frame (matches other pages) ===== */
.dashboard-page { display: grid; grid-template-rows: auto 1fr; row-gap: 32px; justify-content: center; align-items: start; }
.dashboard-top { grid-row: 1; display: grid; grid-template-columns: 508px 508px; margin-top: 32px; }
.text { grid-column: 1; display: flex; flex-direction: column; justify-content: center; height: 160px; color: #034750; }
.image > img { width: 100%; height: 100%; object-fit: scale-down; display: block; }

/* Breadcrumb */
.breadcrumb { margin: 0 0 8px 24px; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.crumb { color: #2563eb; text-decoration: none; }
.crumb:hover { text-decoration: underline; }
.crumb-sep { color: #6b7280; }
.crumb-current { color: #111827; font-weight: 600; }

/* Pill header bar like mock */
.page-pill { background: #00A5B5; color: #fff; font-weight: 800; border-radius: 10px; padding: 10px 16px; width: fit-content; margin-left: 24px; }

/* Two-column grid */
.dashboard-bottom { grid-row: 2; display: grid; grid-template-columns: 700px 300px; column-gap: 16rem; margin-bottom: 48px; }
.main-col, .side-col { display: flex; flex-direction: column; gap: 16px; }

/* Blocks */
.block { background: #F2F1F2; border-radius: 14px; padding: 16px 18px; }
.block-title { margin: 0; font-size: 18px; font-weight: 800; color: #034750; }
.block-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }

/* Filters */
.filters { display: flex; gap: 8px; align-items: center; }
.filter-input, .filter-select { padding: 8px 10px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 14px; }

/* Certificate list */
.cert-list { display: grid; gap: 16px; }
.cert-item { display: grid; grid-template-columns: 90px 1fr; gap: 16px; background: #fff; border-radius: 12px; padding: 14px; }
.thumb { width: 90px; height: 90px; object-fit: cover; border-radius: 6px; background: #e5e7eb; }
.info { display: grid; gap: 6px; align-content: start; }
.title { color: #034750; font-weight: 800; text-decoration: underline; }
.meta { color: #4b5563; font-size: 14px; }
.download { font-size: 14px; }
.linkish { background: none; border: none; color: #2563eb; text-decoration: underline; padding: 0; cursor: pointer; font-weight: 600; }
.linkish:hover { filter: brightness(.95); }
.muted { color: #9ca3af; }
.placeholder { color: #6b7280; padding: 8px 0 2px; }

/* Sidebar */
.side { padding: 12px; }
.side-head { display: flex; align-items: center; gap: 8px; margin: 6px 6px 10px; }
.side-head h3 { margin: 0; font-size: 16px; font-weight: 800; color: #034750; }
.side-icon { width: 26px; height: 26px; border-radius: 50%; background: #007C8A; }
.side-icon.purchase { background: #00A5B5; }
.side-links { list-style: none; padding: 0; margin: 0 6px 8px; display: grid; gap: 8px; }
.side-links a { color: #007C8A; text-decoration: underline; font-size: 14px; }
.side-foot { text-align: center; color: #6c8082; font-size: 12px; margin: 4px 0 2px; }

/* Buttons & alerts */
.btn { background: #00A5B5; color: #fff; border: 0; border-radius: 12px; padding: 8px 12px; font-weight: 700; cursor: pointer; }
.btn.small { padding: 6px 10px; font-size: 13px; border-radius: 10px; }
.alert { background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239; padding: 12px 14px; border-radius: 12px; display: grid; gap: 6px; }
.alert-title { font-weight: 800; }
.alert-desc { font-size: 14px; }

/* Skeleton list */
.skeleton-list { display: grid; gap: 12px; }
.skeleton-item { height: 118px; border-radius: 12px; background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%); background-size: 400% 100%; animation: shimmer 1.2s infinite; }
@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

/* Accessibility */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

/* Responsive */
@media (max-width: 1100px) {
  .dashboard-top { grid-template-columns: 1fr; }
  .dashboard-bottom { grid-template-columns: 1fr; column-gap: 0; }
  .filters { width: 100%; }
  .filter-input { flex: 1; }
}
</style>
