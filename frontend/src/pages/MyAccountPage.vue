<template>
  <div class="account-page">
    <!-- Page title -->
    <h1 class="page-title">My Account</h1>

    <!-- =========== GRID =========== -->
    <div class="grid">

        <!-- Profile header card -->
        <div class="card profile-card">
          <img class="avatar" src="@/assets/lil_guy.png" alt="User avatar" />

          <div class="profile-meta">
            <div class="user-name">User</div>
            <div class="user-role">Student, <br />Office of Water Programs</div>
            <button class="btn small">Edit</button>
          </div>
        </div>

        <!-- ===== LEFT COLUMN ===== -->
        <section class="left-col">
        <!-- Contact info card -->
        <div class="card contact-card">
          <header class="card-head">
            <div class="head-left">
              <!-- 👇 icon placeholder (swap with small <img> if desired) -->
              <div class="head-icon" aria-hidden="true"></div>
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

        <!-- Operator numbers card -->
        <div class="card operator-card">
          <header class="card-head slim">
            <div class="head-left">
              <div class="head-icon small" aria-hidden="true"></div>
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
      

      <!-- ===== RIGHT COLUMN ===== -->
      <aside class="right-col">
        <!-- Transcripts panel -->
        <div class="side card">
          <header class="side-head">
            <!-- 👇 icon placeholder -->
            <div class="side-icon" aria-hidden="true"></div>
            <h3>Transcripts</h3>
          </header>

          <div class="divider"></div>

          <ul class="side-links">
            <li><a href="#">View Transcript</a></li>
            <li><a href="#">Purchase Transcript</a></li>
          </ul>

          <div class="side-foot">(View all messages)</div>
        </div>

        <!-- Purchase history panel -->
        <div class="side card">
          <header class="side-head">
            <div class="side-icon purchase" aria-hidden="true"></div>
            <h3>Purchase History</h3>
          </header>

          <div class="divider"></div>

          <ul class="side-links">
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 1</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 2</a></li>
            <li><a href="#">Operation of Wastewater Treatment Plants, Vol 3</a></li>
            <li><a href="#">Industrial Waste Treatment, Vol 1</a></li>
          </ul>

          <div class="side-foot">(View all purchases)</div>
        </div>
      </aside>
    </div>
  </div>
</template>


<style scoped>
/* ===== Page frame ===== */
.account-page {
  padding: 16px 30px 32px;
  color: #034750;
  font-family: "Myriad Pro";
}
.page-title {
  max-width: 1280px; /* aligns title text by responding to the grid below it (User info grid) */
  margin: 8px auto 16px;
  font-size: 28px;
  font-weight: 800;
  color: #034750;
}

/* ===== Two-column grid matching mockup widths ===== */
.grid {
  display: grid;
  grid-template-columns: 700px 300px;
  /*grid-template-columns: 2fr 1fr;   more dynamic*/ 
  grid-template-areas:
    "profile profile"  /* profile spans across */
    "left    right";   /* then normal two columns */
  column-gap: 16px;
  row-gap: 16px;       /* add a little vertical spacing */
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}
/* map children to areas */
.profile-card { 
  grid-area: profile;
  width: 100%;
  display: grid;
  grid-template-columns: 88px 1fr;  /* avatar | text */
  column-gap: 16px;
  align-items: center;               /* vertically center avatar + text */
  padding: 24px 28px;                /* restore comfortable padding */
}
/* Keep the Edit button from stretching */
.profile-card .btn {
  justify-self: start;    /* pin to left edge of the text column */
  width: auto;            /* no full-width bar */
  padding: 8px 16px;      /* looks better with a bit more padding */
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
  flex-direction: column; 
  gap: 16px; 
}

/* ===== Cards ===== */
.card {
  background: #F2F1F2;
  border-radius: 24px;
  padding: 14px;
  box-shadow: 0 1px 0 rgba(0,0,0,.02) inset;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #cfe9ec;  /* swap for <img> when ready */
  border: none;
}
.profile-meta {
  display: grid;
  align-content: start;   /* keep content top-aligned within the cell */
  gap: 6px;
}
.user-name {
  font-weight: 800;
  font-size: 28px;
  color: #00A5B5;
}
.user-role {
  font-size: 16px;
  color: #707070;
  line-height: 1.3;
}
.btn {
  align-self: start;
  background: #00A5B5;
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn.small { padding: 6px 10px; border-radius: 10px; }
.btn.xsmall { padding: 4px 8px; border-radius: 10px; font-size: 13px; }

/* ===== Contact card ===== */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 6px 10px;
}
.card-head.slim { margin-bottom: 4px; }
.head-left { display: flex; align-items: center; gap: 8px; }
.head-icon {
  width: 28px; height: 28px; border-radius: 6px; background: #007C8A; /** change "background: " to an image of the contact info icon */
}
.head-icon.small { width: 22px; height: 22px; }
.card-head h2 { margin: 0; font-size: 20px; font-weight: bold; color: #034750; }

.contact-body {
  background: transparent;
  border-radius: 18px;
  padding: 16px 18px;
}
.row { margin-bottom: 12px; }
.row.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.field .label {
  font-size: 18px; color:#034750; margin-bottom: 2px;
  font-weight: 500;
}
.field .value {
  font-size: 14px; color:#707070;
}

/* ===== Operator numbers ===== */
.operator-card { padding: 10px 14px 14px; }
.op-line { margin: 8px 8px 4px; color: #3a4e51; }
.op-line .label { color: #707070; margin-right: 6px; }
.link { color: #007C8A; text-decoration: underline; }
/* Force the line to be visible regardless of any inherited rules 
NEED TO PRODUCE A MORE NEAT WAY TO DO THIS LATER */
::v-deep(.operator-card .op-line),
::v-deep(.operator-card .op-line .label),
::v-deep(.operator-card .op-line .link),
::v-deep(.operator-card .op-line a) {
  display: inline;
  position: relative;
  z-index: 1;
  color: #034750;
  font-size: 16px;
  opacity: 1;
  visibility: visible;
  filter: none;
  mix-blend-mode: normal;
  -webkit-text-fill-color: currentColor;
  text-indent: 0;
  letter-spacing: 0;
  word-spacing: normal;
  text-shadow: none;
  white-space: normal;
}


/* ===== Right column panels ===== */
.side { padding: 12px; }
.side-head { display: flex; align-items: center; gap: 8px; margin: 6px 6px 10px; }
.side-head h3 { margin: 0; font-size: 20px; font-weight: 800; color: #034750; }
.side-icon {
  width: 26px; height: 26px; border-radius: 50%;
  background: #007C8A;
}
.side-icon.purchase { background: #00A5B5; }

.side-links {
  list-style: none;
  padding: 0;
  margin: 0 6px 8px;
  display: grid;
  gap: 8px;
}
.side-links a {
  color: #007C8A;
  text-decoration: underline;
  font-size: 14px;
}
.side-foot {
  text-align: center;
  color: #6c8082;
  font-size: 12px;
  margin: 4px 0 2px;
}

/* ===== Small tweaks / fixes ===== */
a { text-decoration: none; }
a:hover { text-decoration: underline; }
.card :where(h2, h3) { letter-spacing: .2px; }

/* Hover effects */
.card {
  transition: all 0.3s ease;        /* enables the animation */
}

/* Lift any card (profile, contact, operator, side) on hover */
.card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transform: translateY(-3px);
}

/* ===== Divider ===== */
.divider {
  width: 100%;
  height: 0;
  border: 1px solid #FFFFFF;
  margin: 12px 0;
}

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .grid { grid-template-columns: 1fr; column-gap: 0; }
}
</style>
