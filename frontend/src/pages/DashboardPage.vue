<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import clarifier from '@/assets/artwork/clarifier.jpg'

//import icons
import book from '@/assets/icons/owp-2color/book-icon.svg'
import slide from '@/assets/icons/owp-2color/slides-icon.svg'
import mail from '@/assets/icons/owp-2color/mail-icon.svg'
import history from '@/assets/icons/owp-2color/history-icon.svg'

import * as api from '@/services/owpAPI'

import MBR2nd from "@/assets/manual-imgs/MBR-2nd-cvr.png";
import owtp1st8th from "@/assets/manual-imgs/owtp-1-8th-cvr.jpg";
import owtp2nd8th from "@/assets/manual-imgs/owtp-2-8th-cvr.jpg";
import owtp3rd8th from "@/assets/manual-imgs/owtp-3-8th-cvr.jpg";
import um3rd from "@/assets/manual-imgs/um-3rd-cvr.jpg";
import wtpo1st7th from "@/assets/manual-imgs/wtpo-1-7th-cvr.jpg";
import wtpo2nd7th from "@/assets/manual-imgs/wtpo-2-7th-cvr.jpg";
import sws from "@/assets/manual-imgs/sws.png";
import pfi from "@/assets/manual-imgs/pfi.png";

const courseImageMap = {
  UM: um3rd,
  WTPO1: wtpo1st7th,
  WTPO2: wtpo2nd7th,
  OWTP1: owtp1st8th,
  OWTP2: owtp2nd8th,
  OWTP3: owtp3rd8th,
  MBR: MBR2nd,
  //Silicon addition
  CE29: sws,
  PFI: pfi,
};

function getCourseImage(owpabbr) {
  return courseImageMap[owpabbr] || null;
}


const route = useRoute()
const currentDate = ref(formatDate())

// --- Silicon Scribes DB ---
const MESSAGING_API_BASE = 'https://owp-portal-redesign-db.onrender.com'
const messagingUserId = 1

const messages = ref([])
const loadingMessages = ref(false)
const messagesError = ref('')

function formatInboxDate(dt) {
  if (!dt) return ''
  return new Date(dt).toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
}

async function loadMessages() {
  loadingMessages.value = true
  messagesError.value = ''

  try {
    const url = new URL(`${MESSAGING_API_BASE}/api/messaging/threads`)
    url.searchParams.set('userId', String(messagingUserId))

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()

    messages.value = (data.threads || []).slice(0, 3).map((row) => ({
      id: Number(row.ThreadId),
      sender: row.LastSenderName || row.LastSenderEmail || 'Unknown',
      date: formatInboxDate(row.LastSentAt || row.LastMessageAt || row.CreatedAt),
    }))
  } catch (e) {
    console.error('Failed to load messages:', e)
    messagesError.value = e?.message ?? 'load-failed'
    messages.value = []
  } finally {
    loadingMessages.value = false
  }
}


// --- OWP API ---
const pid = 458860 // later: come from auth/session

const loading = ref(false)
const error = ref('')

const account = ref(null)
const enrollments = ref([])
const grades = ref([])
const invoices = ref([])
const invoicedata = ref([])

async function loadDash() {
  console.log('loadAccount called')
  loading.value = true
  error.value = ''

  try {
    const acc = await api.getAccountDetails(pid)
    account.value = acc.response
    console.log('Account JSON:', acc)

    const enr = await api.getActiveEnrollment(pid)
    enrollments.value = enr.response
    console.log('Enrollments JSON:', enr)

    for (const v of enr.response) {
      const c = await api.getCourseGrades(v.enrollid)
      grades.value[v.enrollid] = c.response ?? []
    }
    console.log('Grades JSON:', grades)

    const inv = await api.getInvoices(pid)
    invoices.value = inv.response
    console.log('Invoices JSON:', inv)

    for (const v of inv.response) {
      const c = await api.getInvoiceData(v.invoicenum)
      invoicedata.value[v.invoicenum] = c.response ?? []
    }
    console.log('Invoice Data', invoicedata)
  } catch (e) {
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }

  await loadMessages()
}

