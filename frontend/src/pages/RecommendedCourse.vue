<template>
  <div class="recommended-course-page">

    <!-- Header -->
    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <!-- Summary Tile -->
    <div class="page-container">
      <div class="summary-tile">
        <div class="card-header">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg"
              width="32" 
              height="40"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#007C8A" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              class="lucide lucide-book-marked-icon lucide-book-marked">
              <path d="M10 2v8l3-3 3 3V2"/>
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
            </svg>
          </div>
          <h2 class="card-title">Recommended Course</h2>
        </div>

        <div class="divider"></div>

        <div class="summary-body">

          <!-- Left -->
          <div class="summary-left">
            <div class="course-image-large recommended-image"></div>

            <div class="course-header-info">
              <h2 class="course-title">{{ courseTitle }}</h2>
              <p class="course-description-text">{{ courseDescription }}</p>
            </div>
          </div>

          <!-- Right long description -->
          <div class="summary-right">
            <p class="course-long-text">
              {{ courseLongDescription }}
            </p>
          </div>

        </div>
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="courses-bottom">

      <!-- Left-->
      <div class="courses-left">
        <div class="chapter-progress-tile">

          <div class="card-header">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg"
                width="32" 
                height="40"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#007C8A" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-book-marked-icon lucide-book-marked">
                <path d="M10 2v8l3-3 3 3V2"/>
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
              </svg>
            </div>
            <h2 class="card-title">Course Contents</h2>
          </div>

          <div class="divider"></div>

          <div class="chapter-table">
            <div
              class="chapter-row"
              v-for="(chapter, index) in chapters"
              :key="index"
            >
              <span class="chapter-number">{{ index + 1 }}</span>
              <span class="chapter-title">{{ chapter.title || chapter }}</span>

            </div>
          </div>
        </div>

        <router-link to="/courses" class="back-link">← Back to Courses</router-link>
      </div>

      <!-- Right sidebar -->
      <div class="courses-right">

        <!-- Messages -->
        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon">
              <svg xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-mail-icon lucide-mail">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
                <rect x="2" y="4" width="20" height="16" rx="2"/>
              </svg>
            </div>
            <div class="side-title">Messages</div>
          </div>

          <div class="divider"></div>

          <div class="side-body">
            <div class="side-link">Email message (5/5/2025)</div>
            <div class="side-link">Email message (5/03/2025)</div>
            <div class="side-link">Email message (4/21/2025)</div>
          </div>

          <div class="side-footer">(View all messages)</div>
        </div>

        <!-- Purchase History -->
        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon">
              <svg xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide 
                lucide-history-icon lucide-history">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M12 7v5l4 2"/>
              </svg>
            </div>
            <div class="side-title">Purchase History</div>
          </div>

          <div class="divider"></div>

          <div class="side-body">
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 1</div>
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 2</div>
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 3</div>
            <div class="side-link">Industrial Waste Treatment, Vol 1</div>
          </div>

          <router-link to="/purchase-history" class="side-footer">
            (View all purchases)
          </router-link>
        </div>

      </div>

    </div>
  </div>
</template>


<script>
import { useRoute } from "vue-router";
import { recommendedCourses } from "../data/coursesData.js";

export default {
  name: "RecommendedCourse",
  setup() {
    const route = useRoute();
    const courseId = Number(route.params.id);

    const course = recommendedCourses.find(c => c.id === courseId);

    const courseTitle = course ? course.title : "Course Not Found";
    const courseDescription = course ? course.description : "Description unavailable.";
    const courseLongDescription = course ? course.longDescription : "";

    const chapters =
      course && Array.isArray(course.chapters)
        ? course.chapters
        : [
            "Introduction to Wastewater Treatment",
            "Effluent Discharge and Reuse",
            "Odor Control"
          ];

    return { courseTitle, courseDescription, chapters, courseLongDescription };
  }
};
</script>


<style scoped>
.recommended-course-page {
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  color: #034750;
  padding: 0;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0;
  display: flex;
  justify-content: flex-start;
}

.courses-header {
  font-size: 32px;
  font-weight: 700;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.summary-tile {
  background-color: #F2F1F2;
  padding: 20px;
  margin-top: 32px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateY(-4px);
  margin-bottom: 4px;
}

.header-icon {
  width: 32px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;   
  border-radius: 0;  
  padding: 0;
}

.side-icon {
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;  
}

.side-icon svg {
  width: 28px;
  height: 28px;
  stroke: #007C8A;
}


.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.summary-tile .divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: -15px;
  margin-bottom: 14px;
}

.chapter-progress-tile .divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 18px;
  margin-bottom: 18px;
}

.summary-body {
  display: flex;
  justify-content: flex-start;
  gap: 48px;
}

.summary-left {
  display: flex;
  gap: 16px;
}

.course-image-large {
  width: 100px;
  height: 120px;
  background-color: #6DBE4B;
  border-radius: 4px;
}

.course-header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: -12px;
}

.course-title {
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 16px;
  color: #707070;
  max-width: 260px;
}

.course-description-text {
  font-size: 15px;
  color: #555;
  max-width: 260px;
  line-height: 1.4;
  margin-top: -12px;
}

.summary-right {
  max-width: 540px;
}

.course-long-text {
  font-size: 15px;
  line-height: 1.45;
  color: #034750;
  margin-top: 1px;
  margin-left:-30px;
}

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto;
  display: grid;
  grid-template-columns: 1.6fr 0.8fr;
  gap: 8px;
}

.courses-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chapter-progress-tile {
  background-color: #F2F1F2;
  padding: 20px;
  border-radius: 14px;
}

.chapter-progress-tile {
  width: 95%;
  max-width: none;  
}

.chapter-progress-tile .card-header {
  transform: translateY(-8px);
  margin-bottom: -18px;
}

.chapter-progress-tile .divider {
  margin-top: 18px;
  margin-bottom: 18px;
}

.chapter-table {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}


.chapter-row {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e2e2e2;
}

.chapter-number {
  font-weight: 700;
}

.chapter-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e2e2e2;
  font-size: 14px;
  color: #034750; 
}

.chapter-number {
  font-weight: 700;
  color: #034750;
  min-width: 20px;
}

.chapter-title {
  flex: 1;
  color: #034750;
  line-height: 1.3;
}

.courses-right {
  margin-left: 30px; 
  max-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-card {
  background-color: #F2F1F2;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.side-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.side-title {
  font-size: 20px;
  font-weight: 700;
}

.divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 2px;
  margin-bottom: 8px;
}

.side-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.side-link {
  font-size: 16px;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px 16px;
  margin: 0 -20px;
  width: calc(100% + 7px);
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
  cursor: pointer;
  color: #034750;
}

.side-footer:hover {
  text-decoration: underline;
}

.back-link {
  margin-top: 12px;
  font-size: 14px;
  color: #034750;
}

.back-link:hover {
  text-decoration: underline;
}
</style>

