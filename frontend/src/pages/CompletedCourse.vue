<template>
  <div class="completed-course-page">

    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <div class="page-container">
      <div class="summary-tile">
        <div class="card-header">
          <div class="header-icon completed-icon"></div>
          <h2 class="card-title">Completed Enrollments</h2>
        </div>

        <div class="summary-body">
          <div class="summary-left">
            <div class="course-image-large completed-image"></div>

            <div class="course-header-info">
              <h2 class="course-title">{{ courseTitle }}</h2>
              <p class="course-expiration">Completed: {{ courseCompletedDate }}</p>
              <p class="course-grade">Final Grade: {{ courseGrade }}</p>
            </div>

            <div class="course-metrics">
              <div class="metric">
                <div class="metric-value">5</div>
                <div class="metric-label">Total Chapters</div>
              </div>
              <div class="metric">
                <div class="metric-value">{{ courseGrade }}</div>
                <div class="metric-label">Grade</div>
              </div>
              <div class="metric">
                <div class="metric-value">1.0</div>
                <div class="metric-label">CEUs</div>
              </div>
              <div class="metric">
                <div class="metric-value">10</div>
                <div class="metric-label">Contact Hours</div>
              </div>
            </div>
          </div>

          <div class="course-progress">
            <div class="donut">
              <div
                class="donut-fill"
                :style="{
                  background:
                    'conic-gradient(#6DBE4B ' + animatedAngle + 'deg, #7A7A7A 0deg)'
                }"
              ></div>
              <div class="donut-inner">100%</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="courses-bottom">

      <div class="courses-left">
        <div class="chapter-progress-tile">
          <div class="card-header">
            <div class="header-icon completed-icon"></div>
            <h2 class="card-title">Chapter Progress</h2>
          </div>

          <div class="chapter-table">
            <div class="chapter-table-header">
              <div class="chapter-col">Chapter</div>
              <div class="date-col">Date</div>
              <div class="grade-col">Grade</div>
            </div>

            <div
              class="chapter-row"
              v-for="(chapter, index) in chapters"
              :key="index"
            >
              <div class="chapter-col">
                <span class="chapter-number">{{ index + 1 }}</span>
                <span class="chapter-title">{{ chapter.title }}</span>
              </div>

              <div class="date-col">{{ chapter.date }}</div>
              <div class="grade-col">{{ chapter.grade }}</div>
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
            <div class="side-link">Operation of Wastewater Treatment Plants, Vol 3</div>
          </div>
          <div class="side-footer">(View all courses)</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { completedCourses } from "../data/coursesData";

export default defineComponent({
  name: "CompletedCourse",
  setup() {
    const route = useRoute();
    const courseId = Number(route.params.id);

    const course = completedCourses.find(c => c.id === courseId);

    const courseTitle = course ? course.title : "Course Not Found";
    const courseCompletedDate = course ? course.completed : "--";
    const courseGrade = course ? (course.status === "Pass" ? "A" : course.status) : "--";

    const chapters = [
      { title: "Introduction to Wastewater Treatment", date: "Aug 20, 2025", grade: "83% (34.0/40)" },
      { title: "Safety", date: "Aug 20, 2025", grade: "100% (25.0/25.0)" },
      { title: "Preliminary Treatment", date: "Aug 20, 2025", grade: "100% (40.0/40.0)" },
      { title: "Primary Treatment", date: "Aug 20, 2025", grade: "100% (40.0/40.0)" },
      { title: "Lagoon Systems (Secondary Treatment)", date: "Sep 3, 2025", grade: "94% (42.2/45)" }
    ];

    const animatedAngle = ref(0);
    onMounted(() => {
      const target = 360;
      const step = 6;
      const interval = setInterval(() => {
        animatedAngle.value += step;
        if (animatedAngle.value >= target) clearInterval(interval);
      }, 10);
    });

    return { courseTitle, courseCompletedDate, courseGrade, chapters, animatedAngle };
  }
});
</script>

<style scoped>
.completed-course-page {
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
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.completed-icon {
  background-color: #007C8A;
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

.course-image-large {
  width: 100px;
  height: 120px;
  background-color: #6DBE4B;
  border-radius: 4px;
}

.course-header-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 120px;
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

.course-metrics {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: 24px;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #00A5B5;
}

.course-progress {
  display: flex;
  align-items: flex-start;
  margin-top: -30px;
}

.donut {
  position: relative;
  width: 105px;
  height: 105px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.donut-fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(#6DBE4B 0deg, #7A7A7A 0deg);
}

.donut-inner {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background-color: #F2F1F2; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #034750;
  text-align: center;
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

.chapter-progress-tile,
.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
}

.side-card { width: 100%; }
.courses-right { display: flex; flex-direction: column; gap: 16px; margin-left: auto; max-width: 260px; }

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-label {
  font-size: 14px;
  color: #707070;
}

/* Chapter Table Rows */
.chapter-table {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chapter-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 6px;
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 15px;
  color: #034750;
  letter-spacing: 0.2px;
}

.chapter-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e2e2;
  font-size: 14px;
  color: #034750;
}

.chapter-col {
  flex: 1.4;
  display: flex;
  gap: 8px;
}

.date-col,
.grade-col {
  flex: 0.9;
  text-align: right;
}

.chapter-number {
  font-weight: 700;
  color: #034750;
}

.side-header {
  display: flex;
  align-items: center;
  gap: 8px; 
  flex-direction: row; 
  margin-bottom: 8px;
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
  margin-top: 12px;
  display: inline-block;
  font-size: 14px;
  color: #034750;
}
.back-link:hover {
  text-decoration: underline;
}
</style>
