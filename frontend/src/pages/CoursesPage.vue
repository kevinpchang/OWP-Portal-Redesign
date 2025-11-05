<template>
  <div class="courses-page">
    <div class="header-container">
      <div class="courses-header">Courses</div>
      <p class="page-description"> </p>
    </div>

    <div class="tiles-container">

      <div class="course-tile">
        <div class="title-header-row">
          <div class="header-icon"></div>
          <h2 class="title-header">Active Enrollments</h2>
        </div>
        <ul>
          <li v-for="course in activeCourses" :key="course.id" class="course-item">
            <div class="course-row">
              <div class="course-image"></div>
              <div class="progress-container">
                <router-link class="course-title" :to="`/courses/${course.id}`"
                  >{{ course.title }}
                </router-link>
                <div class="completion-label">Completion</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: course.progress }">
                    <span class="progress-text">{{ course.progress }}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="course-tile">
          <div class="title-header-row">
            <div class="header-icon completed-icon"></div>
            <h2 class="tile-header">Completed Enrollments</h2>
          </div>
        <ul>
          <li v-for="course in completedCourses" :key="course.id" class="course-item">
            <div class="course-row">
              <div class="course-image completed-image"></div>
              <div class="progress-container">
                <div class="course-title">{{ course.title }}</div>
                <div class="completion-header">
                  <div class="completion-label">Completion</div>
                  <div
                    class="status-text"
                    :class="course.status === 'Pass' ? 'status-pass' : 'status-fail'"
                  >
                    {{ course.status }}
                  </div>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :class="course.status === 'Pass' ? 'completed-fill' : 'failed-fill'"
                    style="width: 100%"
                  >
                    <span class="progress-text">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

      </div>

      <div class="course-tile">
        <div class="title-header-row">
          <div class="header-icon recommended-icon"></div>
          <h2 class="tile-header">Recommended Courses</h2>
        </div>
        <ul>
          <li v-for="course in recommendedCourses" :key="course.id" class="course-item">
            <div class="course-row">
              <div class="course-image recommended-image"></div>
              <div class="recommended-info">
                <div class="course-title">{{ course.title }}</div>
                <div class="course-description">{{ course.description }}</div>
                <div class="course-chapters">{{ course.chapters }}</div>
              </div>
            </div>
          </li>
        </ul>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  activeCourses,
  completedCourses,
  recommendedCourses,
  ActiveCourse,
  CompletedCourse,
  RecommendedCourse
} from "../data/coursesData";

export default defineComponent({
  name: "CoursesPage",
  data() {
    return {
    activeCourses,
    completedCourses,
    recommendedCourses
  };
  }
});

</script>

<style scoped>
.course-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: space-between;
}

.course-image {
  width: 59.22px;
  height: 70.73px;
  background-color: #6DBE4B;
  border-radius: 4px;
  flex-shrink: 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  flex: 1;
  width: 100%;
}

.recommended-container {
  justify-content: flex-start;
  gap: 4px;
}

.courses-page {
  position: relative;
  height: 100%;
  background-color: #fff;
}

.recommended-icon {
  background-color: #034750
}

.completed-icon {
  background-color: #6DBE4B;
}

.header-container {
  position: relative;
  left: 18px;
  top: 38px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.courses-header {
  font-family: 'Myriad Pro, Bold', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #034750;
}

.title-header-row {
  display: flex;
  align-items: center;
  color: #034750;
  gap: 8px;
  margin-bottom: 8px;
}

.header-icon {
  width: 32.21px;
  height: 33.67px;
  background-color: #034750;
  border-radius: 4px;
  flex-shrink: 0;
}

.page-description {
  font-size: 16px;
  color: #555;
  font-family: 'Myriad Pro', sans-serif;
  margin: 0;
}

.tiles-container {
  margin-top: 46px;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 700px;
}

.course-tile {
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 16px;
  color: #707070;
  margin-bottom: 8px;
  align-self: flex-start;
  width: 100%;
  padding-right: 18px;
  cursor: pointer;
}

.course-title:hover {
  color: #034750;
  text-decoration: underline;
}

.completion-label {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  color: #707070;
  margin-bottom: 0px;
  margin-left: -8px;
}

.tile-header {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 22px;
  font-weight: 650;
  color: #034750;
  display: inline-block;
}

.course-item {
  list-style: none;
  margin-bottom: 20px;
  margin-left: -40px;
  width: 100%;
}

.course-title {
  font-size: 16px;
  color: #707070;
  margin-bottom: 12px;
  margin-left: -8px;
  text-align: left;
}

.progress-bar {
  background-color: #d9d9d9;
  border-radius: 4rem;
  height: 16px;
  width: 100%;
  position: relative;
  margin-left: -10px;
}


.progress-fill {
  background-color: #00A5B5;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.completion-header {
  position: relative;
  width: 100%;
  margin-bottom: 4px;
}
.status-text {
  position: absolute;
  right: 0;
  bottom: -15px; 
  transform: translateY(-90%);
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-right: 20px;
}

.status-pass {
  color: #7A7A7A;
}

.status-fail {
  color: #7A7A7A; 
}


.completed-image {
  background-color: #6DBE4B;
}

.completed-fill {
  background-color:#6DBE4B;
}

.completion-label {
  color: #707070;
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
}

.progress-text {
   font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  color: white;
  font-weight: 600;
}

.failed-fill {
  background-color: #7A7A7A;
}

.recommended-image {
  background-color: #6DBE4B;
}


.recommended-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start; 
  gap: 2px;
  width: 100%;
  padding-top: 4px;
}

.course-description {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  color: #555;
  margin-top: 2px;
}

.course-chapters {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 13px;
  color: #7A7A7A;
  margin-top: 0;
}
</style>