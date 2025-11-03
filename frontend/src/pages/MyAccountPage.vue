<template>
  <div class="account-page">
    <!-- Page title -->
    <h1 class="page-title">Placeholder Title Text</h1>

    <!-- =========== GRID =========== -->
    <div class="grid">
      <!-- ===== LEFT COLUMN ===== -->
      <section class="left-col">

        <!-- Profile header card -->
        <div class="card profile-card">
          <img class="avatar" src="@/assets/lil_guy.png" alt="User avatar" />

          <div class="profile-meta">
            <div class="user-name">User</div>
            <div class="user-role">Student, <br />Office of Water Programs</div>
            <button class="btn small">Edit</button>
          </div>
        </div>

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

          <div class="op-line">
            <span class="label">Operator numbers:</span>
            <a href="#" class="link">California-123456a</a>
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
  padding: 16px 18px 32px;
  color: #034750;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
}
.page-title {
  margin: 8px 0 16px 260px; /* pushed right to clear sidebar column visually */
  font-size: 28px;
  font-weight: 800;
  color: #034750;
}

/* ===== Two-column grid matching your mockup widths ===== */
.grid {
  display: grid;
  grid-template-columns: 700px 300px;
  column-gap: 16rem; /* you used 16rem elsewhere; keeps same spacing */
  max-width: 1280px;
  margin: 0 auto;
}
.left-col,
.right-col {
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

/* ===== Profile header ===== */
.profile-card {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 18px;
}
.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #cfe9ec; /* 👈 swap for <img> when ready */
  border: 4px solid #007C8A;
}
.profile-meta {
  display: grid;
  align-items: start;
  gap: 6px;
}
.user-name {
  font-weight: 800;
  font-size: 22px;
  color: #00A5B5;
}
.user-role {
  font-size: 14px;
  color: #4c6b6f;
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
  width: 28px; height: 28px; border-radius: 6px; background: #007C8A;
}
.head-icon.small { width: 22px; height: 22px; }
.card-head h2 { margin: 0; font-size: 18px; font-weight: 800; color: #034750; }

.contact-body {
  background: #ECEBEC;
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
  font-size: 12px; color: #6c8082; margin-bottom: 2px;
}
.field .value {
  font-size: 14px; color: #3a4e51;
}

/* ===== Operator numbers ===== */
.operator-card { padding: 10px 14px 14px; }
.op-line { margin: 8px 8px 4px; color: #3a4e51; }
.op-line .label { color: #6c8082; margin-right: 6px; }
.link { color: #007C8A; text-decoration: underline; }

/* ===== Right column panels ===== */
.side { padding: 12px; }
.side-head { display: flex; align-items: center; gap: 8px; margin: 6px 6px 10px; }
.side-head h3 { margin: 0; font-size: 16px; font-weight: 800; color: #034750; }
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

/* Fix old border commas if you reuse .divider anywhere */
.divider { border: 1px solid #FFFFFF; }

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .grid { grid-template-columns: 1fr; column-gap: 0; }
}
</style>
