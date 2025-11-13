<script setup>
  import { ref } from 'vue'

  const addPopup = ref(false)
  function openAdd() {
    addPopup.value = true
  }

  function closeAdd() {
    addPopup.value = false
  }

  const editPopup = ref(false)
  function openEdit() {
    editPopup.value = true
  }

  function closeEdit() {
    editPopup.value = false
  }

  const deletePopup = ref(false)
  function openDelete() {
    deletePopup.value = true
  }

  function closeDelete() {
    deletePopup.value = false
  }
</script>

<template>
  <div class="operator-numbers-page">
    <div class="left-column">
      <div class="header-container">
        <div class="title">Operator Numbers</div>
        <button class = add-button @click.left="openAdd">Add Operator Number</button>
      </div>

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
          </tbody>
        </table>
      </div>
    </div>


    <div class="quick-links">
      <div class="messages">
        <div class="header">
          <div class="icon"></div>
          <div class="text">Messages</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="text">Email message (4/11/2025)</div>
          <div class="text">Email message (4/07/2025)</div>
          <div class="text">Email message (4/03/2025)</div>
        </div>
        <div class="view-all">
          <div class="text">(View all messages)</div>
        </div>
      </div>

      <div class="purchase-history">
        <div class="header">
          <div class="icon"></div>
          <div class="text">Certificates</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="text">Waste Water 1 Certificate</div>
          <div class="text">Waste Water 2 Certificate</div>
          <div class="text">Utility 1 Certificate </div>
          <div class="text">Utility 2 Certificate </div>
        </div>
        <div class="view-all">
          <a class="text" href="/Certificates">(View all Certificates)</a>
        </div>
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
            <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
            <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
            <button class = popup-button-left @click="closeAdd">Add</button>

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
            <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
            <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
            <button class = popup-button-left @click="closeEdit">Edit</button>

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
            <button class = popup-button-left @click="closeDelete">Yes</button>
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
    gap: 20px;
    height: 100vh;
    background-color: #fff;
    box-sizing: border-box;
  }

  .header-container {
    grid-column: 1 / 2;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .title {
    width: 331px;
    height: 28px;
    margin-left: 24%;
    font-family: 'Roberto', sans-serif;
    font-size: 28px;
    font-weight: 790;
    color: #034750;
    align-items: center;
  }

  .add-button {
    background-color: #48773C;
    padding: 15px 15px;
    border: none;
    width:15%;
    border-radius: 10px;
    font-family: 'Roberto', sans-serif;
    color: white;
    margin-bottom: 20px;
  }

  .add-button:hover{
    background-color: #253e1f;
  }

  .edit-button{
    width: 75px;
    border-radius: 8px;
    border: none !important;
    font-family: 'Roberto', sans-serif;
    font-size: 17px;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #D97A27;
    cursor: pointer;
  }

  .remove-button{
    width: 80px;
    float:right;
    border-radius: 8px;
    border: none !important;
    font-family: 'Roberto', sans-serif;
    font-size: 17px;
    font-weight: 400;
    color: #FFFFFF;
    background-color: #9F3323;
    cursor: pointer;
  }

  .popup-button-left{
    margin-left: 15px;
    margin-top:15px;
    background-color: #48773C;
    padding:15px 15px;
    border:none;
    border-radius: 10px;
    font-family: 'Roberto', sans-serif;
    color:white
  }

  .popup-button-right{
    margin-left: 45%;
    margin-top:15px;
    background-color: #48773C;
    padding:15px 15px;
    border:none;
    border-radius: 10px;
    font-family: 'Roberto', sans-serif;
    color:white
  }

  .table-header {
    font-family: 'Roberto', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #034750;
    margin: 0;
  }

  .table-body {
    font-family: 'Roberto', sans-serif;
    font-size: 17px;
    font-weight: 400;
    color: #034750;
    margin: 0;
  }

  table {
    margin-top: 30px;
    border-collapse: collapse;
    width: 700px;
    background-color: #f2f1f2;
    border-radius: 20px;
    overflow: hidden;
  }

  th, td {
    text-align: left;
    padding: 12px 16px;
    border-right: 1px solid #ccc;
  }

  th:last-child,
  td:last-child {
      border-right: none;
  }

  th {
    background-color: #f2f1f2;
    color: #004d4d;
    font-weight: 400px;
    border-bottom: 1px solid #ccc;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    border-bottom: 1px solid #ddd;
  }

  .blur-overlay {
    position: fixed;
    inset: 0;
    width:100vw;
    height:100vh;
    background-color: #0000009a; /* slight tint */
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
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
    border-radius: 10px;
    background-color: #f2f1f2;
  }

  .popup .inner{
    background-color: #f2f1f2;
    border:none;
    height:95%;
    border-radius: 10px;
    background-color: #f2f1f2;
  }

  .popup .header {
    width: 100%;
    height: 15%;
    display: flex;
    flex-direction: row;
    border-top: #034750;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    align-items: center;
    justify-content: space-between;
    background-color: #034750;
  }

  .popup .header .left > img {
    width: 316.96px;
    height: 41.08px;
    object-fit: scale-down;
    object-position: center;
    display: block;
  }


  .popup-title{
    margin-left: 20px;
    margin-top: 20px;
    font-family: 'Roberto', sans-serif;
    font-size: 28px;
    font-weight: 790;
    color: #034750;
    align-items: center;
  }

  .popup-text{
    font-family: 'Roberto', sans-serif;
    font-size: 17px;
    margin-left: 20px;
  }

  .input-box {
    width: 80%;
    height: 60px;
    margin-left: 15px;
    margin-top: 15px;
    background-color: #e8e8e8; /* light gray background */
    border: none;
    border-radius: 8px; /* rounded corners */
    font-size: 18px;
    padding: 0 20px;
    box-sizing: border-box;
    color: #555;
  }

  .input-box::placeholder {
    color: #ccc;
    font-size: 18px;
  }

  .input-box:focus {
    outline: none;
    background-color: #e1e1e1;
  }

  .quick-links {
    grid-column: 2 / 3;
    display: flex;
    margin-top: 55px;
    flex-direction: column;
    gap: 16px;
    top: 40px;
  }

  .messages {
    height: 240px;
    border-radius: 14rem;
    display: flex;
    flex-direction: column;
    background-color: #F2F1F2;
  }

  .messages .header {
    height: 68px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .messages .header .icon {
    width: 26.53px;
    height: 33.67px;
    border-radius: 4rem;
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #007C8A;
  }

  .messages .header .text {
    height: 20px;
    font-size: 20px;
    font-weight: 700;
    margin-top: 29px;
    margin-left: 8px;
    color: #034750;
  }

  .messages .body {
    height: 172px;
    display: flex;
    flex-direction: column;
  }

  .messages .body .text {
    height: 14px;
    margin-top: 25px;
    margin-left: 24px;
    font-size: 16px;
    font-weight: 400;
    text-decoration: underline;
    color: #007C8A;
  }

  .messages .view-all {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .messages .view-all .text {
    height: 20px;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    color: #034750;
  }

  .purchase-history {
    height: 460px;
    border-radius: 14rem;
    display: flex;
    flex-direction: column;
    background-color: #F2F1F2;
  }

  .purchase-history .header {
    height: 68px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .purchase-history .header .icon {
    width: 26.53px;
    height: 33.67px;
    border-radius: 4rem;
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #007C8A;
  }

  .purchase-history .header .text {
    height: 20px;
    font-size: 20px;
    font-weight: 700;
    margin-top: 29px;
    margin-left: 8px;
    color: #034750;
  }

  .purchase-history .body {
    height: 350px;
    display: flex;
    flex-direction: column;
  }

  .purchase-history .body .text {
    height: 14px;
    margin-top: 40px;
    margin-left: 24px;
    margin-right: 24px;
    font-size: 16px;
    font-weight: 400;
    text-decoration: underline;
    color: #007C8A;
  }

  .purchase-history .view-all {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .purchase-history .view-all .text {
    height: 20px;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    color: #034750;
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


