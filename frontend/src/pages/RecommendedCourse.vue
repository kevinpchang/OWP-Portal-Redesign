<template>
  <div class="recommended-course-page">

    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <div class="page-container">
      <div class="summary-tile">
        <div class="card-header">
          <div class="header-icon side-icon"></div>
          <h2 class="card-title">Recommended Course</h2>
        </div>

        <div class="summary-body">

  <div class="summary-left">
    <div class="course-image-large recommended-image"></div>

    <div class="course-header-info">
      <h2 class="course-title">{{ courseTitle }}</h2>
      <p class="course-description-text">{{ courseDescription }}</p>
    </div>
  </div>

  
  <div class="summary-right">
    <p class="course-long-text">
      {{ courseLongDescription }}
    </p>
  </div>

</div>
      </div>
    </div>

    <div class="courses-bottom">

      <div class="courses-left">
        <div class="chapter-progress-tile">
          <div class="card-header">
            <div class="header-icon side-icon"></div>
            <h2 class="card-title">Course Contents</h2>
          </div>

          <div class="chapter-table">
            <div class="chapter-row" v-for="(chapter, index) in chapters" :key="index">
              <span class="chapter-number">{{ index + 1 }}</span>
              <span class="chapter-title">{{ chapter }}</span>
            </div>
          </div>
        </div>

        <router-link to="/courses" class="back-link">← Back to Courses</router-link>
      </div>

      <div class="courses-right">
        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon"></div>
            <div class="side-title">Messages</div>
          </div>
          <div class="side-body">
            <div class="side-link">Example Email Message (5/5/2025)</div>
            <div class="side-link">Example Email Message (5/03/2025)</div>
            <div class="side-link">Example Email Message (4/21/2025)</div>
          </div>
          <div class="side-footer">(View all messages)</div>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon"></div>
            <div class="side-title">Next Course</div>
          </div>
          <div class="side-body">
            <div class="side-link">See Course Catalog</div>
          </div>
          <div class="side-footer">(View all courses)</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { recommendedCourses } from "../data/coursesData";

export default defineComponent({
  name: "RecommendedCourse",
  setup() {
    const route = useRoute();
    const courseId = Number(route.params.id);

    const course = recommendedCourses.find(c => c.id === courseId);

    const courseTitle = course ? course.title : "Course Not Found";
    const courseDescription = course ? course.description : "Description unavailable.";
    const courseLongDescription = course ? course.longDescription : "";

    const chapters = course && course.chapters
  ? course.chapters
  : [
      "Introduction to Wastewater Treatment",
      "Effluent Discharge and Reuse",
      "Odor Control"
    ];

    return { courseTitle, courseDescription, chapters, courseLongDescription  };
  }
});
</script>

<style scoped>
.recommended-course-page {
  padding: 0px;
  background-color: #fff;
  font-family: 'Myriad Pro', sans-serif;
  color: #034750;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;
}

.courses-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.summary-tile {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  margin: 32px auto 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-icon,
.side-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.summary-body {
  display: flex;
  justify-content: flex-start;
  gap: 48px;
}

.summary-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.course-long-text {
  margin-top: 10px;
  font-size: 15px;
  color: #555;
  line-height: 1.45;
  max-width: 540px;
}

.course-details {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-width: 100%;
}



.course-image-large {
  width: 100px;
  height: 120px;
  background-color: #6DBE4B;
  border-radius: 4px;
}

.course-description-text {
  font-size: 16px;
  color: #555;
  line-height: 1.45;
  margin-top: 8px;
  max-width: 100%;
}

.course-title {
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 16px;
  color: #707070;
  line-height: 1.3;
  max-width: 260px;
  white-space: normal;
  overflow-wrap: break-word;
}

.course-description-text {
  font-size: 15px;
  color: #555;
  max-width: 320px;
  line-height: 1.4;
}

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto;
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 16px;
  align-items: flex-start;
}

.chapter-progress-tile {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
}

.chapter-table {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-row {
  display: flex;
  gap: 8px;
  font-size: 15px;
  color: #034750;
  padding-bottom: 6px;
  border-bottom: 1px solid #dcdcdc;
}

.chapter-number {
  font-weight: 700;
}

.courses-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 260px;
  margin-left: auto;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  width: 100%;
}

.side-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.side-title {
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.side-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}

.side-link {
  font-size: 16px;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  
}

.side-footer {
  text-align: center;
  font-size: 16px;
  color: #034750;
  cursor: pointer;
 
}

.back-link {
  margin-top: 10px;
  display: inline-block;
  font-size: 14px;
  color: #034750;
}

.back-link:hover {
  text-decoration: underline;
}
</style>

