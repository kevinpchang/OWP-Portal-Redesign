<script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  import { UserRound, NotebookText, Hash, FileText, History } from 'lucide-vue-next'
</script>

<template>
  <div class="account-page">
    <!-- Page title -->
    <h1 class="page-title">My Account</h1>

    <!-- GRID -->
    <div class="grid">
      
      <!-- Profile across both columns -->
      <div class="card profile-card">
        <UserRound class="avatar-icon" :size="125" color="#00A5B5" />
        <div class="profile-meta">
          <div class="user-name">User</div>
          <div class="user-role">Student, <br />Office of Water Programs</div>
          <button class="btn xsmall">Edit</button>
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
            <button class="btn xsmall">Edit</button>
          </header>

          <div class="divider"></div>

          <div class="contact-body">
            <div class="row">
              <div class="field">
                <div class="label">Email</div>
                <div class="value">User.Example@owp.csus.edu</div>
              </div>
            </div>

            <div class="row two">
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">(xxx) - xxx - xxxx</div>
              </div>
              <div class="field">
                <div class="label">Mobile</div>
                <div class="value">(xxx) - xxx - xxxx</div>
              </div>
            </div>

            <div class="row">
              <div class="field">
                <div class="label">Address</div>
                <div class="value">
                  3020 State University Drive<br />
                  Sacramento, CA 95819
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
            <button class="btn xsmall">Edit</button>
          </header>

          <div class="divider"></div>

          <div class="op-line">
            <span class="label">Operator numbers:</span>
            <a href="#" class="link">California-123456</a>
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
</style>

