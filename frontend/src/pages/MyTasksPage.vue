<script setup>
import { ref, computed, onMounted } from "vue";
import { getActiveEnrollment, getCourseGrades } from "@/services/owpAPI.js";

/**
 * For now: Silicon Scribes PID (or use localStorage if you set it elsewhere)
 */
const pid = Number(localStorage.getItem("pid")) || 458860;

const loading = ref(false);
const error = ref("");
const chapters = ref([]);

/* ------------------------------
   PROGRESS RING VARIABLES
--------------------------------*/
const progressStroke = 10;
const radius = 70;
const circumference = 2 * Math.PI * radius;

const completedChapters = computed(() =>
  chapters.value.filter((c) => c.status === "completed")
);
const upcomingChapters = computed(() =>
  chapters.value.filter((c) => c.status === "upcoming")
);
const overdueChapters = computed(() =>
  chapters.value.filter((c) => c.status === "overdue")
);

const progressValue = computed(() => {
  const total = chapters.value.length;
  if (!total) return 0;
  return Math.round((completedChapters.value.length / total) * 100);
});

const progressOffset = computed(() => {
  return circumference - (progressValue.value / 100) * circumference;
});

/* ------------------------------
   HELPERS
--------------------------------*/
// IMPORTANT: do NOT use "attempted" to decide completion (it shows "1" a lot).
function isActuallyCompleted(item) {
  return item?.gradedate && item.gradedate !== "--" && String(item.gradedate).trim() !== "";
}

/* ------------------------------
   LOAD TASKS
--------------------------------*/
async function loadTasks() {
  loading.value = true;
  error.value = "";

  try {
    // 1) Active enrollments
    const enr = await getActiveEnrollment(pid);
    const enrollments = enr?.response ?? [];

    if (!enrollments.length) {
      chapters.value = [];
      return;
    }

    const active =
      enrollments.find((e) => String(e?.statustxt || "").toLowerCase().includes("enroll")) ??
      enrollments[0];

    const enrollId = active?.enrollid;
    if (!enrollId) {
      chapters.value = [];
      return;
    }

    // 2) Grades list (these become your tasks/chapters)
    const gradesRes = await getCourseGrades(enrollId);
    const gradeItems = gradesRes?.response ?? [];

    // Sort by ordinal so Ch-1..Ch-7..Final is stable
    const sorted = gradeItems
      .slice()
      .sort((a, b) => Number(a?.ordinal ?? 0) - Number(b?.ordinal ?? 0));

    const normalized = sorted.map((it, idx) => {
      const ord = Number(it?.ordinal ?? idx + 1);
      const title = it?.examname ?? `Chapter ${ord}`;
      const isFinal = String(it?.examtypeid) === "3";

      // Labels:
      // - regular chapters: "Ch-1", "Ch-2", ...
      // - final: "Final Exam" ONLY
      const chapterLabel = isFinal ? "Final Exam" : `Ch-${ord}`;

      // --- STATUS RULES (your requested layout) ---
      // Completed: Ch-1..Ch-5
      // Overdue: Ch-6
      // Upcoming: Ch-7 + Final Exam
      let status = "upcoming";

      if (!isFinal) {
        if (ord >= 1 && ord <= 5) status = "completed";
        else if (ord === 6) status = "overdue";
        else if (ord === 7) status = "upcoming";
        else status = "upcoming";
      } else {
        status = "upcoming";
      }

      // If the API says it is NOT actually completed (no gradedate),
      // we still keep your layout, but we won't show a completed date.
      const completedDate = isActuallyCompleted(it) ? it.gradedate : "";

      return {
        id: `exam-${it?.examid ?? ord}-${idx}`,
        ordinal: ord,
        chapter: chapterLabel,
        title,
        status,
        date: completedDate,
        overdueDays: status === "overdue" ? 5 : null, // placeholder; real overdue requires due dates API
      };
    });

    chapters.value = normalized;

    console.log("Tasks normalized:", normalized);
  } catch (e) {
    error.value = e?.message ?? String(e);
    chapters.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadTasks);
</script>

<template>
  <div class="page-content">
    <div class="tasks-page">
      <!-- HEADER -->
      <div class="header-section">
        <div class="title">Tasks Overview</div>
        <div class="subtitle">
          View your completed, upcoming, and overdue course tasks all in one place.
        </div>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="loading" class="status-text">Loading tasks…</div>
      <div v-else-if="error" class="error-text">
        {{ error }}
      </div>

      <!-- GRID -->
      <div class="task-grid" v-if="!loading && !error">
        <!-- Completed -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot green"></div>
            <span>Completed Tasks</span>
          </div>
          <div class="divider"></div>

          <div class="scroll-body">
            <div
              v-for="chapter in completedChapters"
              :key="chapter.id"
              class="task-item"
            >
              <div class="item-title">{{ chapter.chapter }} {{ chapter.title }}</div>
              <div class="sub" v-if="chapter.date">Completed on {{ chapter.date }}</div>
              <div class="sub" v-else>Completed</div>
            </div>

            <div v-if="completedChapters.length === 0" class="sub">
              No completed tasks yet.
            </div>
          </div>
        </div>

        <!-- Progress -->
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

        <!-- Upcoming -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot yellow"></div>
            <span>Upcoming Tasks</span>
          </div>

          <div class="divider"></div>

          <div class="scroll-body">
            <div
              v-for="chapter in upcomingChapters"
              :key="chapter.id"
              class="task-item"
            >
              <div class="item-title">
                <!-- If it's Final Exam, don't show extra title prefix -->
                <span v-if="chapter.chapter === 'Final Exam'">Final Exam</span>
                <span v-else>{{ chapter.chapter }} {{ chapter.title }}</span>
              </div>
              <div class="sub">Not started</div>
            </div>

            <div v-if="upcomingChapters.length === 0" class="sub">
              No upcoming tasks.
            </div>
          </div>
        </div>

        <!-- Overdue -->
        <div class="task-box">
          <div class="task-header">
            <div class="dot red"></div>
            <span>Overdue Tasks</span>
          </div>
          <div class="divider"></div>

          <div class="scroll-body">
            <div
              v-for="chapter in overdueChapters"
              :key="chapter.id"
              class="task-item"
            >
              <div class="item-title">{{ chapter.chapter }} {{ chapter.title }}</div>
              <div class="sub">
                {{ chapter.overdueDays ?? 0 }} days overdue
              </div>
            </div>

            <div v-if="overdueChapters.length === 0" class="sub">
              No overdue tasks.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.page-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 32px;
}

