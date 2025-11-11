
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
/*import { fetchCertificates } from '@/services/certificates.service'*/

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
        </div>
      </section>

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

<style scoped>
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
