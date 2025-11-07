<template>
  <div class="header">
    <div class="left"><img src="../assets/owp_logo.png"/></div>
    <div class="center"></div>
    <div class="right">
      <div class="search-bar">
        <input type=text placeholder="Search" class="search"/>
      </div>
      <div class="help_btn"></div>
      <div class="divider"></div>
      <div class="messages_btn"></div>
      <div class="notif_btn"></div>
      <div class="divider"></div>
      <div class="account_btn" tabindex="0" @focus="toggleAccountDialog" @blur="toggleAccountDialog">
        <div class="icon"></div>
        <div class="text">User</div>
      </div>
      <transition name="fade">
        <div class="account-btn-dialog" v-if="accountDialog">
          <div class="top">
            <div class="info">
              <div class="left"><div class="icon"></div></div>
              <div class="right">
                <div class="name"><div class="text">User</div></div>
                <div class="email"><div class="text">User.Example@OWP.csus.edu</div></div>
              </div>
            </div>
          </div>
          <div class="divider2"></div>
          <div class="bottom">
            <div class="object"><div class="text">My Account</div></div>
            <div class="object" @click.left="openContactDialog"><div class="text">Contact Info</div></div>
            <div class="object"><div class="text">Log Out</div></div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
        <div class="contact-info-dialog" v-if="contactDialog">
          <div class="dialog" ref="focusDialog" tabindex="0" >
            <div class="top">
              <div class="icon"></div>
              <div class="text"></div>
            </div>
            <div class="divider2"></div>
            <div class="body">
              <div class="top">
                <div class="object"></div>
              </div>
              <div class="bottom">
                <div class="object"></div>
                <div class="object"></div>
              </div>
            </div>
            <div class="bottom">
              <div class="save"></div>
              <div class="cancel"></div>
            </div>
          </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref, nextTick } from 'vue'

  const accountDialog = ref(false)
  function toggleAccountDialog() {
    accountDialog.value = !accountDialog.value
  }

  const focusDialog = ref(null)
  const contactDialog = ref(false)
  function openContactDialog() {
    contactDialog.value = true
    nextTick(() => {
      focusDialog.value?.focus()
    })
  }

  function closeContactDialog() {
    contactDialog.value = !contactDialog.value
  }
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .account-btn-dialog {
    position: fixed;
    z-index: 15;
    width: 200px;
    border-radius: 4px;
    margin-top: 220px;
    margin-left: 150px;
    display: flex;
    flex-direction: column;
    background-color: #FEFEFE;
    box-shadow: 0px 3px 9px #00000029;
  }

  .account-btn-dialog .top {
    height: 50px;
    display: flex;
  }

  .account-btn-dialog .top .info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .account-btn-dialog .top .info .left {
    display: flex;
  }

  .account-btn-dialog .top .info .left .icon {
    width: 28px;
    height: 28px;
    margin-left: 10px;
    border: 2px, solid, #034750;
    border-radius: 4px;
  }

  .account-btn-dialog .top .info .right {
    width: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: left;
  }

  .account-btn-dialog .top .info .right .name {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .account-btn-dialog .top .info .right .name .text {
    font-family: Myriad Pro;
    font-size: 15px;
    font-weight: 600;
    color: #034750;
  }

  .account-btn-dialog .top .info .right .email {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .account-btn-dialog .top .info .right .email .text {
    font-family: Myriad Pro;
    font-size: 10px;
    font-weight: 600;
    color: #034750;
  }

  .divider2 {
    width: 100%;
    height: 0px;
    border: 1px, solid, #C2C2C2
  }

  .account-btn-dialog .bottom {
    height: 100%;
  }

  .account-btn-dialog .bottom .object {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .account-btn-dialog .bottom .object:hover {
    cursor: pointer;
    background-color: #F2F1F2;
  }

  .account-btn-dialog .bottom .object .text {
    margin-left: 16px;
    font-family: Myriad Pro;
    font-size: 16px;
    font-weight: 400;
    color: #707070;
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

  .contact-info-dialog .dialog .top {
    height: 85px;
    display: flex;
    flex-direction: row;
    background-color: red;
  }

  .contact-info-dialog .dialog .top .icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    margin-left: 32px;
    background-color: #034750;
  }

  .contact-info-dialog .dialog .body {
    height: 415px;
    background-color: blue;
  }

  .header {
    width: 100vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #034750;
  }

  .header .left > img {
    width: 316.96px;
    height: 41.08px;
    object-fit: scale-down;
    object-position: center;
    display: block;
  }

  .header .right {
    display: flex;
    flex-direction: row;
    margin-right: 16.5px;
    justify-content: center;
    align-items: center;
  }

  .header .right .divider {
    width: 0px;
    height: 32px;
    margin-left: 16.5px;
    border: 1px, solid, #FFFFFF;
  }

  .header .right .search-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    background-color: white;
  }

  .header .right .search-bar .search {
    width: 90px;
    height: 24px;
    border: none;
    border-radius: 4px;
    outline: none;
    box-shadow: none;
    background-color: white;
  }

  .header .right .search-bar .search:focus {
    width: 140px;
  }

  .header .right .help_btn {
    width: 24.05px;
    height: 24.05px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
    cursor: pointer;
  }

  .header .right .messages_btn {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
    cursor: pointer;
  }

  .header .right .notif_btn {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
    cursor: pointer;
  }

  .header .right .account_btn {
    height: 30px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 16.5px;
    cursor: pointer;
  }

  .header .right .account_btn .icon {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .account_btn .text {
    font-size: 15px;
    font-family: Myriad Pro;
    font-weight: 600;
    margin-top: 4px;
    margin-left: 8px;
    color: #FFFFFF;
  }
</style>
