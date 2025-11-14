<template>
  <div class="certificates-page">
    <!-- Header -->
    <div class="page-top">
      <div class="text-block">
        <h1 class="page-title">Certificates</h1>
        <p class="page-description">View and download your earned certificates</p>
      </div>
      <div class="search-container">
        <input type="text" placeholder="Search certificates..." class="search-input" />
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <!-- Left: Certificates List -->
      <div class="left-panel">
        <div class="certificates-container">
          <!-- Certificates Card -->
          <div class="certificate-card">
            <div class="card-header">
              <div class="header-icon certificate-icon"></div>
              <h2 class="card-title">Earned Certificates</h2>
            </div>
            <div class="card-body">
              <div
                v-for="cert in certificates"
                :key="cert.id"
                class="certificate-item"
                @click="scrollToCertificate(cert.id)"
              >
                <div class="cert-thumbnail"></div>
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
      <div class="right-panel">
        <!-- Messages -->
        <div class="sidebar-card">
          <div class="sidebar-header">
            <div class="sidebar-icon messages-icon"></div>
            <h3 class="sidebar-title">Messages</h3>
          </div>
          <div class="sidebar-body">
            <div class="sidebar-link">Example Email Message (11/10/2025)</div>
            <div class="sidebar-link">Example Email Message (11/08/2025)</div>
            <div class="sidebar-link">Example Email Message (11/05/2025)</div>
          </div>
          <div class="sidebar-footer">(View all messages)</div>
        </div>

        <!-- Transcripts -->
        <div class="sidebar-card">
          <div class="sidebar-header">
            <div class="sidebar-icon transcript-icon"></div>
            <h3 class="sidebar-title">Transcripts</h3>
          </div>
          <div class="sidebar-body">
            <div class="sidebar-link">View Transcript</div>
            <div class="sidebar-link">Purchase Transcript</div>
          </div>
          <div class="sidebar-footer">(View all transcripts)</div>
        </div>

        <!-- Purchase History -->
        <div class="sidebar-card">
          <div class="sidebar-header">
            <div class="sidebar-icon purchase-icon"></div>
            <h3 class="sidebar-title">Purchase History</h3>
          </div>
          <div class="sidebar-body">
            <div class="sidebar-link">Operation of Wastewater Treatment Plants, Vol 1</div>
            <div class="sidebar-link">Advanced Water Treatment</div>
            <div class="sidebar-link">Water Distribution System Operation</div>
          </div>
          <div class="sidebar-footer">(View all purchases)</div>
        </div>
      </div>
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
          downloadUrl: "https://yourwebsite.com/certificates/advanced-water-treatment.pdf",
        },
        {
          id: 2,
          title: "Operation and Maintenance of Wastewater Collection Systems, Vol 1",
          grade: "95%",
          downloadUrl: "https://yourwebsite.com/certificates/wastewater-collection-vol1.pdf",
        },
        {
          id: 3,
          title: "Operation and Maintenance of Wastewater Collection Systems, Vol 2",
          grade: "100%",
          downloadUrl: "https://yourwebsite.com/certificates/wastewater-collection-vol2.pdf",
        },
        {
          id: 4,
          title: "Water Distribution System Operation and Maintenance",
          grade: "100%",
          downloadUrl: "https://yourwebsite.com/certificates/water-distribution.pdf",
        },
      ],
    };
  },
  methods: {
    scrollToCertificate(id: number) {
      // Future: scroll to certificate detail view
      console.log("View certificate", id);
    },
  },
});
</script>

<style scoped>
.certificates-page {
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

.page-content {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: 700px 280px;
  gap: 20px;
  padding: 0 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
}

.certificates-container {
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.certificate-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s ease;
}

.certificate-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.header-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

.certificate-icon {
  background-color: #6DBE4B;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
  margin: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.certificate-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background 0.2s;
}

.certificate-item:hover {
  background-color: rgba(109, 190, 75, 0.05);
  border-radius: 8px;
  padding: 16px;
  margin: -16px 0;
}

.certificate-item:last-child {
  border-bottom: none;
}

.cert-thumbnail {
  width: 70px;
  height: 90px;
  background: linear-gradient(135deg, #6DBE4B 0%, #5AA843 100%);
  border-radius: 6px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="40" fill="white" font-family="Arial" font-weight="bold">OWP</text></svg>');
  background-size: 60%;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  color: #034750;
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

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 46px;
}

.sidebar-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s ease;
}

.sidebar-card:hover {
  box-shadow: 0px 4px 14px rgba(0,0,0,0.18);
  transform: translateY(-3px);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.sidebar-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
}

.messages-icon { background-color: #00A5B5; }
.transcript-icon { background-color: #6DBE4B; }
.purchase-icon { background-color: #034750; }

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
  margin: 0;
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  font-size: 16px;
  color: #007c8a;
  text-decoration: underline;
  cursor: pointer;
}

.sidebar-link:hover {
  color: #034750;
}

.sidebar-footer {
  text-align: center;
  font-size: 16px;
  color: #034750;
  cursor: pointer;
  margin-top: 8px;
  font-weight: 500;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-content {
    grid-template-columns: 1fr;
  }
  .right-panel {
    margin-top: 20px;
  }
  .search-input {
    width: 200px;
  }
}
</style>
