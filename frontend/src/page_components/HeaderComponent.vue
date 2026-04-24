<template>
  <div class="header">
    <div class="left"><img src="../assets/owp_logo.png"/></div>
    <div class="center"></div>
    <div class="right">
      <div class="account_button" tabindex="0" @focus="openAccountDialog" @blur="closeAccountDialog">
        <SquareUserRound class="icon" color="#FFFFFF"/>
        <div class="text">{{ account?.firstname ?? "Null" }}</div>
      </div>
      <div class="divider"></div>
      <a href="https://www.owp.csus.edu/helpful-links/" target="_blank">
        <CircleQuestionMark class="help_button" color="#FFFFFF"/>
      </a>
      <router-link to="/messages">
        <Mail class="messages_button" color="#FFFFFF"/>
      </router-link>
      <div class="divider"></div>
      <transition name="fade">
        <div class="account-button-dialog" v-if="accountDialog">
          <div class="top">
            <div class="info">
              <div class="left"><SquareUserRound class="icon" color="#034750"/></div>
              <div class="right">
                <div class="name"><div class="text">{{ account?.firstname ?? "User" }}</div></div>
                <div class="email"><div class="text">{{ account?.prfdemailval ?? "" }}</div></div>
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
              <SquareUserRound class="icon" color="#034750"/>
              <div class="text">{{ account?.fullname ?? "Null" }}</div>
            </div>
            <div class="divider2"></div>
            <div class="body">
              <div class="object">
                <div class="left">
                  <div class="text">Email</div>
                  <input type=text  :placeholder="account?.prfdemailval" disabled class="input-large"/>
                </div>
                <div class="right"></div>
              </div>
              <div class="object">
                <div class="left">
                  <div class="text">Phone</div>
                  <div class="left-subdiv">
                    <input type=text v-model="contactForm.phone_area_code" class="input-tiny"/>
                    <input type=text v-model="contactForm.phone_local" class="input-small"/>
                    <input type=text v-model="contactForm.phone_extension" class="input-tiny"/>
                  </div>
                </div>
              </div>
              <div class="object-large">
                <div class="left">
                  <div class="text">Home Address (Preferred)</div>
                  <input type=text v-model="contactForm.street_1" class="input-large"/>
                  <div class="whitespace"></div>
                  <input type=text v-model="contactForm.city" class="input-large"/>
                </div>
                <div class="right">
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="right-subdiv">
                    <input type=text v-model="contactForm.state" class="input-tiny"/>
                    <input type=text v-model="contactForm.postal_code" class="input-small"/>
                  </div>
                </div>
              </div>
              <div class="object-large">
                <div class="left">
                  <div class="text">Business</div>
                  <input type=text v-model="contactForm.street_1" class="input-large"/>
                  <div class="whitespace"></div>
                  <input type=text v-model="contactForm.city" class="input-large"/>
                </div>
                <div class="right">
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="whitespace"></div>
                  <div class="right-subdiv">
                    <input type=text v-model="contactForm.state" class="input-tiny"/>
                    <input type=text v-model="contactForm.postal_code" class="input-small"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="cancel" @click=closeContactDialog>Cancel</div>
              <div class="save" @click="saveContactInfo">Save</div>
            </div>
          </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
  import { CircleQuestionMark, Mail, Bell, SquareUserRound } from 'lucide-vue-next';
  import { ref, onMounted, reactive } from 'vue'
  import { useRoute } from 'vue-router'

  import * as api from "@/services/owpAPI";

  // --- API STATE ---
  const pid = 458860; // later: come from auth/session

  const loading = ref(false);
  const error = ref("");

  const account = ref(null);


  async function loadHeader() {
    console.log("loadHeader called");
    loading.value = true;
    error.value = "";
    
    try {
      const acc = await api.getAccountDetails(pid);
      account.value = acc.response;
      console.log("Account JSON:", acc);

    } catch (e) {
      error.value = e?.message ?? String(e);
    } finally {
      loading.value = false;
    }
  }

  // Update Contact Info
  const contactForm = reactive({
    street_1: account?.hmstreet1 ?? "",
    street_2: account?.hmstreet2 ?? "",
    street_3: account?.hmstreet3 ?? "",
    city: account?.hmcity ?? "",
    state: account?.hmstate ?? "",
    postal_code: account?.hmzip ?? "",
    country: account?.hmcountry ?? "",

    phone_country_code: account?.hmphncountryid ?? "",
    phone_area_code: account?.hmphncity ?? "",
    phone_local: account?.hmphnlocal ?? "",
    phone_extension: account?.hmphnext ?? "",

    fax_country_code: account?.hmfaxcountryid ?? "",
    fax_area_code: "",
    fax_local: account?.hmfaxlocal ?? "",

    ipAddr: null,
  })

  async function saveContactInfo() {
    try {
      const formForApi = {
      street_1: contactForm.street_1,
      street_2: contactForm.street_2,
      street_3: contactForm.street_3,
      city: contactForm.city,
      state: contactForm.state,
      postal_code: contactForm.postal_code,
      country: contactForm.country,

      phone_country_code: contactForm.phone_country_code ?? "1",
      phone_area_code: contactForm.phone_area_code,
      phone_local: contactForm.phone_local,
      phone_extension: contactForm.phone_extension,

      fax_country_code: contactForm.fax_country_code ?? "1",
      fax_area_code: contactForm.fax_area_code,
      fax_local: contactForm.fax_local,

      ipAddr: contactForm.ipAddr,
    };

      const resp = await api.updateContactInfo(pid, formForApi);
      console.log("updateContactInfo response:", resp);
    } catch (e) {
      console.error("Error updating contact info:", e);
      alert("Error updating contact information. Please wait a moment and try again. If problem persists contact a site admin.");
    }
    closeContactDialog();
    await loadHeader();
  }


  onMounted(loadHeader);

  const route = useRoute();

  const accountDialog = ref(false);
  function openAccountDialog() {
    accountDialog.value = true;
  }

    function closeAccountDialog() {
    accountDialog.value = false;
  }

  const contactDialog = ref(false);
  function openContactDialog() {
    const a = account.value ?? {};

    contactForm.street_1 = a.hmstreet1 ?? "";
    contactForm.street_2 = a.hmstreet2 ?? "";
    contactForm.street_3 = a.hmstreet3 ?? "";
    contactForm.city = a.hmcity ?? "";
    contactForm.state = a.hmstate ?? "";
    contactForm.postal_code = a.hmzip ?? "";
    contactForm.country = a.hmcountry ?? "1";

    contactForm.phone_country_code = a.hmphncountry ?? "1";
    contactForm.phone_area_code = a.hmphncity ?? "";
    contactForm.phone_local = a.hmphnlocal ?? "";
    contactForm.phone_extension = a.hmphnext ?? "";

    contactForm.fax_country_code = a.hmfaxncountry ?? "1";
    contactForm.fax_area_code = a.hmfaxcity ?? "";
    contactForm.fax_local = a.hmfaxlocal ?? "";

    contactForm.ipAddr = null;

    contactDialog.value = true;
  }

  function closeContactDialog() {
    contactDialog.value = false;
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
    width: 200rem;
    border-radius: 4rem;
    margin-top: 220rem;
    display: flex;
    flex-direction: column;
    background-color: #FEFEFE;
    box-shadow: 0rem 3rem 9rem #00000029;
  }

  .account-button-dialog .top {
    height: 50rem;
    display: flex;
  }

  .account-button-dialog .top .info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .account-button-dialog .top .info .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .account-button-dialog .top .info .left .icon {
    width: 28rem;
    height: 28rem;
    margin-left: 16rem;
  }

  .account-button-dialog .top .info .right {
    width: 100%;
    margin-left: 10rem;
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
    
    font-size: 15rem;
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
    
    font-size: 10rem;
    font-weight: 400;
    color: #034750;
  }

  .divider2 {
    border-top: 1rem solid #C2C2C2;
  }

  .account-button-dialog .bottom {
    height: 100%;
  }

  .account-button-dialog .bottom .object {
    height: 40rem;
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
    margin-left: 16rem;
    
    font-size: 16rem;
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
    backdrop-filter: blur(9rem);
    -webkit-backdrop-filter: blur(9rem);
  }

  .contact-info-dialog .dialog {
    width: 700rem;
    display: flex;
    flex-direction: column;
    border-radius: 14rem;
    border: #707070 solid 1rem;
    background-color: #FEFEFE;
  }

  .contact-info-dialog .dialog .header {
    width: 100%;
    height: 85rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    border-radius: 14rem;
    background-color: #FEFEFE;
  }

  .contact-info-dialog .dialog .header .icon {
    width: 40rem;
    height: 40rem;
    margin-left: 16rem;
  }

  .contact-info-dialog .dialog .header .text {
    height: 16rem;
    margin-left: 8rem;
    font-size: 20rem;
    font-weight: 600;
    color: #034750;
  }

  .contact-info-dialog .dialog .body {
    height: 386rem;
    margin-top: 32rem;
    margin-left: 32rem;
    margin-right: 32rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contact-info-dialog .dialog .body .text{
    height: 16rem;
    
    font-size: 18rem;
    font-weight: 600;
    line-height: 8rem;
    color: #034750;
  }

  .contact-info-dialog .dialog .input-large {
    width: 306rem;
    height: 31rem;
    
    font-size: 15rem;
    font-weight: 400;
    border: 0.75rem solid #747474;
    border-radius: 4rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-medium{
    width: 176rem;
    height: 31rem;
    
    font-size: 15rem;
    font-weight: 400;
    border: 0.75rem solid #747474;
    border-radius: 4rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-small{
    width: 100rem;
    font-size: 15rem;
    font-weight: 400;
    border: 0.75rem solid #747474;
    border-radius: 4rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .input-tiny{
    width: 41rem;
    font-size: 15rem;
    font-weight: 400;
    border: 0.75rem solid #747474;
    border-radius: 4rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .whitespace{
    width: 100%;
    height: 16rem;
  }

  .contact-info-dialog .dialog .body .object {
    width: 100%;
    height: 78rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .object-large {
    width: 100%;
    height: 109rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24rem;
    box-sizing: border-box;
  }

  .contact-info-dialog .dialog .body .left{
    width: 50%;
    height: 78rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

  }

  .contact-info-dialog .dialog .body .object .left .left-subdiv{
    width: 176rem;
    height: 31rem;
    display: flex;
    flex-direction: row;
    gap: 10rem;
  }

  .contact-info-dialog .dialog .body .right{
    width: 50%;
    height: 78rem;
    display: flex;
    flex-direction: column;
    justify-content: bottom;
    align-items: flex-start;

  }

  .contact-info-dialog .dialog .body .object-large .right .right-subdiv{
    width: 176rem;
    height: 31rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .contact-info-dialog .dialog .bottom{
    height: 29rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 32rem;
  }

  .contact-info-dialog .dialog .bottom .cancel{
    width: 306rem;
    height: 29rem;
    border-radius: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16rem;
    
    font-weight: 400;
    color: #FFFFFF;
    background-color: #C2C2C2;
    cursor: pointer;
  }

  .contact-info-dialog .dialog .bottom .save{
    width: 306rem;
    height: 29rem;
    border-radius: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16rem;
    
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
    width: 316.96rem;
    height: 41.08rem;
    object-fit: scale-down;
    object-position: center;
    display: block;
  }

  .header .right {
    display: flex;
    flex-direction: row;
    margin-right: 16.5rem;
    justify-content: center;
    align-items: center;
  }

  .header .right .divider {
    width: 0rem;
    height: 32rem;
    margin-left: 16.5rem;
    border: 1rem, solid, #FFFFFF;
  }

  .header .right .help_button {
    width: 24.05rem;
    height: 24.05rem;
    margin-left: 16.5rem;
    cursor: pointer;
  }

  .header .right .messages_button {
    width: 24.05rem;
    height: 24.05rem;
    margin-left: 16.5rem;
    cursor: pointer;
  }

  .header .right .account_button {
    height: 30rem;
    border-radius: 4rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 16.5rem;
    cursor: pointer;
  }

  .header .right .account_button .icon {
    width: 24.05rem;
    height: 24.05rem;
  }

  .header .right .account_button .text {
    font-size: 15rem;
    
    font-weight: 600;
    margin-top: 4rem;
    margin-left: 8rem;
    color: #FFFFFF;
  }
</style>
