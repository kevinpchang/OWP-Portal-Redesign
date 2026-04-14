<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'

  //API Integrations
  import * as api from "@/services/owpAPI"

  import mail from '@/assets/icons/owp-2color/mail-icon.svg'
  import certificate from '@/assets/icons/owp-2color/certificate-icon.svg'

  const pid = 458860;
  const error = ref("");
  const opNum = ref("");
  const state = ref("");
  const certificatesError = ref("");
  const messagesError = ref("");
  const loading = ref(false);
  const loadingMessages = ref(false);
  const loadingCertificates = ref(false);

  // Failure Checking
  const hadFailure = ref(false);

  const nums = ref([]);
  const messages = ref([]);
  const certificates = ref([]);
  const enrollments = ref([]);

  const editState = ref("")
  const editOpNum = ref("")
  const addState = ref("")
  const addOpNum = ref("")

  //const addState = ref("")
  const states = {"AL": "Alabama", "AK": "Alaska", "AS":"American Samoa", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", 
                  "DC":"District of Columbia", "FL": "Florida", "GA": "Georgia","GU":"Guam", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", 
                  "LA": "Louisiana", "ME": "Maine", "MH":"Marshall Islands", "MD": "Maryland","MA": "Massachusetts", "MI": "Michigan", "FM":"Micronesia", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", 
                  "MT": "Montana", "MP":"N. Mariana Islands", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey","NM": "New Mexico", "NY": "New York", "NC": "North Carolina", 
                  "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PW":"Palau", "PA": "Pennsylvania", "PR":"Puerto Rico", "RI": "Rhode Island", "SC": "South Carolina",
                  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI":"Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", 
                  "WI": "Wisconsin","WY":"Wyoming"}
  const territories = {"AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfound & Labrador", "NT": "Northwest Territories", 
                      "NS": "Nova Scotia", "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "YT": "Yukon"}

  async function loadTable() {
    console.log("loadTable called");
    loading.value = true;
    error.value = "";


    try {
      try {
        const opNums = await api.getOperatorList(pid);
        //const data = await opNums.json();
        nums.value = opNums.response;
      }
      catch {
        hadFailure.value = true;
        nums.value = api.loadFromSession("getOperatorList") ?? [];
      }
      
      //console.log("Operator Numbers JSON:", nums.value);

      opNum.value = nums.value?.oprlicid ?? ""
      state.value = nums.value?.state ?? ""

      console.log("Numbers loaded");

      await Promise.all([
        loadMessages(),
        loadCertificates(),
      ]);

    } catch (e) {
      error.value = e?.message ?? String(e);
      console.log("Error loading operator numbers:", error.value);
    } finally {
      loading.value = false;
    }
  }

  async function addNumber(){

    const original = nums.value[0]
    let ctid = 1

    if (Object.hasOwn(territories, addState.value)) {
      ctid = 2
    }

    const payload = {
      liccatid: 1,
      countryid: ctid,
      status: "A",
      operatornumber: addOpNum.value,
      state: addState.value,
      ipAddr: "localhost"
    };



    try{
      //payload needs to have: liccatid, countryid, state, status, operatornumber, ipAddr
      await api.addOperator(payload);
      //console.log("addNumber called with payload:", payload);
    } catch (e) {
      error.value = e?.message ?? String(e);
      alert("Error adding an Operator Number. Please wait a moment and try again. If problem persists contact a site admin.");
      console.log("Error adding operator number:", error.value);
    }

    addPopup.value = false
    window.location.reload()
  }

  async function updateNumber(){

    const original = nums.value.find(
      item => item.oprlicid === selectedRow.value
    )

    if (!original) return

    const payload = {
      oprlicid: original.oprlicid,
      liccatid: original.liccatid,
      countryid: original.countryid,
      status: original.oprlicstatus,
      operatornumber: editOpNum.value,
      state: editState.value,
      ip: "localhost"
    }


    try{
      //payload needs to have: oprlicid, liccatid, countryid, state, status, operatornumber, ipAddr
      await api.updateOperatorNumber(payload);
      //console.log("updateNumber called with payload:", payload);
    } catch (e) {
      error.value = e?.message ?? String(e);
      alert("Error updating an Operator Number. Please wait a moment and try again. If problem persists contact a site admin.");
      console.log("Error updating operator number:", error.value);
    }

    editPopup.value = false
    window.location.reload()
  }

  async function deleteNumber(){

    const original = nums.value.find(
      item => item.oprlicid === selectedRow.value
    )

    if (!original) return
    
    try{
    
      await api.deleteOperator("localhost", original.oprlicid, pid);
      //console.log("deleteNumber called with ip:", "localhost", "and id:", original.oprlicid);
    } catch (e) {
      alert("Error deleting an Operator Number. Please wait a moment and try again. If problem persists contact a site admin.");
      error.value = e?.message ?? String(e);
      console.log("Error deleting operator number:", error.value);
    }

    deletePopup.value = false
    window.location.reload()
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

  async function loadCertificates() {
    loadingCertificates.value = true;
    certificatesError.value = "";
    
    try {
      const enr = await api.getActiveEnrollment(pid);
      enrollments.value = enr.response ?? [];
    }
    catch {
      hadFailure.value = true;
      enrollments.value = api.loadFromSession("getActiveEnrollment") ?? [];
    }

    try {
      const rows = enrollments.value ?? [];
      certificates.value = rows;

      const transcriptRows = rows.filter(
        (r) => r.grade === "CR "
      );

      certificates.value = transcriptRows.map((r) => ({
        key: r.enrollid,
        title: r.title || "Course title unavailable",
        routeTo: "/Certificates",
      }));
    } catch (e) {
      certificatesError.value = e?.message ?? "load-failed";
      console.log(e);
      certificates.value = [];
    } finally {
      loadingCertificates.value = false;
    }
  }

  //hide/show popups
  const addPopup = ref(false)
  function openAdd() {
    addPopup.value = true
  }

  function closeAdd() {
    addPopup.value = false
  }

  const editPopup = ref(false)
  const selectedRow = ref(null)
  function openEdit(oprlicid) {
    selectedRow.value = oprlicid

    const entry = nums.value.find(
      item => item.oprlicid === oprlicid
    )

    if (!entry) return

    editState.value = entry.stateid
    editOpNum.value = entry.operatornumber

    editPopup.value = true
  }

  function closeEdit() {
    editPopup.value = false
  }

  const deletePopup = ref(false)
  function openDelete(oprlicid) {
    selectedRow.value = oprlicid

    const entry = nums.value.find(
      item => item.oprlicid === oprlicid
    )

    if (!entry) return

    deletePopup.value = true
  }

  function closeDelete() {
    deletePopup.value = false
  }

  import { useRoute } from 'vue-router'
  import { Award, GalleryVerticalEnd, Mail, History } from 'lucide-vue-next';
  import { isParameter } from 'typescript';
  const route = useRoute()

  onMounted(async () => {
    await loadTable();
    if (hadFailure.value) { alert('Some data could not be refreshed. Showing saved session data where available which may be old. Refresh the page to attempt to fetch new data.'); }
  });
  

</script>

<template>
  <div class="operator-numbers-page">
    <div class="left-column">
      <div class="header-container">
        <div class="title">Operator Numbers</div> 
        <p class="description">View and edit your Operator Numbers</p>
        <button class = add-button @click.left="openAdd">Add Operator Number</button>
      </div>

      <!--Table needs to populate based on GET from database api/v1/account/getOperatorList/{pid}-->
      <div name="table">
        <table>
          <thead class="table-header">
            <tr>
                <th style="width: 10%;">State/Province</th>
                <th style="width: 35%;">Operator Number</th>
                <th></th>
            </tr>
          </thead>
          <tbody class="table-body">
            <tr v-if="nums.length === 0">
              <td colspan="3" style="text-align: center; padding: 20rem;">No operator numbers available.</td>
            </tr>
            <tr v-for="entry in nums" :key="entry.oprlicid">
              <td class="state">{{ entry.state }}</td>
              <td class="number">{{ entry.operatornumber }}</td>
              <td>
                <button class="edit-button" @click.left="openEdit(entry.oprlicid)">Edit</button>
                <button class="remove-button" @click.left="openDelete(entry.oprlicid)">Remove</button>
              </td>
            </tr>
          <!--
            <tr>
              <td>California</td>
              <td>12345</td>
              <td>
                <button class="edit-button" @click.left="openEdit">Edit</button>
                <button class="remove-button" @click.left="openDelete">Remove</button>
              </td>
            </tr>
            <tr>
              <td>Colorado</td>
              <td>67890</td>
              <td>
                <button class="edit-button" @click.left="openEdit">Edit</button>
                <button class="remove-button" @click.left="openDelete">Remove</button>

              </td>
            </tr>
            <tr>
              <td>Washington</td>
              <td>59746</td>
              <td>
                <button class="edit-button" @click.left="openEdit">Edit</button>
                <button class="remove-button" @click.left="openDelete">Remove</button>
              </td>
            </tr>
            -->
          </tbody>
        </table>
      </div>
    </div>


    <div class="quick-links">
      <div class="messages">
        <div class="header">
          <img :src="mail" class="icon" />
          <div class="text">Messages</div>
        </div>
        <div class="divider"></div>
        <div class=" side-links body">
          <div v-if="loadingMessages" class="notext">
            Loading messages…
          </div>

          <div v-else-if="messagesError" class="notext">
            We couldn’t load your messages right now.
          </div>

          <div v-else-if="messages.length === 0" class="notext">
            No messages available.
          </div>

          <template v-else>
            <div
              v-for="message in messages"
              :key="message.id"
              class="object text"
            >
              {{ message.subject || "Message unavailable" }}
              <span v-if="message.date">({{ message.date }})</span>
            </div>
          </template>
        </div>
        <router-link to="/messages" class="view-all">
          <a class="text messages-link">(View all messages)</a>
        </router-link>
      </div>

      <div class="purchase-history">
        <div class="header">
          <img :src="certificate" class="icon" />
          <div class="text">Certificates</div>
        </div>
        <div class="divider"></div>
        <ul class="body side-links">
          <!--
          <div class="object"><div class="text">Waste Water 1 Certificate</div></div>
          <div class="object"><div class="text">Waste Water 2 Certificate</div></div>
          <div class="object"><div class="text">Utility 1 Certificate </div></div>
          <div class="object"><div class="text">Utility 2 Certificate </div></div>
          -->
          <li v-if="loadingCertificates"><span class="notext">Loading certificates…</span></li>
          <li v-else-if="certificatesError"><span class="notext">Couldn’t load certificates.</span></li>
          <li v-else-if="certificates.length === 0"><span class="notext">No certificates available.</span></li>

          <li v-else v-for="t in certificates" :key="t.key">
            <router-link :to="t.routeTo" class="side-link">
              {{ t.title }}
            </router-link>
          </li>
        </ul>
        <router-link to="/Certificates" class="view-all">
          <a class="text certificates-link">(View all certificates)</a>
        </router-link>
      </div>
    </div>

    <transition name="fade">
      <div class="popup" v-if="addPopup">
        <div class="blur-overlay"></div>
        <div class="inner">
          <div class="header">
            <div class="left">
              <img src="../assets/owp_logo.png"/>
            </div>
          </div>
          <div class="form-container">
            <h1 class="popup-title">
              Add Operator Number
            </h1>
            <select id="state" class="input-box" v-model="addState">
              <option disabled value="">Select State/Province</option>
              <optgroup label="United States">
                <option v-for="(name, abbr) in states":key="abbr":value="abbr">
                  {{ name }}
                </option>
              </optgroup>
              <optgroup label="Canada">
                <option v-for="(name, abbr) in territories":key="abbr":value="abbr">
                  {{ name }}
                </option>
              </optgroup>
              
              <!-- Add more as needed -->
            </select><br><br>
            <input type="text" id="opnum" class="input-box" placeholder="Operator Number" v-model="addOpNum"><br><br>
            <!-- Method=POST for button /api/v1/account/addOperator-->
            <button class = popup-button-left @click="addNumber">Add</button>
            <button class = popup-button-right @click="closeAdd">Cancel</button>

          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="popup" v-if="editPopup">
        <div class="blur-overlay"></div>
        <div class="inner">
          <div class="header">
            <div class="left">
              <img src="../assets/owp_logo.png"/>
            </div>
          </div>
          <div class="form-container">
            <h1 class="popup-title">
              Edit Operator Number
            </h1>
            <input type="text" id="state" class="input-box" placeholder="State/Province Abbreviation" v-model="editState"><br><br>
            <input type="text" id="opnum" class="input-box" placeholder="Operator Number" v-model="editOpNum"><br><br>
            <!-- Method=POST for button /api/v1/account/updateOperatorNumber-->
            <button class = popup-button-left @click="updateNumber">Edit</button>
            <button class = popup-button-right @click="closeEdit">Cancel</button>

          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="popup" v-if="deletePopup">
        <div class="blur-overlay"></div>
        <div class="inner">
          <div class="header">
            <div class="left">
              <img src="../assets/owp_logo.png"/>
            </div>
          </div>
          <div class="form-container">
            <h1 class="popup-title">
              Remove Operator Number
            </h1>
            <p class="popup-text">Are you sure you want to remove the Operator Number?</p>
            <!-- Method=GET for buttons api/v1/account/deleteOperator/{ip}/{id}/{pid}-->
            <button class = popup-button-left @click="deleteNumber">Yes</button>
            <button class = popup-button-right @click="closeDelete">No</button>

          </div>
        </div>
      </div>
    </transition>

  </div>
</template>


<style scoped>
  .operator-numbers-page {
    display: grid;
    grid-template-rows: auto 1fr;
    justify-content: center;
    gap: 20rem;
    height: 100vh;
    background-color: #fff;
    box-sizing: border-box;
  }

  .header-container {
    grid-column: 1 / 2;
    display: flex;
    flex-direction: row;
    gap: 8rem;
    margin-top: 25rem;
  }

  .title {
    width: 331rem;
    height: 28rem;
    display: flex;
    margin-left: 2%;
    font-family: 'Roberto', sans-serif;
    font-size: 28rem;
    font-weight: 790;
    color: #034750;
    align-items: center;
  }

  .description {
    font-family: 'Roberto', sans-serif;
    display:flex;
    font-size: 17rem;
    font-weight: 400;
    color: #034750;
    margin-top:45rem;
    margin-left: -337rem;
  }

  .divider{
    border:1rem solid white;
  }

  .add-button {
    background-color: #48773C;
    padding: 15rem 15rem;
    border: none;
    /*width:15%;*/
    border-radius: 10rem;
    font-family: 'Roberto', sans-serif;
    color: white;
    margin-left: 228rem;
    margin-bottom: 20rem;
  }

  .add-button:hover{
    background-color: #253e1f;
  }

  .edit-button{
    width: 75rem;
    border-radius: 8rem;
    border: none !important;
    font-family: 'Roberto', sans-serif;
    font-size: 17rem;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #D97A27;
    cursor: pointer;
  }

  .remove-button{
    width: 80rem;
    float:right;
    border-radius: 8rem;
    border: none !important;
    font-family: 'Roberto', sans-serif;
    font-size: 17rem;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #9F3323;
    cursor: pointer;
  }

  .popup-button-left{
    margin-left: 15rem;
    margin-top:15rem;
    background-color: #48773C;
    padding:15rem 15rem;
    border:none;
    border-radius: 10rem;
    font-family: 'Roberto', sans-serif;
    color:white
  }

  .popup-button-right{
    margin-left: 45%;
    margin-top:15rem;
    background-color: #48773C;
    padding:15rem 15rem;
    border:none;
    border-radius: 10rem;
    font-family: 'Roberto', sans-serif;
    color:white
  }

  .table-header {
    font-family: 'Roberto', sans-serif;
    font-size: 20rem;
    font-weight: 600;
    color: #034750;
    margin: 0;
  }

  .table-body {
    font-family: 'Roberto', sans-serif;
    font-size: 17rem;
    font-weight: 400;
    color: #034750;
    margin: 0;
  }

  table {
    /*margin-top: 30rem;*/
    border-collapse: collapse;
    width: 700rem;
    background-color: #f2f1f2;
    border-radius: 14rem;
    overflow: hidden;
  }

  th, td {
    text-align: left;
    padding: 12rem 16rem;
    border-right: 1rem solid #ccc;
  }

  th:last-child,
  td:last-child {
      border-right: none;
  }

  th {
    background-color: #f2f1f2;
    color: #004d4d;
    font-weight: 400rem;
    border-bottom: 1rem solid #ccc;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    border-bottom: 1rem solid #ddd;
  }

  .blur-overlay {
    position: fixed;
    inset: 0;
    width:100vw;
    height:100vh;
    background-color: #0000009a; /* slight tint */
    backdrop-filter: blur(9rem);
    -webkit-backdrop-filter: blur(9rem);
    z-index: -99999; /* below the popup */
  }

  .popup{
    margin-top: 10%;
    margin-left: 25%;
    width: 20%;
    height: 35%;
    position: fixed;
    z-index: 999;
    border:none;
    border-radius: 10rem;
    background-color: #f2f1f2;
  }

  .popup .inner{
    background-color: #f2f1f2;
    border:none;
    height:95%;
    border-radius: 10rem;
    background-color: #f2f1f2;
  }

  .popup .header {
    width: 100%;
    height: 15%;
    display: flex;
    flex-direction: row;
    border-top: #034750;
    border-top-left-radius: 10rem;
    border-top-right-radius: 10rem;
    align-items: center;
    justify-content: space-between;
    background-color: #034750;
  }

  .popup .header .left > img {
    width: 316.96rem;
    height: 41.08rem;
    object-fit: scale-down;
    object-position: center;
    display: block;
  }


  .popup-title{
    margin-left: 20rem;
    margin-top: 20rem;
    font-family: 'Roberto', sans-serif;
    font-size: 28rem;
    font-weight: 790;
    color: #034750;
    align-items: center;
  }

  .popup-text{
    font-family: 'Roberto', sans-serif;
    font-size: 17rem;
    margin-left: 20rem;
  }

  .input-box {
    width: 80%;
    height: 60rem;
    margin-left: 15rem;
    margin-top: 15rem;
    background-color: #e8e8e8; /* light gray background */
    border: none;
    border-radius: 8rem; /* rounded corners */
    font-size: 18rem;
    padding: 0 20rem;
    box-sizing: border-box;
    color: #555;
  }

  .input-box::placeholder {
    color: #ccc;
    font-size: 18rem;
  }

  .input-box:focus {
    outline: none;
    background-color: #e1e1e1;
  }

  .quick-links {
    grid-column: 2 / 3;
    display: flex;
    margin-top: 106rem;
    width: 300rem;
    flex-direction: column;
    gap: 16rem;
    top: 40rem;
  }

  .object{
    height: 40rem;
  }

  .object:hover {
    cursor: pointer;
    background-color: #D9D9D9;
  }

  .messages {
    height: 240rem;
    border-radius: 14rem;
    display: flex;
    flex-direction: column;
    background-color: #F2F1F2;
  }

  .messages .header {
    height: 68rem;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .messages .header .icon {
    width: 26.53rem;
    height: 33.67rem;
    border-radius: 4rem;
    margin-top: 9.53rem;
    margin-left: 23.55rem;
  }

  .messages .header .text {
    height: 20rem;
    font-size: 20rem;
    font-weight: 700;
    margin-top: 15rem;
    margin-left: 8rem;
    color: #034750;
  }

  .messages .body {
    height: 172rem;
    display: flex;
    flex-direction: column;
  }

  .messages .body .text {
    height: 14rem;
    margin-top: 10rem;
    margin-left: 24rem;
    font-size: 16rem;
    font-weight: 400;
    /* text-decoration: underline; */
    color: #007C8A;
  }

  .messages .body .notext {
    height: 14rem;
    margin-top: 10rem;
    margin-left: 24rem;
    font-size: 16rem;
    font-weight: 400;
    /* text-decoration: underline; */
    color: #000000;
  }

  .messages .view-all {
    height: 32rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .side-links {
    list-style:none;
    margin: 0 0 24rem 0;  /** Make's padding/grey space between view all & side-links */
    padding: 0;
    display: grid;
    gap: 0;
  }

  .side-links li {
    margin: 0 0;           /* full-bleed to card's edge (matches divider bleed) */
    padding: 8rem 20rem;         /* fits the hover grey box in side-links */
    border-radius: 0;
  }
  .side-links li:hover{ background:#D9D9D9; } /* rectangular hover like Dashboard */

  .side-links a{
    display:block;
    text-decoration:underline;
    color:#007C8A;
    font-size: 16rem;           /* Makes Transcipt and Purchase History size match mockup */
  }
  .side-links a:hover{ color:#034750; }

  .side-link {
    display: block;
    margin-left: 15rem;
    text-decoration: underline;
    color: #007C8A;
    font-size: 16rem;
  }

  .side-link:hover {
    color: #034750;
  }

  .messages .view-all .text {
    height: 20rem;
    font-size: 20rem;
    font-weight: 400;
    margin-bottom: 12rem;
    color: #034750;
  }

  .purchase-history {
    height: 400rem;
    border-radius: 14rem;
    display: flex;
    flex-direction: column;
    background-color: #F2F1F2;
  }

  .purchase-history .header {
    height: 68rem;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .purchase-history .header .icon {
    width: 26.53rem;
    height: 33.67rem;
    border-radius: 4rem;
    margin-top: 9.53rem;
    margin-left: 23.55rem;
  }

  .purchase-history .header .text {
    height: 20rem;
    font-size: 20rem;
    font-weight: 700;
    margin-top: 15rem;
    margin-left: 8rem;
    color: #034750;
  }

  .purchase-history .body {
    height: 350rem;
    display: flex;
    flex-direction: column;
  }

  .purchase-history .body .text {
    height: 14rem;
    margin-top: 10rem;
    margin-left: 24rem;
    margin-right: 24rem;
    font-size: 16rem;
    font-weight: 400;
    text-decoration: underline;
    color: #007C8A;
  }

    .purchase-history .body .notext {
    height: 14rem;
    margin-top: 10rem;
    margin-left: 24rem;
    font-size: 16rem;
    font-weight: 400;
    /* text-decoration: underline; */
    color: #000000;
  }

  .purchase-history .view-all {
    height: 32rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .purchase-history .view-all .text {
    height: 20rem;
    font-size: 20rem;
    font-weight: 400;
    margin-bottom: 12rem;
    color: #034750;
  }

  .view-all .text {
    text-decoration: none;
  }

  .view-all .text:hover {
    text-decoration: underline;
    color: #007C8A;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>


