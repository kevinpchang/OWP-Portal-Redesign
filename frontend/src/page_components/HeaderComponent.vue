<template>
  <div class="header">
    <div class="left"><img src="../assets/owp_logo.png"/></div>
    <div class="center"></div>
    <div class="right">
      <div class="search-bar">
        <input type=text placeholder="Search" class="search"/>
      </div>
      <div class="help_button"></div>
      <div class="divider"></div>
      <div class="messages_button"></div>
      <div class="notif_button"></div>
      <div class="divider"></div>
      <div class="account_button" tabindex="0" @focus="openAccountDialog" @blur="closeAccountDialog">
        <div class="icon"></div>
        <div class="text">User</div>
      </div>
      <transition name="fade">
        <div class="account-button-dialog" v-if="accountDialog">
          <div class="top">
            <div class="info">
              <div class="left"><div class="icon"></div></div>
              <div class="right">
                <div class="name"><div class="text">User</div></div>
                <div class="email"><div class="text">User.Example@owp.csus.edu</div></div>
              </div>
            </div>
          </div>
          <div class="divider2"></div>
          <div class="bottom">
            <router-link
                :to="{ name: 'MyAccountPage' }"
                class="my-account-button"
                :class="{ active: route.name === 'MyAccountPage' }"
              >
              <div class="object"><div class="text">My Account</div></div>
            </router-link>
            <div class="object" @click.left="openContactDialog"><div class="text">Contact Info</div></div>
            <div class="object"><div class="text">Log Out</div></div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
        <div class="contact-info-dialog" v-if="contactDialog">
          <div class="dialog">
            <div class="header">
              <div class="icon"></div>
              <div class="text">User</div>
            </div>
            <div class="divider2"></div>
            <div class="body">
              <div class="object">
                <div class="left">
                  <div class="text">Email</div>
                  <input type=text placeholder="User.Example@owp.csus.edu" class="input-large"/>
                </div>
                <div class="right"></div>
              </div>
              <div class="object">
                <div class="left">
                  <div class="text">Phone</div>
                  <input type=text placeholder="(916) 278-8110" class="input-large"/>
                </div>
                <div class="right">
                  <div class="text">Mobile</div>
                  <input type=text placeholder="(916) 278-8116" class="input-large"/>
                </div>
              </div>
              <div class="object-large">
                <div class="left">
                  <div class="text">Address</div>
                  <input type=text placeholder='6000 J Street' class="input-large"/>
                  <div class="whitespace"></div>
                  <input type=text placeholder='Sacramento' class="input-large"/>
                </div>
                <div class="right">
                  <div class="whitespace"></div>
                  <input type=text placeholder='Suite 1001' class="input-medium"/>
                  <div class="whitespace"></div>
                  <div class="right-subdiv">
                    <input type=text placeholder='CA' class="input-tiny"/>
                    <input type=text placeholder='95819' class="input-small"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="cancel" @click=closeContactDialog>Cancel</div>
              <div class="save" @click="closeContactDialog">Save</div>
            </div>
          </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const accountDialog = ref(false)
  function openAccountDialog() {
    accountDialog.value = true
  }

    function closeAccountDialog() {
    accountDialog.value = false
  }

  const contactDialog = ref(false)
  function openContactDialog() {
    contactDialog.value = true
  }

  function closeContactDialog() {
    contactDialog.value = false
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

  .account-button-dialog {
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

  .account-button-dialog .top {
    height: 50px;
    display: flex;
  }

  .account-button-dialog .top .info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .account-button-dialog .top .info .left {
    display: flex;
  }

  .account-button-dialog .top .info .left .icon {
    width: 28px;
    height: 28px;
    margin-left: 10px;
    border: 2px, solid, #034750;
    border-radius: 4px;
  }

  .account-button-dialog .top .info .right {
    width: 100%;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: flex-start;
  }

  .account-button-dialog .top .info .right .name {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .account-button-dialog .top .info .right .name .text {
    font-family: Myriad Pro;
    font-size: 15px;
    font-weight: 600;
    color: #034750;
  }

  .account-button-dialog .top .info .right .email {
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .account-button-dialog .top .info .right .email .text {
    font-family: Myriad Pro;
    font-size: 10px;
    font-weight: 400;
    color: #034750;
  }

  .divider2 {
    width: 100%;
    height: 0px;
    align-self: center;
    border: 0.5px, solid, #C2C2C2;
  }

  .account-button-dialog .bottom {
    height: 100%;
  }

  .account-button-dialog .bottom .object {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .account-button-dialog .bottom .object:hover {
    cursor: pointer;
    background-color: #F2F1F2;
  }

  .account-button-dialog .bottom .my-account-button {
    text-decoration: none;
  }

  .account-button-dialog .bottom .object .text {
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

  .contact-info-dialog .dialog .header {
    width: 100%;
    height: 85px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    border-radius: 14px;
    background-color: #FEFEFE;
  }

  .contact-info-dialog .dialog .header .icon {
    width: 37px;
    height: 28px;
    margin-left: 32px;
    background-color: #034750;
  }

  .contact-info-dialog .dialog .header .text {
    height: 16px;
    margin-left: 8px;
    font-size: 20px;
    font-family: Myriad Pro;
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
    font-family: Myriad Pro;
    font-size: 18px;
    font-weight: 600;
    line-height: 8px;
    color: #034750;
  }

  .contact-info-dialog .dialog .input-large {
    width: 306px;
    height: 31px;
    font-family: Myriad Pro;
    font-size: 15px;
    font-weight: 400;
    border: 0.75px solid #747474;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-medium{
    width: 176px;
    height: 31px;
    font-family: Myriad Pro;
    font-size: 15px;
    font-weight: 400;
    border: 0.75px solid #747474;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-small{
    width: 100px;
    font-family: Myriad Pro;
    font-size: 15px;
    font-weight: 400;
    border: 0.75px solid #747474;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-tiny{
    width: 31px;
    font-family: Myriad Pro;
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
    font-family: Myriad Pro;
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
    font-family: Myriad Pro;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #00A5B5;
    cursor: pointer;
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
  }

  .header .right .search-bar .search:focus {
    width: 140px;
  }

  .header .right .help_button {
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

  .header .right .messages_button {
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

  .header .right .notif_button {
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

  .header .right .account_button {
    height: 30px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 16.5px;
    cursor: pointer;
  }

  .header .right .account_button .icon {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .account_button .text {
    font-size: 15px;
    font-family: Myriad Pro;
    font-weight: 600;
    margin-top: 4px;
    margin-left: 8px;
    color: #FFFFFF;
  }
</style>