const activeEnrollments = computed(() =>
  enrollments.value.filter((active) => active.statustxt === 'Enrolled'),
)

function getCourseCompletion(enrollid) {
  const sections = grades.value[enrollid] ?? []
  const completed = sections?.filter((section) => section.grade != null).length
  return Math.round((completed / sections.length) * 100)
}

function getInvoiceName(invoicenum) {
  const item = invoicedata.value[invoicenum] ?? []
  const data = item?.find((item) => item.coursetitle != null)
  return data?.coursetitle
}

onMounted(loadDash)

// Helper function to format date based on user's local settings
function formatDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
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
  <div ref="scrollable" class="dashboard-page">
    <div class="dashboard-top">
      <div class="text">
        <div class="date">{{ currentDate }}</div>
        <div class="welcome-message">Hello, {{ account?.firstname ?? 'User' }}</div>
        <div class="dashboard-description">
          Here is a quick look at your active and completed enrollments. You can also view a
          snapshot of your previous purchases.
        </div>
      </div>

      <div class="image">
        <img src="../assets/owpart.png" />
      </div>
    </div>

    <div class="dashboard-bottom">
      <div class="dashboard-left">
        <div class="active-enrollments">
          <div class="header">
            <img :src="book" class="icon" />
            <div class="text">Active Enrollments</div>
          </div>
          <div class="divider"></div>
          <div class="body">
            <router-link class="object" v-for="v in activeEnrollments.slice(0, 3)" :key="v.enrollid" :to="`/courses/${v.enrollid}`">
              <div class="left">
                <img
                  v-if="getCourseImage(v.owpabbr)"
                  :src="getCourseImage(v.owpabbr)"
                  alt="Course image"
                  class="course-cover"
                />
                <div v-else class="course-cover fallback-image">
                  <span class="fallback-text">NO IMAGE AVAILABLE</span>
                </div>
              </div>
              <div class="right">
                <div class="title">
                  <div class="text">{{ v.title }}</div>
                </div>
                <div class="data">
                  <div class="text">Completion</div>
                  <div class="text">Enrollment expires: {{ v.expiredate }}</div>
                </div>
                <div class="progress">
                  <div class="percent" :style="{ width: getCourseCompletion(v.enrollid) + '%' }">
                    <div class="text">{{ getCourseCompletion(v.enrollid) + '%' }}</div>
                  </div>
                </div>
              </div>
              
            </router-link>
          </div>
          <div class="view-all">
            <router-link
              to="/courses"
              class="courses-button"
              :class="{ active: route.name === 'CoursesPage' }"
            >
              <div class="text">(View all enrollments)</div>
            </router-link>
          </div>
        </div>

        <div class="instructor-slides">
          <div class="header">
            <img :src="slide" class="icon" />
            <div class="text">Instructor Slides</div>
          </div>
          <div class="divider"></div>
          <div class="body">
            <div class="object"><div class="text">Advanced Water Treatment</div></div>
            <div class="object">
              <div class="text">
                Operation and Maintenance of Wastewater Collection Systems, Vol I
              </div>
            </div>
            <div class="object">
              <div class="text">
                Operation and Maintenance of Wastewater Collection Systems, Vol II
              </div>
            </div>
          </div>
          <div class="view-all">
            <router-link
              to="/slides"
              class="slides-button"
              :class="{ active: route.name === 'SlidesPage' }"
            >
              <div class="text">(View all slides)</div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="dashboard-right">
        <div class="messages">
          <div class="header">
            <img :src="mail" class="icon" />
            <div class="text">Messages</div>
          </div>
          <div class="divider"></div>
          <div class="body">
            <router-link :to="`/messages?threadId=${message.id}`" class="object" v-for="message in messages.slice(0, 3)" :key="message.id"><div class="text">Email Message from: {{ message.sender }} {{ message.date }}</div></router-link>
          </div>
          <div class="view-all"> 
            <router-link to="/messages">
              <div class="text">(View all messages)</div>
            </router-link>
          </div>
        </div>

        <div class="purchase-history">
          <div class="header">
            <img :src="history" class="icon" />
            <div class="text">Purchase History</div>
          </div>
          <div class="divider"></div>
          <div class="body">
            <router-link class="object" v-for="v in invoices.slice(0, 3)" :key="v.invoicenum" :to="`/purchase-history/${v.invoicenum}`">
              <div class="text">
                Invoice: {{ v.invoicenum }} - {{ getInvoiceName(v.invoicenum) }}
              </div>
            </router-link>
          </div>
          <div class="view-all">
            <router-link
              to="/purchase-history"
              class="purchase-history-button"
              :class="{ active: route.name === 'PurchaseHistoryPage' }"
            >
              <div class="text">(View all purchases)</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 32rem;
  justify-content: center;
  align-items: top;
}

