<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getInvoices,
  getInvoiceData,
  loadFromSession
} from "@/services/owpAPI.js";

// keep this only if you still want placeholder recommended data for testing
import { recommendedCourses } from "../data/coursesData.js";

const route = useRoute();
const pid = 458860;

// Dashboard-style messaging DB connection
const MESSAGING_API_BASE = "https://owp-portal-redesign-db.onrender.com";
const messagingUserId = 1;

const invoices = ref([]);
const invoicedata = ref({});
const loadingSidebar = ref(true);
const sidebarError = ref("");

const messages = ref([]);
const loadingMessages = ref(true);
const messagesError = ref("");

const courseTitle = ref("No Recommended Course");
const courseDescription = ref("There is no recommended course available at this time.");
const courseLongDescription = ref(
  "Browse the course catalog to explore available offerings."
);
const chapters = ref([
  "No course content available."
]);

function formatInboxDate(dt) {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
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
    const url = new URL(`${MESSAGING_API_BASE}/api/messaging/threads`);
    url.searchParams.set("userId", String(messagingUserId));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    messages.value = (data.threads || []).slice(0, 3).map((row) => ({
      id: Number(row.ThreadId),
      sender: row.LastSenderName || row.LastSenderEmail || "Unknown",
      date: formatInboxDate(
        row.LastSentAt || row.LastMessageAt || row.CreatedAt
      ),
    }));
  } catch (e) {
    console.error("Failed to load messages:", e);
    messagesError.value = e?.message ?? "load-failed";
    messages.value = [];
  } finally {
    loadingMessages.value = false;
  }
}

async function loadSidebarData() {
  loadingSidebar.value = true;
  sidebarError.value = "";

  try {
    try {
      const inv = await getInvoices(pid.value);
      invoices.value = inv?.response ?? [];
    }
    catch {
      hadFailure.value = true;
      console.log("error");
      invoices.value = loadFromSession("getInvoices") ?? [];
    }

    const invoiceRequests = invoices.value.map((v) => ({
    invoicenum: v.invoicenum,
    promise: getInvoiceData(v.invoicenum),
    }));

    const invoiceResults = await Promise.allSettled(
      invoiceRequests.map((item) => item.promise)
    );

    invoiceRequests.forEach((item, index) => {
      const result = invoiceResults[index];
      const key = "getInvoiceData-"+item.invoicenum;
      if (result.status === 'fulfilled') {
        invoicedata.value[item.invoicenum] = result.value.response ?? [];
      }
      else {
        hadFailure.value = true;
        invoicedata.value[item.invoicenum] = loadFromSession(key) ?? [];
        console.log(invoicedata.value);
      }
    })
  }
  catch (err) {
    console.error("Failed to load purchase history:", err);
    sidebarError.value = "load-failed";
    invoices.value = [];
  }
  finally {
    loadingSidebar.value = false;
  }
}

function loadRecommendedCourse() {
  const courseId = Number(route.params.id);
  const course = recommendedCourses.find((c) => c.id === courseId);

  if (!course) {
    courseTitle.value = "No Recommended Course";
    courseDescription.value = "There is no recommended course available at this time.";
    courseLongDescription.value =
      "Browse the course catalog to explore available offerings.";
    chapters.value = ["No course content available."];
    return;
  }

  courseTitle.value = course.title || "Course title unavailable";
  courseDescription.value =
    course.description || "Description unavailable.";
  courseLongDescription.value =
    course.longDescription || "No course description available.";
  chapters.value =
    Array.isArray(course.chapters) && course.chapters.length > 0
      ? course.chapters
      : ["No course content available."];
}

onMounted(async () => {
  loadRecommendedCourse();

  await Promise.all([
    loadMessages(),
    loadSidebarData(),
  ]);
});
</script>

