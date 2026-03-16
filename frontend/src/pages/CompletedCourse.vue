<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getEnrollmentRecord,
  getCourseGrades,
  getInvoices,
  getInvoiceData,
} from "@/services/owpAPI.js";

import book from '@/assets/icons/owp-2color/book-icon.svg'
import history from '@/assets/icons/owp-2color/history-icon.svg'
import mail from '@/assets/icons/owp-2color/mail-icon.svg'

// course images
import MBR2nd from "@/assets/manual-imgs/MBR-2nd-cvr.png";
import owtp1st8th from "@/assets/manual-imgs/owtp-1-8th-cvr.jpg";
import owtp2nd8th from "@/assets/manual-imgs/owtp-2-8th-cvr.jpg";
import owtp3rd8th from "@/assets/manual-imgs/owtp-3-8th-cvr.jpg";
import um3rd from "@/assets/manual-imgs/um-3rd-cvr.jpg";
import wtpo1st7th from "@/assets/manual-imgs/wtpo-1-7th-cvr.jpg";
import wtpo2nd7th from "@/assets/manual-imgs/wtpo-2-7th-cvr.jpg";

// course image map
const courseImageMap = {
  UM: um3rd,
  WTPO1: wtpo1st7th,
  WTPO2: wtpo2nd7th,
  OWTP1: owtp1st8th,
  OWTP2: owtp2nd8th,
  OWTP3: owtp3rd8th,
  MBR: MBR2nd,
};

const courseImage = ref(null);

const route = useRoute();

const enrollId = String(
  route.params.id ??
  route.params.enrollId ??
  route.params.enrollmentId ??
  ""
);

// main page state
const loadingCourse = ref(true);
const loadError = ref("");

// headers
const courseTitle = ref("Course title unavailable");
const courseCompletedDate = ref("—");
const courseGrade = ref("—");

// metrics
const totalChapters = ref("—");
const gradeAverage = ref("—");
const ceus = ref("—");
const contactHours = ref("—");

// donut
const animatedAngle = ref(0);
const animatedProgress = ref(0);

// chapter table
const chapters = ref([]);

// right side
const messages = ref([]);
const loadingMessages = ref(true);
const messagesError = ref("");

const pid = ref(458860);
const invoices = ref([]);
const invoicedata = ref({});
const loadingSidebar = ref(true);
const sidebarError = ref("");

let animInterval = null;

function animateToProgress(progressValue) {
  if (animInterval) clearInterval(animInterval);

  const targetAngle = (progressValue / 100) * 360;
  const duration = 900;
  const frameRate = 60;
  const steps = duration / (1000 / frameRate);
  const angleStep = targetAngle / steps;
  const progressStep = progressValue / steps;

  let currentAngle = 0;
  let currentProgress = 0;

  animInterval = setInterval(() => {
    currentAngle += angleStep;
    currentProgress += progressStep;

    if (currentAngle >= targetAngle) {
      currentAngle = targetAngle;
      currentProgress = progressValue;
      clearInterval(animInterval);
      animInterval = null;
    }

    animatedAngle.value = currentAngle;
    animatedProgress.value = Math.round(currentProgress);
  }, 1000 / frameRate);
}

function calcAveragePctCompleted(sections) {
  const nums = (Array.isArray(sections) ? sections : [])
    .filter(
      (s) =>
        String(s?.attempted) === "1" ||
        (s?.gradedate && s.gradedate !== "--")
    )
    .map((s) => Number(s?.pct))
    .filter((n) => Number.isFinite(n));

  if (nums.length === 0) return "—";
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return `${Math.round(avg)}%`;
}

function getInvoiceName(invoicenum) {
  const items = invoicedata.value[invoicenum] ?? [];
  const match = items.find((item) => item?.coursetitle != null);
  return match?.coursetitle || "Course title unavailable";
}

