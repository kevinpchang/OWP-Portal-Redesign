<template>
  <div class="courses-page">

   <div class="page-top">
  <div class="text-block">
    <h1 class="page-title">Courses</h1>
    <p class="page-description">
      View your active, completed, and recommended courses
    </p>
  </div>
</div>

    <div class="courses-bottom">

      <!--Left-->
      <div class="courses-left">
        <div class="tiles-container">

          <!--Active-->
          <div class="course-card active-card">
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
              <h2 class="card-title">Active Enrollments</h2>
            </div>
            <div class="card-divider"></div>

            <div class="card-body">
              <router-link
                v-for="course in activeCourses"
                :key="course.id"
                :to="`/courses/${course.id}`"
                class="course-row-link"
              >
              <div class="course-row">
                  <div class="course-image"></div>

                  <div class="course-info">
                      <div class="course-title">{{ course.title }}</div>

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
              </router-link>
            </div>
          </div>


          <!--Completed-->
          <div class="course-card">
            <div class="card-header">
              <div class="header-icon completed-icon">
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
              <h2 class="card-title">Completed Enrollments</h2>
            </div>
            <div class="card-divider"></div>

            <div class="card-body">
              <router-link
                v-for="course in completedCourses"
                :key="course.id"
                :to="`/completed/${course.id}`"
                class="course-row-link"
              >
                <div class="course-row">
                  <div class="course-image completed-image"></div>

                  <div class="course-info">
                    <div class="course-title">{{ course.title }}</div>

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
              </router-link>
            </div>
          </div>


          <!--Recommended-->
          <div class="course-card">
            <div class="card-header">
              <div class="header-icon recommended-icon">
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
              <h2 class="card-title">Recommended Courses</h2>
            </div>
            <div class="card-divider"></div>

            <div class="card-body">
              <router-link
                v-for="course in recommendedCourses"
                :key="course.id"
                :to="`/recommended/${course.id}`"
                class="course-row-link"
              >
                <div class="course-row">
                  <div class="course-image recommended-image"></div>

                  <div class="course-info recommended-info">
                    <div class="course-title">{{ course.title }}</div>
                    <div class="rec-meta">{{ course.description }}</div>
                    <div class="rec-meta">{{ course.chapterCount }} Chapters</div>
                  </div>

                  <div class="card-action"></div>
                </div>
              </router-link>
            </div>
          </div>


        </div>
      </div>

      <div class="courses-right">
        <!--Messages-->
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
            <div class="side-link">Email message (4/11/2025)</div>
            <div class="side-link">Email message (4/07/2025)</div>
            <div class="side-link">Email message (4/03/2025)</div>
          </div>

          <div class="side-footer">(View all messages)</div>
        </div>

        <!-- Purchase History-->
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
import {
  activeCourses,
  completedCourses,
  recommendedCourses,
} from "../data/coursesData.js";

export default {
  name: "CoursesPage",
  data() {
    return {
      activeCourses,
      completedCourses,
      recommendedCourses,
    };
  },
};
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
  margin: 0 auto;
}

.page-top {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}


.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 46px auto 48px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16px;
}

.text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.courses-header {
  font-family: 'Roboto', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.page-description {
  font-size: 16px;
  color: #555;
  margin: 8px 0 0;
  font-family: 'Roboto', sans-serif;
}

.tiles-container {
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.course-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 6px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-row-link{
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}

.course-row {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  gap: 4px;
  border-radius: 0px; 
  padding: 8px 12px;
  margin: 0 -20px;
  width: calc(100% + 17px);
  transition: background-color 0.2s ease;
}

.course-row:hover {
  background-color: #D9D9D9;
  cursor: pointer;
}

.course-info .course-title {
  text-decoration: underline;
  color: #707070;
}

/* Uncomment if we use underline display
.course-title:hover {
  text-decoration: underline;
  color: #034750;
}
  */

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
  padding-top: 4px;
}

.divider, .card-divider {
  border-top: 1px solid #FFFFFF;
}

.card-divider {
  width: 150%;
  margin-left: -50px;
}

.divider {
  width: calc(100% + 40px);
  margin-left: -20px;
}

.card-title {
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #034750;
}

.card-body {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: -2px;
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

.extend-button:hover {
  background-color: #008c9a;
  transition: background-color 0.2s ease;
}

.active-card .progress-bar {
  background-color: #7A7A7A;
  border-radius: 4rem;
  height: 16px;
  width: calc(100% + 77px);
  margin-right: -30px;
}

.progress-bar {
  background-color: #7A7A7A;
  border-radius: 8px;
  height: 16px;
  width: 100%;
  overflow: hidden;
}

.progress-fill {
  background-color: #00A5B5;
  height: 100%;
  border-radius: 0; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.course-card:not(.active-card) .progress-bar,
.course-card:not(.active-card) .progress-fill {
  border-radius: 0;
}


.completed-fill {
  background-color: #6DBE4B;
}

.failed-fill {
  background-color: #707070;
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

.expires-text {
  margin-right: 10px;
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
  line-height: 2;
}

.rec-meta + .rec-meta {
  margin-top: -4px;
}

.courses-right {
  display: flex;
  flex-direction:column;
  gap: 16px;
}

.header-icon-svg {
  width: 30px;
  height: 30px;
  stroke: #007C8A;
  flex-shrink: 0;
}

.side-icon {
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  padding: 0;
}

.side-icon svg {
  width: 28px;
  height: 28px;
  stroke: #007C8A;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Roboto', sans-serif;
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
  width: calc(100% + 7px);
  transition: background-color 0.2s ease;
}

.side-link:hover {
  background-color: #D9D9D9;
  color: #007c8a; 
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
  transition: color 0.2s ease;
}

.side-footer:hover {
  text-decoration: underline;
  color: #007C8A;
}

.messages .body .object,
.purchase-history .body .object {
  padding: 8px 12px;
  margin: 0 -20px;
  width: calc(100% + 40px);
  transition: background-color 0.2s ease;
}

.messages .body .object:hover,
.purchase-history .body .object:hover {
  background-color: #D9D9D9;
  cursor: pointer;
}

</style>
