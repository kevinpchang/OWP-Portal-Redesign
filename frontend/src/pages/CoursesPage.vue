<script setup>
import { ref, onMounted } from "vue";
import {
  getActiveEnrollment,
  getCourseGrades,
  getInvoices,
  getInvoiceData,
} from "@/services/owpAPI.js";

import book from "@/assets/icons/owp-2color/book-icon.svg";
import pass from "@/assets/icons/1color/check-mark-filled.svg";
import fail from "@/assets/icons/1color/fail-icon-filled.svg";
import history from "@/assets/icons/owp-2color/history-icon.svg";
import mail from "@/assets/icons/owp-2color/mail-icon.svg";

//course images
import MBR2nd from "@/assets/manual-imgs/MBR-2nd-cvr.png";
import owtp1st8th from "@/assets/manual-imgs/owtp-1-8th-cvr.jpg";
import owtp2nd8th from "@/assets/manual-imgs/owtp-2-8th-cvr.jpg";
import owtp3rd8th from "@/assets/manual-imgs/owtp-3-8th-cvr.jpg";
import um3rd from "@/assets/manual-imgs/um-3rd-cvr.jpg";
import wtpo1st7th from "@/assets/manual-imgs/wtpo-1-7th-cvr.jpg";
import wtpo2nd7th from "@/assets/manual-imgs/wtpo-2-7th-cvr.jpg";

//course image map
const courseImageMap = {
  UM: um3rd,
  WTPO1: wtpo1st7th,
  WTPO2: wtpo2nd7th,
  OWTP1: owtp1st8th,
  OWTP2: owtp2nd8th,
  OWTP3: owtp3rd8th,
  MBR: MBR2nd,
};

const pid = 458860;

const activeCourses = ref([]);
const completedCourses = ref([]);
const recommendedCourses = ref([]);

const loadingActive = ref(true);
const activeError = ref("");

const loadingCompleted = ref(true);
const completedError = ref("");

const loadingRecommended = ref(true);
const recommendedError = ref("");

const loadingSidebar = ref(true);
const sidebarError = ref("");

const messages = ref([]);
const loadingMessages = ref(true);
const messagesError = ref("");

const invoices = ref([]);
const invoicedata = ref({});

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
  } catch (e) {
    console.error("Failed to load messages:", e);
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
    const inv = await getInvoices(pid);
    invoices.value = inv?.response ?? [];

    await Promise.all(
      invoices.value.map(async (invoice) => {
        const details = await getInvoiceData(invoice.invoicenum);
        invoicedata.value[invoice.invoicenum] = details?.response ?? [];
      })
    );
  } catch (e) {
    console.error("Failed to load sidebar purchase history:", e);
    sidebarError.value = "load-failed";
    invoices.value = [];
  } finally {
    loadingSidebar.value = false;
  }
}

async function loadRecommendedCourses() {
  loadingRecommended.value = true;
  recommendedError.value = "";

  try {
    // in place for future integration
      recommendedCourses.value = [];
  } catch (e) {
    console.error("Failed to load recommended courses:", e);
    recommendedError.value = "load-failed";
    recommendedCourses.value = [];
  } finally {
    loadingRecommended.value = false;
  }
}

