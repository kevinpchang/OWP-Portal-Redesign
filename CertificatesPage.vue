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