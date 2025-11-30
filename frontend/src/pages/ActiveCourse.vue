<template>
  <div class="active-course-page">

    <!-- Header -->
    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <!-- Summary -->
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
          <h2 class="card-title">Active Enrollments</h2>
        </div>

        <div class="divider"></div>

        <div class="summary-body">
          <div class="summary-left">
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
                    'conic-gradient(#00A5B5 ' + animatedAngle + 'deg, #7A7A7A 0deg)'
                }"
              ></div>
              <div class="donut-inner">{{ animatedProgress }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="courses-bottom">
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
            <h2 class="card-title">Chapter Progress</h2>
          </div>
<div class="divider"></div>
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
                <a v-else class="exam-link">Start online exam</a>
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

      <div class="courses-right">
  <!-- Messages -->
  <div class="side-card">
    <div class="side-header">
      <div class="side-icon">
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { activeCourses } from "../data/coursesData.js";

export default {
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
};
</script>

<style scoped>
.active-course-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  color: #034750;
}

.courses-top {
  max-width: 1000px;
  width: 100%;
  margin:  auto;
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;
}

.courses-header {
  font-size: 32px;
  font-weight: 700;
  color: #034750;
}

.page-container,
.courses-bottom {
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
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

.card-header,
.side-header {
  display: flex;
  align-items: center;
  gap: 8px; 
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
  padding: 0;
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
  font-family: 'Roboto Semibold', sans-serif;
}

.summary-tile .card-header {
  transform: translateY(-4px); 
  margin-bottom: 4px; 
}

.summary-tile .divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: -15px;  
  margin-bottom: 14px;
}

.summary-body {
  display: flex;
  align-items: flex-start; 
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

.course-header-info h2,
.course-header-info p {
  margin: 0;         
  line-height: 1.1;    
}

.course-title {
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 16px;
  color: #707070;
  margin: 0;
  line-height: 1.3;
  max-width: 260px;   
  white-space: normal;
  overflow-wrap: break-word;
}

.course-expiration,
.course-completed {
  font-size: 14px;
  color: #555;
}

.extend-button {
  background-color: #00A5B5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 14px;         
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 14px;
  cursor: pointer;
  width: fit-content;          
  display: inline-block;
  margin-top: 6px;
  transition: background-color 0.2s ease;
}

.extend-button:hover {
  background-color: #00909e;
}

.course-metrics {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: 24px;
  transform: translateY(10px);
}

.course-progress {
  display: flex;
  align-items: center; 
  margin-top: -10px;   
  margin-left: 8px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #00A5B5;
}

.metric-label {
  font-size: 14px;
  color: #707070;
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
  background: conic-gradient(#00A5B5 0deg, #7A7A7A 0deg);
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
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 18px;
  color: #555;
}

.courses-bottom {
  max-width: 1000px;
  width: 100%;
  margin: 32px auto;
  display: grid;
  grid-template-columns: 1.6fr 0.8fr; 
  gap: 8px;
  align-items: flex-start;
}

.chapter-progress-tile {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;  
}

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
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 15px;         
  color: #034750;           
  letter-spacing: 0.2px;    
}

.chapter-progress-tile .card-header {
  transform: translateY(-4px); 
  margin-bottom: -18px;      
}

.chapter-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e2e2;
  color: #034750; 
  font-size: 14px;
}


.chapter-col {
  flex: 1.4;
  display: flex;
  gap: 8px;
}

.date-col {
  flex: 0.9;
  text-align: right;
}

.grade-col {
  flex: 0.9;
  text-align: right;
}

.chapter-number {
  font-weight: 700;
  color: #034750;
}

.exam-link {
  text-decoration: underline;
  cursor: pointer;
  color: #034750;
}
.exam-link:hover {
  color: #00A5B5;
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

.courses-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 260px;   
  margin-left: auto; 
}

.divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 2px;
  margin-bottom: 8px;
}

.side-card {
  background-color: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Roboto', sans-serif;
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
</style>


