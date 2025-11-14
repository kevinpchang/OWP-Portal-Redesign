<script setup>
import { ref, computed } from 'vue'

/* ----------------------------------
   TASK DATA WITH CHAPTER NUMBERS
-----------------------------------*/
const chapters = [
  { id: 1, chapter: "Ch-1", title: "Introduction to Wastewater Treatment", status: "completed", date: "11/1/2025" },
  { id: 2, chapter: "Ch-2", title: "Effluent Discharge and Reuse", status: "completed", date: "11/1/2025" },
  { id: 3, chapter: "Ch-3", title: "Odor Control", status: "overdue", overdueDays: 5 },
  { id: 4, chapter: "Ch-4", title: "Instrumentation and Control", status: "upcoming" },
  { id: 5, chapter: "Ch-5", title: "Introduction to Wastewater Utility Management", status: "upcoming" }
]

/* ------------------------------
   DYNAMIC PROGRESS CALCULATION
--------------------------------*/
const total = chapters.length
const completed = chapters.filter(c => c.status === "completed").length
const progressValue = computed(() => Math.round((completed / total) * 100))

/* ------------------------------
   PROGRESS RING VARIABLES
--------------------------------*/
const progressStroke = 10
const radius = 70
const circumference = 2 * Math.PI * radius

const progressOffset = computed(() => {
  return circumference - (progressValue.value / 100) * circumference
})
</script>

<template>
  <!-- OUTER WRAPPER (centers the whole page like My Account / Certificates) -->
  <div class="page-content">

    <!-- INNER WRAPPER (your existing tasks-page layout) -->
    <div class="tasks-page">

      <!-- PAGE HEADER -->
      <div class="header-section">
        <div class="title">Tasks Overview</div>
        <div class="subtitle">
          View your completed, upcoming, and overdue course tasks all in one place.
        </div>
      </div>

      <!-- TASK GRID -->
      <div class="task-grid">

        <!-- Completed Tasks -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot green"></div>
            <span>Completed Tasks</span>
          </div>
          <div class="divider"></div>

          <div class="body">
            <div
              v-for="chapter in chapters.filter(c => c.status === 'completed')"
              :key="chapter.id"
              class="task-item"
            >
              <div class="item-title">{{ chapter.chapter }} {{ chapter.title }}</div>
              <div class="sub">Completed on {{ chapter.date }}</div>
            </div>
          </div>
        </div>

        <!-- PROGRESS -->
        <div class="task-box progress-box">
          <div class="task-header">
            <div class="dot blue"></div>
            <span>Overall Progress</span>
          </div>
          <div class="divider"></div>

          <div class="circle-wrapper">
            <svg
              class="progress-ring"
              :width="radius * 2 + progressStroke * 2"
              :height="radius * 2 + progressStroke * 2"
            >
              <circle
                class="ring-bg"
                :stroke-width="progressStroke"
                :r="radius"
                :cx="radius + progressStroke"
                :cy="radius + progressStroke"
              />
              <circle
                class="ring-progress"
                :stroke-width="progressStroke"
                :r="radius"
                :cx="radius + progressStroke"
                :cy="radius + progressStroke"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
              />
            </svg>

            <div class="ring-text">{{ progressValue }}%</div>
          </div>
        </div>

        <!-- UPCOMING TASKS -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot yellow"></div>
            <div>Upcoming Tasks</div>
          </div>

          <div class="divider"></div>

          <div class="body">
            <div class="task-item">
              <div class="item-title">Ch-4 Instrumentation and Control</div>
              <div class="sub">Due on 11/20/2025</div>
            </div>

            <div class="task-item">
              <div class="item-title">Ch-5 Introduction to Wastewater Utility Management</div>
              <div class="sub">Due on 11/28/2025</div>
            </div>
          </div>
        </div>

        <!-- OVERDUE TASKS -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot red"></div>
            <span>Overdue Tasks</span>
          </div>
          <div class="divider"></div>

          <div class="body">
            <div
              v-for="chapter in chapters.filter(c => c.status === 'overdue')"
              :key="chapter.id"
              class="task-item"
            >
              <div class="item-title">{{ chapter.chapter }} {{ chapter.title }}</div>
              <div class="sub">{{ chapter.overdueDays }} days overdue</div>
            </div>
          </div>
        </div>

      </div> <!-- END GRID -->

    </div> <!-- END tasks-page -->

  </div> <!-- END page-content -->
</template>

<script>
export default {
  data() {
    return {
      chapters: [
        { id: 1, chapter: 'Ch-1', title: 'Introduction to Wastewater Treatment', status: 'completed', date: '11/1/2025' },
        { id: 2, chapter: 'Ch-2', title: 'Effluent Discharge and Reuse', status: 'completed', date: '11/1/2025' },
        { id: 3, chapter: 'Ch-3', title: 'Odor Control', status: 'overdue', overdueDays: 5 }
      ],
      progressValue: 40,
      radius: 80,
      progressStroke: 12
    };
  },
  computed: {
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    progressOffset() {
      return this.circumference - (this.progressValue / 100) * this.circumference;
    }
  }
};
</script>

<style scoped>
/* Reset box-sizing for consistency */
* {
  box-sizing: border-box;
}

/* MAIN WRAPPER - This centers everything */
.page-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
}

/* INNER WRAPPER */
.tasks-page {
  width: 100%;
  font-family: "Roboto", sans-serif;
  color: #034750;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header-section {
  margin-bottom: 30px;
}

.title {
  font-size: 42px;
  font-weight: 700;
  color: #034750;
}

.subtitle {
  font-size: 18px;
  margin-top: 6px;
  color: #747474;
}

/* GRID */
.task-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* CARD */
.task-box {
  background: #F2F1F2;
  border-radius: 14px;
  padding: 20px;
}

/* HEADER ROW */
.task-header {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.green { background: #5d9632; }
.blue { background: #00A5B5; }
.yellow { background: #FFD54F; }
.red { background: #E57373; }

/* FULL-WIDTH DIVIDER */
.divider {
  border-top: 2px solid white;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 10px;
  margin-bottom: 16px;
}

/* TASK ITEMS */
.body {
  overflow: hidden;
}

.body .task-item {
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 10px;
  transition: 0.2s ease;
}

.body .task-item:last-child {
  margin-bottom: 0;
}

.body .task-item:hover {
  background: #D9D9D9;
  cursor: pointer;
}

.task-item .item-title {
  font-size: 16px;
  font-weight: 600;
  color: #034750;
}

.task-item .sub {
  font-size: 14px;
  color: #707070;
  margin-top: 4px;
}

/* PROGRESS RING */
.progress-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.circle-wrapper {
  position: relative;
  width: 200px;   /* increased to give SVG breathing room */
  height: 200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring {
  transform: rotate(-90deg);
  display: block;
}

.ring-bg {
  fill: transparent;
  stroke: #dcdcdc;
}

.ring-progress {
  fill: transparent;
  stroke: #00A5B5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease-in-out;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* TRUE perfect center now */
  font-size: 32px;
  font-weight: 700;
  color: #00A5B5;
  pointer-events: none;
}


/* RESPONSIVE */
@media (max-width: 768px) {
  .task-grid {
    grid-template-columns: 1fr;
  }
  
  .page-content {
    padding: 20px 16px;
  }
  
  .title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}
</style>