<template>
  <div class="recommended-course-page">

    <!-- Header -->
    <div class="courses-top">
      <div class="text-block">
        <div class="courses-header">Courses</div>
      </div>
    </div>

    <!-- Summary Tile -->
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
          <h2 class="card-title">Recommended Course</h2>
        </div>

        <div class="divider"></div>

        <div class="summary-body">
          <!-- Left -->
          <div class="summary-left">
            <div class="course-image-large recommended-image">
              <span class="fallback-text-large">NO IMAGE</span>
            </div>

            <div class="course-header-info">
              <h2 class="course-title">{{ courseTitle }}</h2>
              <p class="course-description-text">{{ courseDescription }}</p>
            </div>
          </div>

          <!-- Right long description -->
          <div class="summary-right">
            <p class="course-long-text">
              {{ courseLongDescription }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="courses-bottom">

      <!-- Left -->
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
            <h2 class="card-title">Course Contents</h2>
          </div>

          <div class="divider"></div>

          <div class="chapter-table">
            <div
              class="chapter-row"
              v-for="(chapter, index) in chapters"
              :key="index"
            >
              <span class="chapter-number">{{ index + 1 }}</span>
              <span class="chapter-title">{{ chapter.title || chapter }}</span>
            </div>
          </div>
        </div>

        <router-link to="/courses" class="back-link">← Back to Courses</router-link>
      </div>

      <!-- Right sidebar -->
      <div class="courses-right">

        <!-- Messages -->
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
            <div v-if="loadingMessages" class="state-message loading-message">
              Loading messages…
            </div>

            <div v-else-if="messagesError" class="state-message error-message">
              We couldn’t load your messages right now.
            </div>

            <div v-else-if="messages.length === 0" class="state-message empty-message">
              No messages available.
            </div>

            <router-link
              v-else
              v-for="message in messages"
              :key="message.id"
              :to="`/messages?threadId=${message.id}`"
              class="side-link"
            >
              Email Message from: {{ message.sender || "Unknown" }}
              <span v-if="message.date"> {{ message.date }}</span>
            </router-link>
          </div>

          <router-link to="/messages" class="side-footer">
            (View all messages)
          </router-link>
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
                class="lucide lucide-history-icon lucide-history">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
                <path d="M12 7v5l4 2"/>
              </svg>
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

            <template v-else>
              <div
                v-for="invoice in invoices"
                :key="invoice.invoicenum"
                class="side-link"
              >
                Invoice: {{ invoice.invoicenum || "Unavailable" }} -
                {{ getInvoiceName(invoice.invoicenum) }}
              </div>
            </template>
          </div>

          <router-link to="/purchase-history" class="side-footer">
            (View all purchases)
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.recommended-course-page {
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  color: #034750;
  padding: 0;
}

.courses-top {
  max-width: 1000rem;
  width: 100%;
  margin: 32rem auto 0;
  display: flex;
  justify-content: flex-start;
}

.courses-header {
  font-size: 32rem;
  font-weight: 700;
}

.page-container {
  max-width: 1000rem;
  margin: 0 auto;
}

.summary-tile {
  background-color: #F2F1F2;
  padding: 20rem;
  margin-top: 32rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8rem;
  transform: translateY(-4rem);
  margin-bottom: 4rem;
}

.header-icon {
  width: 32rem;
  height: 40rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border-radius: 0;
  padding: 0;
}

.side-icon {
  width: 36rem;
  height: 44rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
}

.side-icon svg {
  width: 28rem;
  height: 28rem;
  stroke: #007C8A;
}

.card-title {
  font-size: 20rem;
  font-weight: 700;
  color: #034750;
}

.summary-tile .divider {
  border-top: 1rem solid #FFFFFF;
  width: calc(100% + 40rem);
  margin-left: -20rem;
  margin-top: -15rem;
  margin-bottom: 14rem;
}

.chapter-progress-tile .divider {
  border-top: 1rem solid #FFFFFF;
  width: calc(100% + 40rem);
  margin-left: -20rem;
  margin-top: 18rem;
  margin-bottom: 18rem;
}

.summary-body {
  display: flex;
  justify-content: flex-start;
  gap: 48rem;
}

.summary-left {
  display: flex;
  gap: 16rem;
}

.course-image-large {
  width: 100rem;
  height: 120rem;
  background-color: #6DBE4B;
  border-radius: 4rem;
}

.course-header-info {
  display: flex;
  flex-direction: column;
  gap: 6rem;
  margin-top: -12rem;
}

.course-title {
  font-family: 'Roboto Semibold', sans-serif;
  font-size: 16rem;
  color: #707070;
  max-width: 260rem;
}

.course-description-text {
  font-size: 15rem;
  color: #555;
  max-width: 260rem;
  line-height: 1.4;
  margin-top: -12rem;
}

.summary-right {
  max-width: 540rem;
}

.course-long-text {
  font-size: 15rem;
  line-height: 1.45;
  color: #034750;
  margin-top: 1rem;
  margin-left: -30rem;
}

.courses-bottom {
  max-width: 1000rem;
  width: 100%;
  margin: 32rem auto;
  display: grid;
  grid-template-columns: 1.6fr 0.8fr;
  gap: 8rem;
}

.courses-left {
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.chapter-progress-tile {
  background-color: #F2F1F2;
  padding: 20rem;
  border-radius: 14rem;
}

.chapter-progress-tile {
  width: 95%;
  max-width: none;
}

.chapter-progress-tile .card-header {
  transform: translateY(-8rem);
  margin-bottom: -18rem;
}

.chapter-progress-tile .divider {
  margin-top: 18rem;
  margin-bottom: 18rem;
}

.chapter-table {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.chapter-row {
  display: flex;
  gap: 8rem;
  padding: 8rem 0;
  border-bottom: 1rem solid #e2e2e2;
}

.chapter-number {
  font-weight: 700;
}

.chapter-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8rem;
  padding: 8rem 0;
  border-bottom: 1rem solid #e2e2e2;
  font-size: 14rem;
  color: #034750;
}

.chapter-number {
  font-weight: 700;
  color: #034750;
  min-width: 20rem;
}

.chapter-title {
  flex: 1;
  color: #034750;
  line-height: 1.3;
}

.courses-right {
  margin-left: 30rem;
  max-width: 260rem;
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.side-card {
  background-color: #F2F1F2;
  padding: 20rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  gap: 12rem;
  width: 100%;
}

.side-header {
  display: flex;
  align-items: center;
  gap: 10rem;
}

.side-title {
  font-size: 20rem;
  font-weight: 700;
}

.divider {
  border-top: 1rem solid #FFFFFF;
  width: calc(100% + 40rem);
  margin-left: -20rem;
  margin-top: 2rem;
  margin-bottom: 8rem;
}

.side-body {
  display: flex;
  flex-direction: column;
  gap: 14rem;
}

.side-link {
  font-size: 16rem;
  color: #007c8a;
  cursor: pointer;
  text-decoration: underline;
  padding: 5rem 16rem;
  margin: 0 -20rem;
  width: calc(100% + 7rem);
  transition: background-color 0.2s ease;
}

.side-link:hover {
  background-color: #D9D9D9;
}

.side-footer {
  height: 32rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 18rem;
  cursor: pointer;
  color: #034750;
}

.side-footer:hover {
  text-decoration: underline;
}

.back-link {
  margin-top: 12rem;
  font-size: 14rem;
  color: #034750;
}

.back-link:hover {
  text-decoration: underline;
}

.state-message {
  padding: 8rem 0;
  font-size: 16rem;
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

.fallback-image-large {
  background-color: #6DBE4B;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.fallback-text-large {
  color: white;
  font-size: 12rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.5rem;
}
</style>
