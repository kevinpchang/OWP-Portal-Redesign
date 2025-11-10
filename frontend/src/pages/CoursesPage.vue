<template>
  <div class="courses-page">

    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
        <p class="page-description"></p>
      </div>
    </div>

    <div class="courses-bottom">

      <!--Left-->
      <div class="courses-left">
        <div class="tiles-container">

          <!--Active-->
          <div class="course-card">
            <div class="card-header">
              <div class="header-icon"></div>
              <h2 class="card-title">Active Enrollments</h2>
            </div>

            <div class="card-body">
              <div v-for="course in activeCourses" :key="course.id" class="course-row">

                <div class="course-image"></div>

                <div class="course-info">
                  <router-link class="course-title" :to="`/courses/${course.id}`">
                    {{ course.title }}
                  </router-link>

                  <div class="info-subrow">
                    <div class="completion-label">Completion</div>
                    <div class="expires-text">Expires: {{ course.expires }}</div>
                  </div>

                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: course.progress }">
                      <span class="progress-text">{{ course.progress }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-action">
                  <button class="extend-button">Extend</button>
                </div>

              </div>
            </div>
          </div>


          <!--Completed-->
          <div class="course-card">
            <div class="card-header">
              <div class="header-icon completed-icon"></div>
              <h2 class="card-title">Completed Enrollments</h2>
            </div>

            <div class="card-body">
              <div v-for="course in completedCourses" :key="course.id" class="course-row">

                <div class="course-image completed-image"></div>

                <div class="course-info">
                  <router-link class="course-title" :to="`/completed/${course.id}`">
                    {{ course.title }}
                  </router-link>

                  <div class="info-subrow">
                    <div class="completion-label">Completed</div>
                    <div class="status-text" 
                        :class="course.status === 'Pass' ? 'status-pass' : 'status-fail'">
                      {{ course.status }}
                    </div>
                  </div>

                  <div class="progress-bar">
                    <div class="progress-fill"
                        :class="course.status === 'Pass' ? 'completed-fill' : 'failed-fill'"
                        style="width: 100%">
                      <span class="progress-text">100%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>


          <!--Recommended-->
          <div class="course-card">
            <div class="card-header">
              <div class="header-icon recommended-icon"></div>
              <h2 class="card-title">Recommended Courses</h2>
            </div>

            <div class="card-body">
              <div v-for="course in recommendedCourses" :key="course.id" class="course-row">

                <div class="course-image recommended-image"></div>

                <div class="course-info recommended-info">
                  <router-link class="course-title" :to="`/recommended/${course.id}`">
                    {{ course.title }}
                  </router-link>

                  <div class="rec-meta">{{ course.description }}</div>
                  <div class="rec-meta">{{ course.chapters }}</div>
                </div>

                <div class="card-action"></div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div class="courses-right">
        <!--Messages cards and stuff-->
        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon"></div>
            <div class="side-title">Messages</div>
          </div>

          <div class="side-body">
            <div class="side-link">Email message (4/11/2025)</div>
            <div class="side-link">Email message (4/07/2025)</div>
            <div class="side-link">Email message (4/03/2025)</div>
          </div>

          <div class="side-footer">(View all messages)</div>
        </div>

        <div class="side-card">
          <div class="side-header">
            <div class="header-icon side-icon"></div>
            <div class="side-title">Purchase History</div>
          </div>

          <div class="side-body">
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 1</div>
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 2</div>
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 3</div>
            <div class="side-link">Industrial Waste Treatment, Vol 1</div>
          </div>

          <div class="side-footer">(View all purchases)</div>
        </div>
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
} from "../data/coursesData";

export default defineComponent({
  name: "CoursesPage",
  data() {
    return {
      activeCourses,
      completedCourses,
      recommendedCourses,
    };
  },
});
</script>

<style scoped>



.courses-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}

.courses-bottom, .courses-top {
  max-width: 1000px;
  width: 100%;
  display: grid;
  justify-content: center;
  margin: 0 auto;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0 auto;
  display: flex;
  justify-content: flex-start;
}

.courses-bottom {
  grid-template-columns: 700px 300px;
  column-gap: 16px;
  margin-bottom: 48px;
}

.text-block {
  font-family: 'Myriad Pro', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.courses-header {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.page-description {
  font-size: 16px;
  color: #555;
  font-family: 'Myriad Pro', sans-serif;
}

.tiles-container {
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.course-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-title {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.card-body {
  font-family: 'Myriad Pro', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.course-title:hover {
  color: #034750;
  text-decoration:underline;
}

.course-row {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: -2px;
}

.course-description {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
}

.course-chapters {
  font-size: 14px;
  color: #7A7A7A;
  margin-top: 2px;
}

.course-image {
  width: 59px;
  height: 70px;
  background-color: #6DBE4B;
  border-radius: 4px;
}

.info-subrow {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #707070;
}

.extend-button {
  background-color: #00A5B5;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.progress-bar {
  background-color: #d9d9d9;
  border-radius: 4rem;
  height: 16px;
  width: 100%;
}

.progress-fill {
  background-color: #00A5B5;
  height: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.completed-fill {
  background-color: #6DBE4B;
}

.failed-fill {
  background-color: #7A7A7A;
}

.progress-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.status-text {
  font-weight: 700;
  font-size: 14px;
}

.status-pass {
  color: #6DBE4B;
}

.status-fail {
  color: #7A7A7A;
}

.course-title {
  font-size: 16px;
  color: #707070;
}

.recommended-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rec-meta {
  font-size: 14px;
  color: #707070;
  line-height: 1.3;
}

.courses-right {
  display: flex;
  flex-direction:column;
  gap: 16px;
}

.header-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Myriad Pro', sans-serif;
}

.side-card:hover {
  box-shadow: 0px 4px 14px rgba(0,0,0,0.18);
  transform: translateY(-3px);
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
}

.side-footer {
  text-align: center;
  font-size: 16px;
  color: #034750;
  cursor: pointer;
}

.side-icon {
  width: 26px;
  height: 34px;
  border-radius: 6px;
  background-color: #007C8A;
}

</style>
