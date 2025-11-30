<template>
  <div class="certificates-page">
    <!-- Top Section -->
    <div class="courses-top">
      <div class="text-block">
        <h1 class="courses-header">Certificates</h1>
        <p class="page-description">View and download your earned certificates</p>
      </div>
      <div class="search-container">
        <input type="text" placeholder="Search certificates..." class="search-input" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="courses-bottom">
      <!-- Left: Certificates List -->
      <div class="courses-left">
        <div class="tiles-container">
          <!-- Earned Certificates Card -->
          <div class="course-card">
            <div class="card-header">
              <Award class="header-icon" color="#6DBE4B" />
              <h2 class="card-title">Earned Certificates</h2>
            </div>
            <div class="card-divider"></div>
            <div class="card-body">
              <div
                v-for="cert in certificates"
                :key="cert.id"
                class="certificate-item"
                @click="scrollToCertificate(cert.id)"
              >
                <div class="cert-thumbnail">
                  <span class="owp-text">OWP</span>
                </div>
                <div class="cert-info">
                  <div class="cert-title">{{ cert.title }}</div>
                  <div class="cert-grade">Grade Achieved: <strong>{{ cert.grade }}</strong></div>
                  <div class="download-section">
                    Download Certificate:
                    <a :href="cert.downloadUrl" target="_blank" class="download-link">
                      certificate_{{ cert.id }}.pdf
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Sidebar -->
      <div class="courses-right">
        <!-- Messages -->
        <div class="side-card">
          <div class="side-header">
            <Mail class="side-icon" color="#00A5B5" />
            <div class="side-title">Messages</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div class="side-link">Email message (11/10/2025)</div>
            <div class="side-link">Email message (11/08/2025)</div>
            <div class="side-link">Email message (11/05/2025)</div>
          </div>
          <div class="side-footer">(View all messages)</div>
        </div>

        <!-- Transcripts -->
        <div class="side-card">
          <div class="side-header">
            <FileText class="side-icon" color="#6DBE4B" />
            <div class="side-title">Transcripts</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div class="side-link">View Transcript</div>
            <div class="side-link">Purchase Transcript</div>
          </div>
          <div class="side-footer">(View all transcripts)</div>
        </div>

        <!-- Purchase History -->
        <div class="side-card">
          <div class="side-header">
            <History class="side-icon" color="#034750" />
            <div class="side-title">Purchase History</div>
          </div>
          <div class="divider"></div>
          <div class="side-body">
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 1</div>
            <div class="side-link">Advanced Water Treatment</div>
            <div class="side-link">Water Distribution System Operation</div>
          </div>
          <router-link to="/purchase-history" class="side-footer">
            (View all purchases)
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Award, Mail, FileText, History } from 'lucide-vue-next'

const certificates = ref([
  {
    id: 1,
    title: "Advanced Water Treatment",
    grade: "90%",
    downloadUrl: "https://example.com/certs/advanced.pdf"
  },
  {
    id: 2,
    title: "Operation and Maintenance of Wastewater Collection Systems, Vol 1",
    grade: "95%",
    downloadUrl: "https://example.com/certs/wastewater-vol1.pdf"
  },
  {
    id: 3,
    title: "Operation and Maintenance of Wastewater Collection Systems, Vol 2",
    grade: "100%",
    downloadUrl: "https://example.com/certs/wastewater-vol2.pdf"
  },
  {
    id: 4,
    title: "Water Distribution System Operation and Maintenance",
    grade: "100%",
    downloadUrl: "https://example.com/certs/distribution.pdf"
  }
])

const scrollToCertificate = (id) => {
  console.log('View certificate:', id)
}
</script>

<style scoped>
.certificates-page {
  font-family: 'Roboto', sans-serif;
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

.courses-header {
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

.search-container {
  position: relative;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 260px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16px;
  padding: 0 20px;
}

.courses-left {
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
  padding: 6px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
}

.header-icon, .side-icon {
  width: 26px;
  height: 34px;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
  margin: 0;
}

.card-divider, .divider {
  border-top: 3px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
}

.card-divider {
  margin-top: -15px;
  margin-bottom: 14px;
}

.divider {
  margin-top: 2px;
  margin-bottom: 8px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.card-body::-webkit-scrollbar {
  width: 6px;
}

.card-body::-webkit-scrollbar-track {
  background: transparent;
}

.card-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.certificate-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  padding: 16px 12px;
  margin: 0 -20px;
  width: calc(100% + 40px);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.certificate-item:hover {
  background-color: #D9D9D9;
}

.cert-thumbnail {
  width: 70px;
  height: 90px;
  background: linear-gradient(135deg, #5AA843 0%, #6DBE4B 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.owp-text {
  color: white;
  font-weight: bold;
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
}

.cert-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
}

.cert-title {
  font-size: 16px;
  font-weight: 600;
  color: #707070;
  text-decoration: underline;
  line-height: 1.4;
}

.cert-grade {
  font-size: 14px;
  color: #707070;
}

.download-section {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}

.download-link {
  color: #00A5B5;
  text-decoration: underline;
  font-weight: 600;
}

.download-link:hover {
  color: #034750;
}

.courses-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 46px;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.side-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.side-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.side-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 4px;
}

.side-link {
  font-size: 16px;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px 16px;
  margin: 0 -20px;
  width: calc(100% + 40px);
  transition: background-color 0.2s ease;
}

.side-link:hover {
  background-color: #D9D9D9;
}

.side-footer {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 8px;
  cursor: pointer;
  color: #034750;
  text-decoration: none;
}

.side-footer:hover {
  text-decoration: underline;
  color: #007C8A;
}

@media (max-width: 768px) {
  .courses-bottom {
    grid-template-columns: 1fr;
  }
  .courses-right {
    margin-top: 20px;
  }
  .search-input {
    width: 200px;
  }
}
</style>