.tasks-page {
  width: 100%;
  font-family: "Roboto", sans-serif;
  color: #034750;
  display: flex;
  flex-direction: column;
}

.header-section { margin-bottom: 18px; }

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

.status-text { margin: 8px 0 14px; color: #707070; }
.error-text { margin: 8px 0 14px; color: #9F3323; white-space: pre-wrap; }

/* Grid: all 4 equal size */
.task-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.task-box {
  background: #F2F1F2;
  border-radius: 14px;
  padding: 20px;

  height: 320px;
  display: flex;
  flex-direction: column;
}

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

.divider {
  border-top: 2px solid white;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: 10px;
  margin-bottom: 12px;
}

.scroll-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
}

.scroll-body::-webkit-scrollbar { width: 8px; }
.scroll-body::-webkit-scrollbar-thumb {
  background: #CFCFCF;
  border-radius: 10px;
}
.scroll-body::-webkit-scrollbar-track { background: transparent; }

.task-item {
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 10px;
  transition: 0.2s ease;
}

.task-item:hover { background: #D9D9D9; cursor: pointer; }

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #034750;
}

.sub {
  font-size: 14px;
  color: #707070;
  margin-top: 4px;
}

/* Progress */
.progress-box { align-items: center; justify-content: center; }

.circle-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-ring { transform: rotate(-90deg); display: block; }

.ring-bg { fill: transparent; stroke: #dcdcdc; }
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
  transform: translate(-50%, -50%);
  font-size: 32px;
  font-weight: 700;
  color: #00A5B5;
  pointer-events: none;
}

@media (max-width: 768px) {
  .task-grid { grid-template-columns: 1fr; }
  .page-content { padding: 20px 16px; }
  .title { font-size: 32px; }
  .subtitle { font-size: 16px; }
  .task-box { height: auto; min-height: 300px; }
}
</style>