.dashboard-top {
  grid-row: 1;
  display: grid;
  grid-template-columns: 508rem 508rem;
  margin-top: 32rem;
}

.text {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  height: 240rem;
  color: #034750;
}

.image {
  grid-column: 2;
}

.image > img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  object-position: center;
  display: block;
}

.date {
  font-size: 20rem;
  font-weight: 600;
  color: #707070;
  margin-top: 24rem;
  margin-bottom: 32rem;
  margin-left: 24rem;
}

.welcome-message {
  font-size: 56rem;
  font-weight: 700;
  color: #00a5b5;
  margin-bottom: 16rem;
  margin-left: 24rem;
}

.dashboard-description {
  width: 395rem;
  height: 71rem;
  font-size: 19rem;
  font-weight: 400;
  color: #747474;
  margin-bottom: 33rem;
  margin-left: 24rem;
}

.dashboard-bottom {
  grid-row: 2;
  display: grid;
  grid-template-columns: 700rem 300rem;
  column-gap: 16rem;
  margin-bottom: 48rem;
}

.dashboard-left {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.divider {
  width: 100%;
  height: 0rem;
  border-top: 1rem solid #ffffff;
}

.active-enrollments {
  height: 450rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: top;
  background-color: #f2f1f2;
}

.active-enrollments .header {
  height: 68rem;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.active-enrollments .header .icon {
  width: 26.53rem;
  height: 33.67rem;
  transform: rotate(-25deg);
  margin-left: 23.55rem;
}

.active-enrollments .header .text {
  height: 20rem;
  font-size: 20rem;
  font-weight: 700;
  margin-left: 8rem;
  color: #034750;
}

.active-enrollments .body {
  height: 382rem;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.active-enrollments .body .object {
  height: 118rem;
  display: flex;
  flex-direction: row;
  margin-bottom: 4rem;
  text-decoration: none;
}

.active-enrollments .body .object:hover {
  cursor: pointer;
  background-color: #d9d9d9;
}

.active-enrollments .body .object .left {
  width: 83rem;
  display: flex;
  align-items: center;
}

.active-enrollments .body .object .left .course-cover {
  width: 59rem;
  height: 71rem;
  margin-left: 24rem;
  border-radius: 4rem;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.active-enrollments .body .object .left .fallback-image {
  background-color: #6DBE4B;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.active-enrollments .body .object .left .fallback-text {
  color: #ffffff;
  font-size: 10rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.3rem;
  font-family: 'Roboto', sans-serif;
  padding: 4rem;
}


.active-enrollments .body .object .right {
  width: 617rem;
  display: flex;
  cursor: pointer;
  flex-direction: column;
}

.active-enrollments .body .object .right .title {
  height: 17rem;
  margin-top: 23rem;
  color: #034750;
}

.active-enrollments .body .object .right .title .text {
  height: 17rem;
  font-size: 16rem;
  font-weight: 600;
  text-decoration: underline;
  margin-left: 13.5rem;
  color: #707070;
}

.active-enrollments .body .object .right .data {
  height: 14rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16rem;
  margin-left: 13rem;
  margin-right: 24rem;
}

.active-enrollments .body .object .right .data .text {
  height: 14rem;
  font-size: 14rem;
  font-weight: 400;
  color: #707070;
}

.active-enrollments .body .object .right .progress {
  height: 16rem;
  border-radius: 4rem;
  display: flex;
  margin-top: 8rem;
  margin-left: 13rem;
  margin-right: 24rem;
  background-color: #7a7a7a;
}

.active-enrollments .body .object .right .progress .percent {
  border-radius: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00a5b5;
}

.active-enrollments .body .object .right .progress .percent .text {
  height: 13rem;
  font-size: 14rem;
  font-weight: 400;
  line-height: 1rem;
  margin-top: 2rem;
  color: #ffffff;
}

.view-all {
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.view-all .text {
  height: 20rem;
  font-size: 20rem;
  font-weight: 400;
  margin-bottom: 12rem;
  cursor: pointer;
  color: #034750;
  transition: color 0.2s ease;
}

.view-all .text:hover {
  text-decoration: underline;
  color: #007c8a;
}

.dashboard-button,
.my-account-button,
.my-tasks-button,
.slides-button,
.courses-button,
.operator-numbers-button,
.certificates-button,
.purchase-history-button {
  text-decoration: none;
}

.instructor-slides {
  height: 250rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  background-color: #f2f1f2;
}

.instructor-slides .header {
  height: 68rem;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.instructor-slides .header .icon {
  width: 26.53rem;
  height: 33.67rem;
  margin-left: 23.55rem;
}

.instructor-slides .header .text {
  height: 20rem;
  font-size: 20rem;
  font-weight: 700;
  margin-left: 8rem;
  color: #034750;
}

.instructor-slides .body {
  height: 140rem;
  display: flex;
  flex-direction: column;
}

.instructor-slides .body .object {
  height: 40rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.instructor-slides .body .object:hover {
  background-color: #d9d9d9;
  cursor: pointer;
}

.instructor-slides .body .object .text {
  height: 14rem;
  margin-left: 24rem;
  font-size: 16rem;
  font-weight: 400;
  text-decoration: underline;
  color: #007c8a;
}

.dashboard-right {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.messages {
  height: 240rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  background-color: #f2f1f2;
}

.messages .header {
  height: 68rem;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.messages .header .icon {
  width: 26.53rem;
  height: 33.67rem;
  margin-left: 23.55rem;
}

.messages .header .text {
  height: 20rem;
  font-size: 20rem;
  font-weight: 700;
  margin-left: 8rem;
  color: #034750;
}

.messages .body {
  height: 172rem;
  display: flex;
  flex-direction: column;
}

.messages .body .object {
  height: 40rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.messages .body .object:hover {
  background-color: #d9d9d9;
  cursor: pointer;
}

.messages .body .object .text {
  height: 14rem;
  margin-left: 24rem;
  font-size: 16rem;
  font-weight: 400;
  text-decoration: underline;
  color: #007c8a;
}

.purchase-history {
  height: 460rem;
  border-radius: 14rem;
  display: flex;
  flex-direction: column;
  background-color: #f2f1f2;
}

.purchase-history .header {
  height: 68rem;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}

.purchase-history .header .icon {
  width: 26.53rem;
  height: 33.67rem;
  margin-left: 23.55rem;
}

.purchase-history .header .text {
  height: 20rem;
  font-size: 20rem;
  font-weight: 700;
  margin-left: 8rem;
  color: #034750;
}

.purchase-history .body {
  height: 460rem;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.purchase-history .body .object {
  height: 50rem;
  padding-top: 2%;
  padding-bottom: 2%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.purchase-history .body .object:hover {
  background-color: #d9d9d9;
  cursor: pointer;
}

.purchase-history .body .object .text {
  height: 14rem;
  padding-left: 24rem;
  padding-right: 24rem;
  font-size: 16rem;
  font-weight: 400;
  text-decoration: underline;
  color: #007c8a;
}

.view-all a {
  color: inherit;
  text-decoration: inherit;
}
</style>
