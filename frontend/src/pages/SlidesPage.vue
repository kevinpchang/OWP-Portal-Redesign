<script setup lang="ts">
import { ref } from 'vue'

// --- Sample data for slides ---
const currentSlides = [
  { title: "Introduction to Wastewater Treatment", file: "slides_ch1.pdf" },
  { title: "Effluent Discharge and Reuse", file: "slides_ch2.pdf" },
  { title: "Odor Control", file: "slides_ch3.pdf" },
]

// --- Completed course categories ---
const categories = [
  { id: 'drinking', name: 'Drinking Water Courses' },
  { id: 'wastewater', name: 'Wastewater Courses' },
  { id: 'management', name: 'Management Courses' },
  { id: 'math', name: 'Math Courses' }
]

// --- Sample slides for each category ---
const completedSlides = {
  drinking: [
    { title: "Water Distribution Basics", file: "slides_drink1.pdf" },
    { title: "Water Treatment Operations", file: "slides_drink2.pdf" }
  ],
  wastewater: [
    { title: "Wastewater Collection Systems", file: "slides_ww1.pdf" },
    { title: "Treatment Processes and Monitoring", file: "slides_ww2.pdf" }
  ],
  management: [
    { title: "Utility Management Essentials", file: "slides_mgmt1.pdf" },
    { title: "Leadership in Operations", file: "slides_mgmt2.pdf" }
  ],
  math: [
    { title: "Applied Math for Operators", file: "slides_math1.pdf" },
    { title: "Conversion Calculations", file: "slides_math2.pdf" }
  ]
}

// Track which category is expanded
const activeCategory = ref('')
const toggleCategory = (id: string) => {
  activeCategory.value = activeCategory.value === id ? '' : id
}
</script>

<template>
  <div class="slides-page">
    <!-- ===== PAGE HEADER ===== -->
    <div class="slides-top">
      <div class="text-block">
        <div class="slides-header">Instructor Slides</div>
      </div>
    </div>

    <!-- ===== CURRENT COURSES ===== -->
    <div class="slides-section">
      <h2 class="section-title current-title">Current Courses</h2>
      <div class="slides-card">
        <div v-for="(slide, index) in currentSlides" :key="index" class="slide-row">
          <div class="slide-title">{{ slide.title }}</div>
          <a :href="slide.file" class="slide-link" target="_blank">View Slides</a>
        </div>
      </div>
    </div>

    <!-- ===== COMPLETED COURSES ===== -->
    <div class="slides-section">
      <h2 class="section-title completed-title">Completed Courses</h2>

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
        <div v-if="activeCategory" class="slides-card dropdown">
          <div
            v-for="(slide, index) in completedSlides[activeCategory]"
            :key="index"
            class="slide-row"
          >
            <div class="slide-title">{{ slide.title }}</div>
            <a :href="slide.file" class="slide-link" target="_blank">View Slides</a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.slides-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  font-family: 'Myriad Pro', sans-serif;
  color: #034750;
}

/* --- Page Header --- */
.slides-top {
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

.slides-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

/* --- Section --- */
.slides-section {
  max-width: 1000px;
  width: 100%;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== CONTROL THESE TO CHANGE TITLE SPACING ===== */
.current-title {
  margin-bottom: 5px;
  margin-top: 0;
}

.completed-title {
  margin-top: 20px;
  margin-bottom: 5px;
}
/* ================================================ */

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #034750;
}

/* --- Slides Card --- */
.slides-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* --- Slide Row --- */
.slide-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Only highlight hovered row */
.slide-row:hover {
  background-color: #e5f7f9;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.slide-row:hover .slide-title {
  font-weight: 700;
}

.slide-row:last-child {
  border-bottom: none;
}

.slide-title {
  font-size: 16px;
  color: #034750;
}

.slide-link {
  color: #007C8A;
  text-decoration: underline;
  font-size: 15px;
  font-weight: 600;
}

.slide-link:hover {
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
