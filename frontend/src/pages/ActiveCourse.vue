<template>
  <div class="active-course-page">

    <div class="header-container">
      <div class="courses-header">Courses</div>
    </div>


    <div class="course-tile">
      <div class="title-header-row">
        <div class="header-icon"></div>
        <h2 class="tile-header">Active Enrollments</h2>
      </div>

      <div class="course-header-tile">

        <div class="course-header-left">
          <div class="course-image-large"></div>

          <div class="course-header-info">
            <h2 class="course-title">{{ courseTitle }}</h2>
            <p class="course-expiration">Expires: {{ courseExpiration }}</p>
            <p class="course-completed">Completed: {{ courseCompleted }}</p>
            <button class="extend-button">Extend</button>
          </div>

          <div class="course-metrics">
            <div class="metric">
              <div class="metric-value">5</div>
              <div class="metric-label">Total Chapters</div>
            </div>
            <div class="metric">
              <div class="metric-value">B</div>
              <div class="metric-label">Grade Average</div>
            </div>
            <div class="metric">
              <div class="metric-value">--</div>
              <div class="metric-label">CEUs</div>
            </div>
            <div class="metric">
              <div class="metric-value">--</div>
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
                  'conic-gradient(#00A5B5 ' +
                  animatedAngle +
                  'deg, #7A7A7A 0deg)'
              }"
            ></div>
            <div class="donut-inner">{{ animatedProgress }}%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="chapter-progress-tile">
    <div class="title-header-row">
        <div class="header-icon"></div>
        <h2 class="tile-header">Chapter Progress</h2>
    </div>

    <div class="chapter-table">
        <div class="chapter-table-header">
        <div class="chapter-col">Chapter</div>
        <div class="date-col">Date</div>
        <div class="grade-col">Grade</div>
        </div>

        <div class="chapter-row" v-for="(chapter, index) in chapters" :key="index">
        <div class="chapter-col">
            <span class="chapter-number">{{ index + 1 }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
        </div>

        <div class="date-col">
            <span v-if="chapter.date">{{ chapter.date }}</span>
            <a v-else href="#" class="exam-link">Start online exam</a>
        </div>

        <div class="grade-col">
            <span v-if="chapter.grade">{{ chapter.grade }}</span>
            <span v-else>—</span>
        </div>
        </div>
    </div>
    </div>

    <router-link to="/courses" class="back-link">← Back to Courses</router-link>

  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { activeCourses } from "../data/coursesData";

export default defineComponent({
  name: "ActiveCourse",
  setup() {
    const route = useRoute();
    const courseId = Number(route.params.id);

    const course = activeCourses.find(c => c.id === courseId);

    const courseTitle = course ? course.title : "Course Not Found";
    const courseExpiration = "10/11/2025";
    const courseCompleted = "--";


    const progressValue = course ? parseInt(course.progress) : 0;
    const animatedAngle = ref(0);
    const animatedProgress = ref(0); 

    const chapters = [
        { title: "Introduction to Wastewater Treatment", date: "Sep 24, 2025", grade: "3% (1.0/40)" },
        { title: "Effluent Discharge and Reuse", date: "Sep 24, 2025", grade: "3% (1.0/40)" },
        { title: "Odor Control", date: "Sep 24, 2025", grade: "3% (1.0/40)" },
        { title: "Instrumentation and Control" },
        { title: "Introduction to Wastewater Utility Management" } 
    ];

    onMounted(() => {
      const targetAngle = (progressValue / 100) * 360;
      const duration = 1000; 
      const frameRate = 60; 
      const steps = duration / (1000 / frameRate);
      const angleStep = targetAngle / steps;
      const progressStep = progressValue / steps;

      let currentAngle = 0;
      let currentProgress = 0;

      const interval = setInterval(() => {
        currentAngle += angleStep;
        currentProgress += progressStep;

        if (currentAngle >= targetAngle) {
          currentAngle = targetAngle;
          currentProgress = progressValue;
          clearInterval(interval);
        }

        animatedAngle.value = currentAngle;
        animatedProgress.value = Math.round(currentProgress);
      }, 1000 / frameRate);
    });

    return {
      courseTitle,
      courseExpiration,
      courseCompleted,
      animatedAngle,
      animatedProgress,
      chapters
    };
  },
});
</script>

<style scoped>
.active-course-page {
  padding: 24px;
  background-color: #fff;
  font-family: 'Myriad Pro', sans-serif;
  color: #034750;
}

.header-container {
  margin-bottom: 24px;
}

.courses-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.course-tile {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title-header-row {
  display: flex;
  align-items: center;
  color: #034750;
  gap: 8px;
  margin-bottom: 4px;
}

.header-icon {
  width: 32px;
  height: 33px;
  background-color: #034750;
  border-radius: 4px;
  flex-shrink: 0;
}

.tile-header {
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 22px;
  color: #034750;
}

.course-header-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 1016px;
  height: 120px;
  background-color: #f6f6f6;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.course-header-left {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.course-image-large {
  width: 100px;
  height: 120px;
  background-color: #6DBE4B;
  border-radius: 4px;
  flex-shrink: 0;
}

.course-header-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
}

.course-title {
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 16px;
  color: #707070;
  margin: 0;
  line-height: 1.3;
  width: 250px;
  word-wrap: break-word;
}

.course-expiration,
.course-completed {
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  color: #555;
  margin: 0;
}

.extend-button {
  align-self: flex-start;
  background-color: #00A5B5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 14px;
  cursor: pointer;
  margin-top: 6px;
  transition: background-color 0.2s ease;
}

.extend-button:hover {
  background-color: #00909e;
}

.course-metrics {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    margin-left: 60px;
    max-width: 90px;
}

.metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: 100px;
}

.metric-value {
    font-size: 56px;
    font-weight: 700;
    color: #00A5B5;
    line-height: 1.5;
    margin-bottom: 6px;
    font-family: 'Myriad Pro Semibold', sans-serif;
}

.metric-label {
    font-size: 14px;
    color: #707070;
    font-family: 'Myriad Pro', sans-serif;
}

.course-progress {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

.donut {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.donut-fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(#00A5B5 0deg, #7A7A7A 0deg);
  transition: background 0.1s linear;
}

.donut-inner {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 16px;
  color: #555;
}

.back-link {
  color: #034750;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.chapter-progress-tile {
  width: 700px;
  height: 445px;
  background-color: #f6f6f6;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-self: flex-start; 
  margin-left: 0;
  margin-left: -24px;
}

.chapter-table {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chapter-table-header {
  display: flex;
  justify-content: space-between;
  font-family: 'Myriad Pro Semibold', sans-serif;
  font-size: 15px;
  color: #034750;
  border-bottom: 1px solid #dcdcdc;
  padding-bottom: 4px;
}

.chapter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-family: 'Myriad Pro', sans-serif;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #e2e2e2;
}

.chapter-col {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 60%;
}

.date-col {
  width: 20%;
  text-align: right;
}

.grade-col {
  width: 20%;
  text-align: right;
}

.chapter-number {
  font-weight: 700;
  color: #034750;
  min-width: 12px;
}

.chapter-title {
  color: #034750;
}

.exam-link {
  color: #034750;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.exam-link:hover {
  color: #00A5B5;
}


</style>