async function loadMessages() {
  loadingMessages.value = true;
  messagesError.value = "";

  try {
    messages.value = [];
  } catch (err) {
    console.error("Failed to load messages:", err);
    messagesError.value = "load-failed";
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
}

async function loadSidebarData() {
  loadingSidebar.value = true;
  sidebarError.value = "";

  try {
    const inv = await getInvoices(pid.value);
    invoices.value = inv?.response ?? [];

    await Promise.all(
      invoices.value.map(async (invoice) => {
        const details = await getInvoiceData(invoice.invoicenum);
        invoicedata.value[invoice.invoicenum] = details?.response ?? [];
      })
    );
  } catch (err) {
    console.error("Failed to load purchase history:", err);
    sidebarError.value = "load-failed";
    invoices.value = [];
  } finally {
    loadingSidebar.value = false;
  }
}

async function loadCourse() {
  loadingCourse.value = true;
  loadError.value = "";

  try {
    if (!enrollId) throw new Error("Missing route param (enrollId)");

    const recordData = await getEnrollmentRecord(enrollId);
    const record = Array.isArray(recordData?.response)
      ? recordData.response[0]
      : recordData?.response;

    if (!record) throw new Error("No enrollment record found");

    courseTitle.value = record.title || "Course title unavailable";
    courseCompletedDate.value = record.completedate || "—";
    courseGrade.value = record.grade || "—";

    const rawCeu = Number(record.ceus ?? record.ceu);
    ceus.value = Number.isFinite(rawCeu)
      ? rawCeu.toFixed(1)
      : "—";

    contactHours.value = record.contacthour ?? record.contacthours ?? "—";
    courseImage.value = courseImageMap[record?.owpabbr] || null;

    const editionId = String(
      record.editionid ?? record.editionId ?? record.edition ?? ""
    );

    let gradesData = await getCourseGrades(enrollId);
    let sections = Array.isArray(gradesData?.response)
      ? gradesData.response
      : [];

    if (sections.length === 0 && editionId) {
      gradesData = await getCourseGrades(editionId);
      sections = Array.isArray(gradesData?.response)
        ? gradesData.response
        : [];
    }

    totalChapters.value = sections.length || 0;
    gradeAverage.value = calcAveragePctCompleted(sections);

    const completedCount = sections.filter((s) => {
      const hasGradeDate = s?.gradedate && s.gradedate !== "--";
      const hasGrade =
        s?.grade !== null && s?.grade !== undefined && s?.grade !== "";
      const attempted = String(s?.attempted) === "1";
      return hasGradeDate || hasGrade || attempted;
    }).length;

    const percent =
      sections.length === 0
        ? 100
        : Math.round((completedCount / sections.length) * 100);

    animateToProgress(percent);

    chapters.value = sections
      .slice()
      .sort((a, b) => Number(a?.ordinal ?? 0) - Number(b?.ordinal ?? 0))
      .map((s) => {
        const pctStr =
          s?.pct !== null && s?.pct !== undefined && s?.pct !== ""
            ? `${s.pct}%`
            : "";

        const fracStr = s?.gradefraction ?? "";

        let gradeDisplay = "";
        if (pctStr && fracStr) gradeDisplay = `${pctStr} (${fracStr})`;
        else gradeDisplay = pctStr || fracStr || "";

        return {
          id: s?.examid ?? `${s?.ordinal ?? ""}-${s?.examname ?? ""}`,
          title: s?.examname || "Untitled chapter",
          date: s?.gradedate && s.gradedate !== "--" ? s.gradedate : "—",
          grade: gradeDisplay || "—",
        };
      });

    if (courseGrade.value === "—" && gradeAverage.value !== "—") {
      courseGrade.value = gradeAverage.value;
    }
  } catch (err) {
    console.error(err);
    loadError.value = err?.message || "Failed to load completed course data";
    chapters.value = [];
    totalChapters.value = "—";
    gradeAverage.value = "—";
    animatedAngle.value = 0;
    animatedProgress.value = 0;
    courseImage.value = null;
  } finally {
    loadingCourse.value = false;
  }
}

onMounted(async () => {
  await Promise.all([
    loadCourse(),
    loadMessages(),
    loadSidebarData(),
  ]);
});
</script>

<template>
  <div class="completed-course-page">

    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <div v-if="loadingCourse" class="state-message loading-message">
      Loading course data…
    </div>

     <div v-else-if="loadError" class="state-message error-message">
      {{ loadError }}
    </div>

  <div class="page-container">
  <div class="summary-tile">
    <div class="card-header">
      <div class="header-icon">
        <img :src="book" alt="Completed enrollments icon" />
      </div>
      <h2 class="card-title">Completed Enrollments</h2>
    </div>

    <div class="divider"></div>

    <div class="summary-body">
      <div class="summary-left">
        <img
          v-if="courseImage"
          :src="courseImage"
          alt="Course image"
          class="course-image-large completed-image"
        />
        <div v-else class="course-image-large completed-image fallback-image"></div>

        <div class="course-header-info">
          <h2 class="course-title">{{ courseTitle }}</h2>
          <p class="course-expiration">Completed: {{ courseCompletedDate }}</p>
          <p class="course-grade">Final Grade: {{ courseGrade }}</p>
        </div>

        <div class="course-metrics">
          <div class="metric">
            <div class="metric-value">{{ totalChapters }}</div>
            <div class="metric-label">Total Chapters</div>
          </div>

          <div class="metric">
            <div class="metric-value">{{ courseGrade }}</div>
            <div class="metric-label">Grade</div>
          </div>

          <div class="metric">
            <div class="metric-value">{{ ceus }}</div>
            <div class="metric-label">CEUs</div>
          </div>

          <div class="metric">
            <div class="metric-value">{{ contactHours }}</div>
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
          <div class="donut-inner">{{ animatedProgress }}%</div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>


    <div class="courses-bottom">

      <div class="courses-left">
        <div class="chapter-progress-tile">
          <div class="card-header">
            <div class="header-icon completed-icon">
              <img :src="book" alt="Chapter progress icon" />
            </div>
            <h2 class="card-title">Chapter Progress</h2>
          </div>

            <div class="divider"></div>

            <div v-if="loadingCourse" class="state-message loading-message">
              Loading chapter progress…
            </div>

            <div v-else-if="loadError" class="state-message error-message">
              We couldn’t load this chapter data right now.
            </div>

            <div v-else-if="chapters.length === 0" class="state-message empty-message">
              No chapter data available.
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
              :key="chapter.id"
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
          <!-- Messages -->
          <div class="side-card">
            <div class="side-header">
              <div class="header-icon side-icon">
                <img :src="mail" class="icon" />
              </div>
              <div class="side-title">Messages</div>
            </div>
            <div class="divider"></div>

            <div class="side-body">
              <div v-if="loadingMessages" class="state-message loading-message">
                Loading messages…
              </div>

              <div v-else-if="messagesError" class="state-message error-message">
                We couldn’t load your messages right now.
              </div>

              <div v-else-if="messages.length === 0" class="state-message empty-message">
                No messages available.
              </div>

              <div
                v-else
                v-for="message in messages"
                :key="message.id"
                class="side-link"
              >
                {{ message.subject || "Message unavailable" }}
                <span v-if="message.date">({{ message.date }})</span>
              </div>
            </div>

            <router-link to="/messages" class="side-footer">
              (View all messages)
            </router-link>
          </div>

             <!-- Purchase History -->
              <div class="side-card">
                <div class="side-header">
                  <div class="header-icon side-icon">
                    <img :src="history" class="icon" />
                  </div>
                  <div class="side-title">Purchase History</div>
                </div>

                <div class="divider"></div>

                <div class="side-body">
                  <div v-if="loadingSidebar" class="state-message loading-message">
                    Loading purchase history…
                  </div>

                  <div v-else-if="sidebarError" class="state-message error-message">
                    We couldn’t load your purchase history right now.
                  </div>

                  <div v-else-if="invoices.length === 0" class="state-message empty-message">
                    No purchase history available.
                  </div>

                  <div
                    v-else
                    v-for="invoice in invoices"
                    :key="invoice.invoicenum"
                    class="side-link"
                  >
                    Invoice: {{ invoice.invoicenum || "Unavailable" }} -
                    {{ getInvoiceName(invoice.invoicenum) }}
                  </div>
                </div>

              <router-link to="/purchase-history" class="side-footer">
                (View all purchases)
              </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.completed-course-page {
  padding: 0px;
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
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

.summary-tile .divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: -15px;
  margin-bottom: 14px;
}

.summary-tile .card-header {
  transform: translateY(-4px);
  margin-bottom: 4px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-icon {
  width: 26px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  border-radius: 4px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.fallback-image {
  background-color: #6DBE4B;
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
.course-grade {
  font-size: 14px;
  color: #555;
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

.chapter-progress-tile .divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 18px;
  margin-bottom: 18px;
}

.chapter-progress-tile .card-header {
  transform: translateY(-8px);
  margin-bottom: -18px;
}


.metric-value {
  font-size: 36px;
  font-weight: 700;
  color: #00A5B5;
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
  font-family: 'Roboto Semibold', sans-serif;
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
  grid-template-columns: 1.6fr 0.8fr; 
  gap: 8px; 
  align-items: flex-start;
}

.courses-left {
  display: flex;
  flex-direction: column;
  gap: 16px; 
}

.chapter-progress-tile {
  width: 100%;
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

.divider {
  border-top: 1px solid #FFFFFF;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-top: 2px;
  margin-bottom: 8px;
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

.back-link {
  margin-top: 12px;
  display: inline-block;
  font-size: 14px;
  color: #034750;
}

.back-link:hover {
  text-decoration: underline;
}

.state-message {
  padding: 8px 0;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
}

.loading-message,
.empty-message {
  color: #707070;
}

.error-message {
  color: #9F3323;
  font-weight: 600;
}

</style>
