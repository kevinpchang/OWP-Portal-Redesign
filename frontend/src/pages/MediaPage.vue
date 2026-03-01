<script setup>
import { ref } from 'vue'

// --- Completed course categories ---
const categories = [
  { id: 'video', name: 'Videos' },
  { id: 'etext', name: 'E-Texts' },
  { id: 'tool', name: 'Tools' }
]

// --- Sample media for each category ---
const completedMedia = {
  video: [
    { title: "Water Distribution Basics"},
    { title: "Water Treatment Operations"},
    { title: "Water Treatment Operations 2"}
  ],
  etext: [
    { title: "Wastewater Collection Systems", file: "media_ww1.pdf" },
    { title: "Treatment Processes and Monitoring", file: "media_ww2.pdf" }
  ],
  tool: [
    { title: "Utility Management Essentials", file: "media_mgmt1.pdf" },
    { title: "Leadership in Operations", file: "media_mgmt2.pdf" }
  ]
}

// Track which category is expanded
const activeCategory = ref('')
activeCategory.value = 'video'  // Default to video category
const toggleCategory = (id) => {
  activeCategory.value = activeCategory.value === id ? '' : id
}
</script>

<template>
  <div class="media-page">
    <!-- ===== PAGE HEADER ===== -->
    <div class="media-top">
      <div class="text-block">
        <div class="media-header">Media</div>
        <div class="media-subtitle">View your owned media</div>
      </div>
    </div>

    <!-- ===== COMPLETED COURSES ===== -->
    <div class="media-section">

      <!-- Category Tabs -->
      <div class="category-tabs">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="toggleCategory(cat.id)"
        >
          {{ cat.name }}
        </div>
      </div>

      <!-- Dropdown content for active category -->
      <transition name="fade">
        <div v-if="activeCategory" class="media-card dropdown">
          <div v-if="activeCategory === 'video'" class="video-card">
            <video
              controls
              :src="completedMedia.video.file"
              class="video-player"
            >
            </video>
            <div class="video-selection">
              <div
                v-for="(media, index) in completedMedia[activeCategory]"
                :key="index"
                class="media-row video"
              >
                <div class="video-thumb"></div>
                <div class="media-title">{{ media.title }}</div>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              v-for="(media, index) in completedMedia[activeCategory]"
              :key="index"
              class="media-row"
            >
            <div class="media-title">{{ media.title }}</div>
            <a :href="media.file" class="media-link" target="_blank">View media</a>
            </div>
          </div>

        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.media-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;

  color: #034750;
}

/* --- Page Header --- */
.media-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0 auto;
  display: flex;
  justify-content: flex-start;
}

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.media-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

/* Subtitle under header */
.media-subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #747474;
  margin-top: 6px;
}

/* --- Section --- */
.media-section {
  max-width: 1000px;
  width: 100%;
  margin: 16px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- media Card --- */
.media-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* --- Slide Row --- */
.media-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Only highlight hovered row */
.media-row:hover {
  background-color: #e5f7f9;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.media-row:hover .media-title {
  font-weight: 700;
}

.media-row:last-child {
  border-bottom: none;
}

.media-title {
  font-size: 16px;
  color: #034750;
}

.media-link {
  color: #007C8A;
  text-decoration: underline;
  font-size: 15px;
  font-weight: 600;
}

.video-card {
  display: flex;
  flex-direction: row;
  background-color: #F2F1F2;
}

.video-player {
  width: 70%;
  height: 25vw;
  border-radius: 8px;
  background-color: red;
}

.media-row.video {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
.video-thumb {
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 8px;
}

.video-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
}

.media-link:hover {
  color: #00A5B5;
}

/* --- Category Tabs --- */
.category-tabs {
  display: flex;
  justify-content: space-between;
  background-color: #F2F1F2;
  border-radius: 12px;
  padding: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tab {
  flex: 1;
  text-align: center;
  background-color: white;
  border-radius: 10px;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  color: #034750;
  border: 1px solid #d9d9d9;
  transition: all 0.2s ease;
}

.category-tab:hover {
  background-color: #e5f7f9;
  border-color: #00A5B5;
}

.category-tab.active {
  background-color: #00A5B5;
  color: white;
  border-color: #00A5B5;
}

/* --- Dropdown Card --- */
.dropdown {
  margin-top: 10px;
}

/* --- Fade Transition --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
