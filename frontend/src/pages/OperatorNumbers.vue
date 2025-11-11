<template>
  <div class="operator-numbers-page">
      <div class="content">
        <div class="content-left">
          <div class="header-container">
            <div class="title">Operator Numbers</div>
            <button class = add-button popovertarget="addpopover">Add Operator Number</button>
          </div>

          <div name="table">
            <table>
              <thead class="table-header">
                <tr>
                    <th>State/Province</th>
                    <th>Operator Number</th>
                    <th>Edit/Remove</th>
                </tr>
              </thead>
              <tbody class="table-body">
                <tr>
                  <td>California</td>
                  <td>12345</td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Colorado</td>
                  <td>67890</td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Washington</td>
                  <td>59746</td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="button-space">
                      <button class="edit-button" popovertarget="editpopover">Edit</button>
                      <button class="remove-button" popovertarget="deletepopover">Remove</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="content-right">
          <div class="messages">
            <div class="header">
              <div class="icon"></div>
              <div class="text">Messages</div>
            </div>
            <div class="divider"></div>
            <div class="body">
              <div class="object"><div class="text">Email message (4/11/2025)</div></div>
              <div class="object"><div class="text">Email message (4/07/2025)</div></div>
              <div class="object"><div class="text">Email message (4/03/2025)</div></div>
            </div>
            <div class="view-all">
              <div class="text">(View all messages)</div>
            </div>
          </div>
        </div>
        
      </div>
      

      <!---<div name="button">
        <button class = add-button popovertarget="addpopover">Add Operator Number</button>
      </div>-->

      
    </div>

     <div id="addpopover" popover="auto" class="popup">
      <div class="header">
        <div class="left">
          <img src="../assets/owp_logo.png"/>
        </div>
      </div>
      <form class="form-container">
        <h1 class="popup-title">
          Add Operator Number
        </h1>
        <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
        <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
        <button class = popup-button-left popovertarget="addpopover" popovertargetaction="hide">Add</button>

      </form>
    </div>

    <div id="editpopover" popover="auto" class="popup">
      <div class="header">
        <div class="left">
          <img src="../assets/owp_logo.png"/>
        </div>
      </div>
      <form class="form-container">
        <h1 class="popup-title">
          Edit Operator Number
        </h1>
        <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
        <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
        <button class = popup-button-left popovertarget="editpopover" popovertargetaction="hide">Edit</button>

      </form>
    </div>

    <div id="deletepopover" popover="auto" class="popup">
      <div class="header">
        <div class="left">
          <img src="../assets/owp_logo.png"/>
        </div>
      </div>
      <form class="form-container">
        <h1 class="popup-title">
          Remove Operator Number
        </h1>
        <p class="popup-text">Are you sure you want to remove the Operator Number?</p>
        <button class = popup-button-left popovertarget="deletepopover" popovertargetaction="hide">Yes</button>
        <button class = popup-button-right popovertarget="deletepopover" popovertargetaction="hide">No</button>

      </form>
    </div>
</template>


<style scoped>
  .operator-numbers-page {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center ;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: top ;
    gap: 32px;
  }

  .content-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center ;
    gap: 32px;
  }

  .content-right{
    display: flex;
    flex-direction: row;
    margin-top: 82px;
  }

  .header-container {
    width: 800px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    font-family: 'Roberto', sans-serif;
    font-size: 40px;
    font-weight: 790;
    color: #034750;
  }

  .add-button {
    background-color: #48773C;
    padding: 15px 15px;
    border: none;
    width: 200px;
    height: 50px;
    border-radius: 8px;
    font-family: 'Roberto', sans-serif;
    color: white;
  }

  .add-button:hover{
    background-color: #253e1f;
  }

  .button-space {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 32px;
  }

  .edit-button{
    width: 100px;
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
    width: 100px;
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

  table {
    border-collapse: collapse;
    width: 800px;
    background-color: #f2f1f2;
    border-radius: 20px;
    overflow: hidden;
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

  th, td {
    text-align: center;
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
    font-weight: bold;
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

  .popup{
    margin-top: 15%;
    width: 20%;
    height: 35%;
    position: fixed;
    border: 3px solid #004d4d;
    border-radius: 10px;
    background-color: #f2f1f2;
  }

  .popup .header {
    width: 100%;
    height: 15%;
    display: flex;
    flex-direction: row;
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
    margin-left: -15%;
    width:40%;
    margin-top: 55px;
    flex-direction: column;
    gap: 16px;
    top: 40px;
  }

  .messages {
    height: 240px;
    width: 300px;
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
</style>


