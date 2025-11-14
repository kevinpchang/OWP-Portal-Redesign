<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref(formatDate())

// Helper function to format date based on user's local settings
function formatDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}


let timer
onMounted(() => {
  scheduleNextUpdate()
})
onUnmounted(() => {
  clearTimeout(timer)
})

// Schedule a timer to update exactly at midnight
function scheduleNextUpdate() {
  const now = new Date()
  const nextMidnight = new Date(now)
  nextMidnight.setHours(24, 0, 0, 0)
  const timeUntilMidnight = nextMidnight - now

  timer = setTimeout(() => {
    currentDate.value = formatDate()
    scheduleNextUpdate() // reschedule for next day
  }, timeUntilMidnight)
}
</script>

<template>
  <div class="mytasks-page">
    <div class="top-section">
      <div class="text">
        <div class="date">{{ currentDate }}</div>
        <div class="welcome">Your Task Overview</div>
        <div class="description">
          View your completed, upcoming, and overdue course tasks all in one place.
        </div>
      </div>
      <div class="image">
        <img src="../assets/owpart.png" />
      </div>
    </div>

    <div class="bottom-section">
      <!-- Completed Section -->
      <div class="task-box completed">
        <div class="header">
          <div class="icon green"></div>
          <div class="text">Completed Tasks</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="task">
            <div class="title">Ch-1 Introduction to Waste Water Treatment</div>
            <div class="sub">Completed on 11/1/2025</div>
          </div>
          <div class="task">
            <div class="title">Ch-2 Effluent Discharge and Reuse</div>
            <div class="sub">Completed on 11/1/2025</div>
          </div>
        </div>
      </div>

      <!-- Progress Tracker -->
      <div class="task-box progress">
        <div class="header">
          <div class="icon blue"></div>
          <div class="text">Overall Progress</div>
        </div>
        <div class="divider"></div>
        <div class="circle">
          <div class="inner">60%</div>
        </div>
      </div>

      <!-- Upcoming Section -->
      <div class="task-box upcoming">
        <div class="header">
          <div class="icon yellow"></div>
          <div class="text">Upcoming Tasks</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="task">
            <div class="title">Ch-4 Instrumentation and Control</div>
          </div>
          <div class="task">
            <div class="title">Ch-5 Wastewater Utility Management</div>
          </div>
        </div>
      </div>

      <!-- Overdue Section -->
      <div class="task-box overdue">
        <div class="header">
          <div class="icon red"></div>
          <div class="text">Overdue Tasks</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="task">
            <div class="title">Ch-3 Odor Control</div>
            <div class="sub">5 days overdue</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mytasks-page {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 32px;
  justify-content: center;
  align-items: start;
  color: #034750;
  font-family: Myriad Pro, sans-serif;
}

.top-section {
  display: grid;
  grid-template-columns: 500px 500px;
  margin-top: 32px;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.date {
  font-size: 20px;
  font-weight: 600;
  color: #707070;
  margin-bottom: 16px;
}

.welcome {
  font-size: 48px;
  font-weight: 700;
  color: #00A5B5;
}

.description {
  width: 400px;
  font-size: 18px;
  color: #747474;
  margin-top: 10px;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  object-position: center;
}

.bottom-section {
  display: grid;
  grid-template-columns: repeat(2, 500px);
  gap: 24px;
  margin-bottom: 48px;
}

.task-box {
  background-color: #F2F1F2;
  border-radius: 1rem;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.task-box .header {
  display: flex;
  align-items: center;
}

.icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.icon.green { background-color: #5d9632; }
.icon.blue { background-color: #00A5B5; }
.icon.yellow { background-color: #FFD54F; }
.icon.red { background-color: #E57373; }

.header .text {
  font-size: 20px;
  font-weight: 700;
  margin-left: 8px;
}

.divider {
  border-top: 1px solid #ccc;
  margin: 10px 0;
}

.body .task {
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.sub {
  font-size: 14px;
  color: #707070;
}

.circle {
  width: 160px;
  height: 160px;
  margin: 40px auto;
  border-radius: 50%;
  border: 12px solid #00A5B5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #00A5B5;
}
</style>