onMounted(async () => {
  loadingActive.value = true;
  loadingCompleted.value = true;
  loadingRecommended.value = true;
  activeError.value = "";
  completedError.value = "";
  recommendedError.value = "";

  try {
    const data = await getActiveEnrollment(pid);
    const rows = data?.response ?? [];

    const activeRows = rows.filter((r) => r.statustxt === "Enrolled");
    const completedRows = rows.filter(
      (r) => r.statustxt === "Complete" || r.statustxt === "Dropped"
    );

    activeCourses.value = await Promise.all(
      activeRows.map(async (r) => {
        const gradesData = await getCourseGrades(r.enrollid);
        const sections = gradesData?.response ?? [];

        const total = sections.length;
        const graded = sections.filter(
          (s) => String(s.grade ?? "").trim() !== ""
        ).length;

        const percent = total === 0 ? 0 : Math.round((graded / total) * 100);

        return {
          id: r.enrollid,
          title: r.title || "Course title unavailable",
          expires: r.expiredate || "—",
          progress: `${percent}%`,
          extendEligible: r.extendeligible === "1",
          image: courseImageMap[r.owpabbr] || null,
        };
      })
    );

    completedCourses.value = completedRows.map((r) => {
      if (r.statustxt === "Dropped") {
        return {
          id: r.enrollid,
          title: r.title || "Course title unavailable",
          status: "",
          dropped: true,
          image: courseImageMap[r.owpabbr] || null,
        };
      }

      const grade = (r.grade || "").trim();

      return {
        id: r.enrollid,
        title: r.title || "Course title unavailable",
        status: grade === "CR" ? "Pass" : "Fail",
        dropped: false,
        image: courseImageMap[r.owpabbr] || null,
      };
    });
  } catch (e) {
    console.error("Failed to load course enrollments:", e);
    activeError.value = "load-failed";
    completedError.value = "load-failed";
  } finally {
    loadingActive.value = false;
    loadingCompleted.value = false;
  }

  await Promise.all([loadMessages(), loadSidebarData(), loadRecommendedCourses(),
 ]);
});
</script>

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
                <img :src="book" alt="Active enrollments icon" />
              </div>
              <h2 class="card-title">Active Enrollments</h2>
            </div>
            <div class="card-divider"></div>

            <div class="card-body">
              <div v-if="loadingActive" class="state-message loading-message">
                Loading Course Data…
              </div>

              <div v-else-if="activeError" class="state-message error-message">
                We couldn’t load your course information right now.
              </div>

              <div v-else-if="activeCourses.length === 0" class="state-message empty-message">
                No active enrollments.
              </div>
              <router-link
                v-for="course in activeCourses"
                :key="course.id"
                :to="`/courses/${course.id}`"
                class="course-row-link"
              >
              <div class="course-row">
                    <img
                      v-if="course.image"
                      :src="course.image"
                      alt="Course image"
                      class="course-image"
                    />
                    <div v-else class="course-image fallback-image">
                      <span class="fallback-text">NO IMAGE AVAILABLE</span>
                    </div>
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

                    <div class="card-action" v-if="course.extendEligible">
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
               <img :src="book" alt="Completed enrollments icon" />
              </div>
              <h2 class="card-title">Completed Enrollments</h2>
            </div>
            <div class="card-divider"></div>

            <div class="card-body">

              <div v-if="loadingCompleted" class="state-message loading-message">
                Loading Course Data…
              </div>

              <div v-else-if="completedError" class="state-message error-message">
                We couldn’t load your completed course information right now.
              </div>

              <div v-else-if="completedCourses.length === 0" class="state-message empty-message">
                No completed enrollments.
              </div>

              <router-link
                v-for="course in completedCourses"
                :key="course.id"
                :to="`/completed/${course.id}`"
                class="course-row-link"
              >
                <div class="course-row">
                    <img
                      v-if="course.image"
                      :src="course.image"
                      alt="Course image"
                      class="course-image completed-image"
                    />
                    <div v-else class="course-image completed-image fallback-image">
                      <span class="fallback-text">NO IMAGE AVAILABLE</span>
                    </div>
                  <div class="course-info">
                    <div class="course-title">{{ course.title }}</div>

                    <div class="info-subrow">
                      <div class="completion-label">
                        {{ course.dropped ? 'Dropped' : 'Completed' }}
                      </div>
                      <div
                        class="status-text"
                        :class="course.status === 'Pass' ? 'status-pass' : 'status-fail'"
                      >
                        {{ course.status }}

                        <img
                          v-if="!course.dropped"
                          :src="course.status === 'Pass' ? pass : fail"
                          class="status-icon"
                          alt="status icon"
                        />
                      </div>
                    </div>

                    <div class="progress-bar" v-if="!course.dropped">
                      <div
                        class="progress-fill"
                        :class="course.status === 'Pass' ? 'completed-fill' : 'failed-fill'"
                        style="width: 100%"
                      >
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
                  <img :src="book" alt="Recommended enrollments icon" />
                </div>
                <h2 class="card-title">Recommended Courses</h2>
              </div>
              <div class="card-divider"></div>

              <div class="card-body">
                <div v-if="loadingRecommended" class="state-message loading-message">
                  Loading recommended courses…
                </div>

                <div v-else-if="recommendedError" class="state-message error-message">
                  We couldn’t load recommended courses right now.
                </div>

                <div v-else-if="recommendedCourses.length === 0" class="recommended-empty">
                  <div class="empty-title">No Recommended Courses</div>
                  <div class="empty-subtext">
                    You have no recommended courses available at this time.
                  </div>

                  <a
                    href="https://www.owp.csus.edu/operator-training/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="catalog-link"
                  >
                    Browse Course Catalog
                  </a>
                </div>

                <router-link
                  v-else
                  v-for="course in recommendedCourses"
                  :key="course.id"
                  :to="`/recommended/${course.id}`"
                  class="course-row-link"
                >
                  <div class="course-row">
                    <img
                      v-if="course.image"
                      :src="course.image"
                      alt="Course image"
                      class="course-image"
                    />
                    <div v-else class="course-image fallback-image">
                      <span class="fallback-text">NO IMAGE AVAILABLE</span>
                    </div>

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

              <template v-else>
                <div
                  v-for="message in messages"
                  :key="message.id"
                  class="side-link"
                >
                  {{ message.subject || "Message unavailable" }}
                  <span v-if="message.date">({{ message.date }})</span>
                </div>
              </template>

            </div>

          <router-link to="/messages" class="side-footer">
            (View all messages)
          </router-link>
        </div>

        <!-- Purchase History-->
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
  width: 100%;
  margin-right: 0;
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


.header-icon img {
  width: 28px;
  height: 28px;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.side-icon img {
  width: 24px;
  height: 24px;
  display: block;
  object-fit: contain;
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

.status-text {
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.course-image {
  width: 59px;
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.fallback-image {
  background-color: #6DBE4B;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.fallback-text {
  color: white;
  font-size: 10px;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.recommended-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #034750;
  font-family: 'Roboto', sans-serif;
}

.empty-subtext {
  font-size: 14px;
  color: #707070;
  line-height: 1.5;
  font-family: 'Roboto', sans-serif;
}

.catalog-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #00A5B5;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  padding: 8px 14px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.catalog-link:hover {
  background-color: #008c9a;
}

</style>
