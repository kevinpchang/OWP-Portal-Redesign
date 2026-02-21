<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { UserRound, NotebookText, Hash, FileText, History, SquareUserRound } from "lucide-vue-next";

import {
  getAccountDetails,
  getActiveEnrollment,
  getCourseGrades,
  getOperatorList,
  updateContactInfo
} from "@/services/myAccountAPI";

const route = useRoute();

// --- API STATE ---
const pid = 458860; // later: come from auth/session

const loading = ref(false);
const error = ref("");

const account = ref(null);          // will hold accountDetails response.response
const enrollments = ref([]);        // will hold activeEnrollment response.response
const selectedEnrollId = ref(null);
const grades = ref([]);             // will hold getCourseGrades response.response
const operatorList = ref([]);       // will hold getOperatorList response.response

async function loadAccount() {
  loading.value = true;
  error.value = "";
  try {
    const acc = await getAccountDetails(pid);
    account.value = acc.response;

    const enr = await getActiveEnrollment(pid);
    enrollments.value = enr.response ?? [];

    const op = await getOperatorList(pid);
    operatorList.value = op.response ?? [];

    // pick an "Enrolled" one if possible, else first
    const preferred =
      enrollments.value.find(e => e.statustxt === "Enrolled") ?? enrollments.value[0];

    if (preferred?.enrollid) {
      selectedEnrollId.value = preferred.enrollid;
      const g = await getCourseGrades(preferred.enrollid);
      grades.value = g.response ?? [];
    } else {
      grades.value = [];
    }
  } catch (e) {
    error.value = e?.message ?? String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadAccount);
  
  // form state for updateContactInfo
  const contactForm = reactive({
    street_1: "",
    street_2: "",
    street_3: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
    ipAddr: "127.0.0.1",

    // ONE input box in the UI
    phone_display: "",
    mobile_display: "",

    // what the API actually needs
    phone_area_code: "",
    phone_local: "",
    phone_extension: "",
    fax_area_code: "",
    fax_local: "",
  });

  // helper: safely split "(415) 866-9053" into area/local if needed
  function splitPhone(fmt) {
    const digits = String(fmt ?? "").replace(/\D/g, "");
    if (digits.length >= 10) {
      return { area: digits.slice(0, 3), local: digits.slice(3, 10) };
    }
    return { area: "", local: "" };
  }

  function openContactDialogWithData() {
    // fill the form from current account data so the dialog opens pre-populated
    const a = account.value;

    contactForm.street_1 = a?.hmstreet1 ?? "";
    contactForm.street_2 = a?.hmstreet2 ?? "";
    contactForm.street_3 = a?.hmstreet3 ?? "";
    contactForm.city     = a?.hmcity ?? "";
    contactForm.state    = a?.hmstate ?? "";
    contactForm.postal_code = a?.hmzip ?? "";

    // phone: prefer the formatted phone; otherwise use raw pieces if you have them
    const p = splitPhone(a?.hmfmtdphn);
    contactForm.phone_area_code = a?.hmphncity ?? p.area ?? "";
    contactForm.phone_local     = a?.hmphnlocal ?? p.local ?? "";
    contactForm.phone_extension = a?.hmphnext ?? "";
    //contactForm.phone_display = a?.hmfmtdphn ?? "";
    //contactForm.mobile_display = a?.hmmobilefmtdphn ?? a?.hmfmtdphn ?? ""; <--see-through phone numbers
    contactDialog.value = true;
  }

  const contactDialog = ref(false)

  function openContactDialog() {
    contactDialog.value = true
  }

  function closeContactDialog() {
    contactDialog.value = false
  }

  const profileDialog = ref(false)

  function openProfileDialog() {
    profileDialog.value = true
  }

  function closeProfileDialog() {
    profileDialog.value = false
  }
  
</script>

<template>
  <div class="account-page">
    <!-- Page title -->
    <h1 class="page-title">My Account</h1>

    <div v-if="loading" style="padding:0 16px;">Loading...</div>
    <div v-if="error" style="padding:0 16px; color:red;">{{ error }}</div>
    <!-- GRID -->
    <div class="grid">
      
      <!-- Profile across both columns -->
      <div class="card profile-card">
        <UserRound class="avatar-icon" :size="125" color="#00A5B5" />
        <div class="profile-meta">
          <div class="user-name">{{ account?.fullname ?? "Loading..." }}</div>
          <div class="user-role">Student,<br />Office of Water Programs</div>

          <!--<button class="btn xsmall" @click="openProfileDialog">Edit</button> -->
          <button class="btn xsmall" @click="openContactDialogWithData">Edit</button>
          <!-- <button class="btn xsmall">Edit</button> -->
        </div>
      </div>

      <!-- LEFT COLUMN -->
      <section class="left-col">
        <!-- Contact info -->
        <div class="card contact-card">
          <header class="card-head">
            <div class="head-left">
              <NotebookText :size="26" color="#007C8A" class="head-icon-svg" aria-hidden="true" />
              <h2>Contact Info</h2>
            </div>
            <button class="btn xsmall" @click="openContactDialogWithData">Edit</button>
            <!--<button class="btn xsmall" @click="openContactDialog">Edit</button>
                <button class="btn xsmall">Edit</button> OLD UNEEDED "Edit" button functionality-->
          </header>

          <div class="divider"></div>

          <div class="contact-body">
            <div class="row">
              <div class="field">
                <div class="label">Email</div>
                <div class="value">
                  {{ account?.hmemail ?? account?.prfdemailval ?? "—" }}
                </div>
                <!--<div class="value">User.Example@owp.csus.edu</div>  HARCODED DONT USE
                    <div class="value">(xxx) - xxx - xxxx</div>         HARDCODED DONT USE #nums-->
              </div>
            </div>

            <div class="row two">
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">
                  {{ account?.hmfmtdphn ?? "—" }}
                </div>
              </div>
              <div class="field">
                <div class="label">Mobile</div>
                <div class="value">
                  {{ account?.hmfmtdphn ?? "—" }}
                </div>
              </div>
            </div>

            <div class="row">
              <div class="field">
                <div class="label">Address</div>
                <div class="value">
                  {{ account?.hmstreet1 ?? "—" }}<br />
                  {{ account?.hmcity ?? "" }}{{ account?.hmstate ? ", " + account.hmstate : "" }}
                  {{ account?.hmzip ?? "" }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Operator numbers -->
        <div class="card operator-card">
          <header class="card-head slim">
            <div class="head-left">
              <Hash :size="22" color="#007C8A" class="head-icon-svg" aria-hidden="true" />
              <h2>Operator Numbers</h2>
            </div>
            <router-link
              to="/operatornumbers"
              class="btn-link-OPnumbers-button"
              :class="{ active: route.name === 'OperatorNumbers' }"
            >
            <button class="btn xsmall">Edit</button>
            </router-link>
          </header>

          <div class="divider"></div>

          <div class="op-line">
          <span class="label">Operator numbers:</span>

          <template v-if="operatorList.length">
            <span v-for="(op, i) in operatorList" :key="op.oprlicid">
              <a href="#" class="link">
                {{ op.stateid }}-{{ op.operatornumber }}
              </a>
              <span v-if="i < operatorList.length - 1">, </span>
            </span>
          </template>

          <span v-else>—</span>
          </div>
        </div>
      </section>

      <!-- RIGHT COLUMN -->
      <aside class="right-col">
        <!-- Transcripts -->
        <div class="side card">
        <header class="side-head">
          <FileText :size="26" color="#007C8A" class="side-icon-svg" aria-hidden="true" />
          <h3>Transcripts</h3>
        </header>

        <div class="divider"></div>
        
        

        <ul class="side-links">
          <li><a href="#">View Transcript</a></li>
          <li><a href="#">Purchase Transcript</a></li>
        </ul>
            <div class="view-all">
            <div class="text">(View all transcripts)</div>
          </div>
        </div>

        <!-- Purchase history -->
        <div class="side card">
          <header class="side-head">
            <History :size="26" color="#007C8A" class="side-icon-svg" />
            <h3>Purchase History</h3>
          </header>

          <div class="divider"></div>

          <ul class="side-links">
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 1</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 2</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 3</a></li>
            <li><a href="#">Industrial Waste Treatment, Vol 1</a></li>
          </ul>

          <div class="view-all">
            <router-link
              to="/purchase-history"
              class="purchase-history-button"
              :class="{ active: route.name === 'PurchaseHistory' }"
            >
            <div class="text">(View all purchases)</div>
            </router-link>
          </div>
        </div>
      </aside>
    </div>
  </div>

      <!-- Contact Info Dialog (pasted from HeaderComponent.vue) -->
  <transition name="fade">
    <div class="contact-info-dialog" v-if="contactDialog">
      <div class="dialog">
        <div class="header">
          <SquareUserRound class="icon" color="#034750"/>
          <div class="text">User</div>
        </div>
        <div class="divider2"></div>
        <div class="body">
          <div class="object">
            <div class="left">
              <div class="text">Email</div>
              <input type="text" :value="account?.hmemail ?? account?.prfdemailval ?? ''" class="input-large" disabled />
            </div>
            <div class="right"></div>
          </div>
          <div class="object">
            <div class="left">
              <div class="text">Phone</div>
              <input type="text" v-model="contactForm.phone_area_code" class="input-medium" placeholder="415" />
              <input type="text" v-model="contactForm.phone_local" class="input-large" placeholder="8669053" />
            </div>
            <div class="right">
              <div class="text">Mobile</div>
              <input type="text" v-model="contactForm.phone_area_code" class="input-medium" placeholder="415" />
              <input type="text" v-model="contactForm.phone_local" class="input-large" placeholder="8669053" />
            </div>
          </div>
          <div class="object-large">
            <div class="left">
              <div class="text">Address</div>
              <input type="text" v-model="contactForm.street_1" class="input-large" placeholder="Street address" />
              <div class="whitespace"></div>
              <input type="text" v-model="contactForm.city" class="input-large" placeholder="City" />
            </div>

            <div class="right">
              <div class="whitespace"></div>
              <input type="text" v-model="contactForm.street_2" class="input-medium" placeholder="Apt / Suite (optional)" />
              <div class="whitespace"></div>
              <div class="right-subdiv">
                <input type="text" v-model="contactForm.state" class="input-tiny" placeholder="CA" />
                <input type="text" v-model="contactForm.postal_code" class="input-small" placeholder="95819" />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="cancel" @click="closeContactDialog">Cancel</div>
          <div class="save" @click="closeContactDialog">Save</div>
        </div>
      </div>
    </div>
  </transition>

    <!-- Profile Dialog -->
  <transition name="fade">
    <div class="contact-info-dialog" v-if="profileDialog">
      <div class="dialog">
        <div class="header">
          <SquareUserRound class="icon" color="#034750"/>
          <div class="text">Edit Profile</div>
        </div>

        <div class="divider2"></div>

        <div class="body">
          <div class="object">
            <div class="left">
              <div class="text">Name</div>
              <input type="text" placeholder="Loading..." class="input-large"/>
            </div>
            <div class="right"></div>
          </div>

          <div class="object">
            <div class="left">
              <div class="text">Role</div>
              <input type="text" placeholder="Student" class="input-large"/>
            </div>
            <div class="right">
              <div class="text">Department</div>
              <input type="text" placeholder="Office of Water Programs" class="input-large"/>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="cancel" @click="closeProfileDialog">Cancel</div>
          <div class="save" @click="closeProfileDialog">Save</div>
        </div>
      </div>
    </div>
  </transition>
  
</template>

<style scoped>
/* ===== Page frame ===== */
.account-page {
  display:grid;
  grid-template-rows:auto 1fr;
  row-gap:32px;
  justify-content:center;
  align-items:start;
  padding:16px 0 42px; 
  color:#034750;
}
.page-title {
  justify-self: start;      
  width: 1016px;             
  padding: 0 16px;           
  margin: 0 0 0 0;       /* tighten below THE TITLE's spacing */
  font-size: 28px;
  font-weight: 800;
  color:#034750;
  align-self: end;
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: 700px 300px;                  
  grid-template-areas:
    "profile profile"
    "left    right";
  column-gap: 16px;                                    
  row-gap: 16px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Areas */
.profile-card {
  grid-area: profile;
  display: grid;
  grid-template-columns: 130px 1fr; /** space between profile icon and Username Student, Office of Water Programs*/
  column-gap: 16px;
  align-items: center;
}
.left-col { 
  grid-area: left; 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}
.right-col { 
  grid-area: right; 
  display: flex; 
  flex-direction: 
  column; 
  gap: 16px; 
}

/* ===== Cards ===== */
.card {
  background: #F2F1F2;
  border-radius: 14px;
  padding: 16px;
  transition: none;                     
}


/* Profile content */
.avatar-icon { 
  align-self: center; 
}
.profile-meta { /** Fixed the edit button glitch by shoving everything to the left of the profile card */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* forces everything inside, including the button, to left-align */
  gap: 6px;
}
/*
.profile-meta { 
  display: grid; 
  align-content: start; 
  gap: 6px; 
  position: relative;
} */
.user-name { 
  font-weight: bold; 
  font-size: 28px; 
  color: #00A5B5; 
}
.user-role { 
  font-size: 16px; 
  color: #707070; 
  line-height: 1.5; 
}

/* Button(s) */
.btn {
  background:#00A5B5; 
  color:#fff; 
  border:0; 
  border-radius:12px; 
  cursor:pointer; 
  align-self:start;
}
.btn.xsmall { 
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 16px;
}
.btn:hover { background: #007C8A; }

/* ===== Contact/Operator headers ===== */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 6px 10px;
}
.card-head.slim { margin-bottom: 4px; }
.head-left { display: flex; align-items: center; gap: 8px; }
.head-icon-svg { display: inline-block; }
.card-head h2 { margin: 0; font-size: 20px; font-weight: 800; color: #034750; }

/* Divider(s) */
.divider { 
  border-top: 1px solid #FFFFFF; 
  margin: 12px 0; 
  height: 0; 
}
.card .divider {
  margin-left: -14px;
  margin-right: -18px;
}

/* Contact body */
.contact-body { 
  background: transparent; 
  border-radius: 18px; 
  padding: 16px 18px; 
}
.row { 
  margin-bottom: 12px; 
}
.row.two { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 18px; 
}
.field .label { 
  font-size: 18px; 
  color:#034750; 
  margin-bottom: 2px; 
  font-weight: 600; 
}
.field .value { 
  font-size: 16px; 
  color:#707070; 
}

/* Operator numbers */
.operator-card { 
  padding: 10px 14px 14px; 
}
.op-line { 
  position: relative; 
  z-index: 1; 
  margin: 8px 8px 4px; 
  color: #3a4e51; 
  font-size: 16px;
  padding: 16px 18px; /** Matches with contact-body */
}
.op-line .label { 
  color: #034750;
  font-weight: bold;
  margin-right: 6px; 
}
.op-line a { 
  color: #034750;
  text-decoration: none; 
}
a:hover { text-decoration: underline; }
.operator-card .divider { 
  position: relative; 
  z-index: 0; 
}

/* ===== Right column panels ===== */
.side.card { 
  overflow: hidden;
}
.side { 
  padding: 16px 18px; 
}
.side-head { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin: 6px 6px 10px; 
}
.side-icon-svg { 
  display: inline-block; 
}
.side-head h3 { 
  margin: 0; 
  font-size: 20px; 
  font-weight: 800; 
  color: #034750; 
}

.side-links {
  list-style:none;
  margin: 0 0 24px 0;  /** Make's padding/grey space between view all & side-links */              
  padding: 0;
  display: grid;
  gap: 0;
}
/* More space in Purchase History only */
.right-col .side:last-child .side-links { 
  margin-bottom: 102px; 
}
.side-links li {
  margin: 0 -18px;           /* full-bleed to card's edge (matches divider bleed) */
  padding: 8px 20px;         /* fits the hover grey box in side-links */
  border-radius: 0;
}
.side-links li:hover{ background:#D9D9D9; } /* rectangular hover like Dashboard */

.side-links a{
  display:block;
  text-decoration:underline;
  color:#007C8A;
  font-size: 16px;           /* Makes Transcipt and Purchase History size match mockup */
}
.side-links a:hover{ color:#034750; }

.view-all{
  display:flex; justify-content:center; align-items:flex-end;
}
.view-all .text{
  font-size:20px; color:#034750; cursor:pointer; transition:color .2s;
}
.view-all .text:hover{ text-decoration:underline; color:#007C8A; }

/* Links & small tweaks */

.card :where(h2, h3) { letter-spacing: .2px; }

/* ===== Responsive =====  ||| REMOVE IF NOT REQUIRED ADAPTS THE PAGE WHEN MANIPULATED ( e.g. MINIMIZED) */ 
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "profile"
      "left"
      "right";
    column-gap: 0;
  }
  /* remove right trim when there’s no right column */
  .profile-card { padding-right: 28px; }
}



/* ===== Pasted from HeaderComponent.vue for dialog + fade ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.divider2 {
  border-top: 1px solid #C2C2C2;
}

.contact-info-dialog {
  position: fixed;
  z-index: 200;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0000009a;
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
}

.contact-info-dialog .dialog {
  width: 700px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  border: #707070 solid 1px;
  background-color: #FEFEFE;
}

.contact-info-dialog .dialog .header {
  width: 100%;
  height: 85px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border-radius: 14px;
  background-color: #FEFEFE;
}

.contact-info-dialog .dialog .header .icon {
  width: 40px;
  height: 40px;
  margin-left: 16px;
}

.contact-info-dialog .dialog .header .text {
  height: 16px;
  margin-left: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #034750;
}

.contact-info-dialog .dialog .body {
  height: 386px;
  margin-top: 32px;
  margin-left: 32px;
  margin-right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contact-info-dialog .dialog .body .text{
  height: 16px;
  font-size: 18px;
  font-weight: 600;
  line-height: 8px;
  color: #034750;
}

.contact-info-dialog .dialog .input-large {
  width: 306px;
  height: 31px;
  font-size: 15px;
  font-weight: 400;
  border: 0.75px solid #747474;
  border-radius: 4px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .body .input-medium{
  width: 176px;
  height: 31px;
  font-size: 15px;
  font-weight: 400;
  border: 0.75px solid #747474;
  border-radius: 4px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .body .input-small{
  width: 100px;
  font-size: 15px;
  font-weight: 400;
  border: 0.75px solid #747474;
  border-radius: 4px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .body .input-tiny{
  width: 31px;
  font-size: 15px;
  font-weight: 400;
  border: 0.75px solid #747474;
  border-radius: 4px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .whitespace{
  width: 100%;
  height: 16px;
}

.contact-info-dialog .dialog .body .object {
  width: 100%;
  height: 78px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .body .object-large {
  width: 100%;
  height: 109px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
}

.contact-info-dialog .dialog .body .left{
  width: 50%;
  height: 78px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.contact-info-dialog .dialog .body .right{
  width: 50%;
  height: 78px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.contact-info-dialog .dialog .body .object-large .right .right-subdiv{
  width: 176px;
  height: 31px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.contact-info-dialog .dialog .bottom{
  height: 29;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 32px;
}

.contact-info-dialog .dialog .bottom .cancel{
  width: 306px;
  height: 29px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  background-color: #C2C2C2;
  cursor: pointer;
}

.contact-info-dialog .dialog .bottom .save{
  width: 306px;
  height: 29px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  color: #FFFFFF;
  background-color: #00A5B5;
  cursor: pointer;
}
</style>

