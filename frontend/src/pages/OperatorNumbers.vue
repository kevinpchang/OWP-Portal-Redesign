<template>
  <div class="operator-numbers-page">
    <div class="header-container">
      <div class="title">Operator Numbers</div>
    </div>

    <div name="button">
      <button class = add-button popovertarget="addpopover">Add Operator Number</button>
    </div>

    <div name="table">
      <table>
        <thead class="table-header">
            <tr>
                <th>State/Province</th>
                <th>Operator Number</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="table-body">
            <tr>
                <td>California</td>
                <td>12345</td>
                <td><button class="edit-button" popovertarget="editpopover">Edit/Remove</button></td>
            </tr>
            <tr>
                <td>Colorado</td>
                <td>67890</td>
                <td><button class="edit-button" popovertarget="editpopover">Edit/Remove</button></td>
            </tr>
            <tr>
                <td>Washington</td>
                <td>59746</td>
                <td><button class="edit-button" popovertarget="editpopover">Edit/Remove</button></td>
            </tr>
        </tbody>
      </table>
    </div>

    <div id="addpopover" popover="manual" class="popup">
      <form class="form-container">
        <h1 class="popup-title">
          Add Operator Number
        </h1>
        <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
        <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
        <button class = popup-button-left popovertarget="addpopover" popovertargetaction="hide">Add</button>

      </form>
    </div>

    <div id="editpopover" popover="manual" class="popup">
      <form class="form-container">
        <h1 class="popup-title">
          Edit/Remove Operator Number
        </h1>
        <input type="text" id="state" class="input-box" placeholder="State/Province"><br><br>
        <input type="text" id="opnum" class="input-box" placeholder="Operator Number"><br><br>
        <button class = popup-button-left popovertarget="addpopover" popovertargetaction="hide">Edit</button>
        <button class = popup-button-right popovertarget="editpopover" popovertargetaction="hide">Delete</button>

      </form>
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
          <div class="text">Purchase History</div>
        </div>
        <div class="divider"></div>
        <div class="body">
          <div class="text">Operation of Wastewater Treatment Plants, Vol 1</div>
          <div class="text">Operation of Wastewater Treatment Plants, Vol 2</div>
          <div class="text">Operation of Wastewater Treatment Plants, Vol 3</div>
          <div class="text">Industrial Waste Treatment, Vol 1</div>
        </div>
        <div class="view-all">
          <div class="text">(View all purchases)</div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.operator-numbers-page {
  position: relative;
  height: 100%;
  background-color: #fff;
}

.header-container {
  position: relative; 
  left: 18px; 
  top: 38px; 
  display: flex;
  flex-direction: column;
  gap: 8px; 
}

.title {
  width: 331px;
  height: 28px;
  font-family: 'Myriad Pro, Bold', sans-serif;
  font-size: 28px;
  font-weight: 790;
  color: #034750;
  align-items: center;
}

.add-button {
  position: relative;
  margin-left: 55%;
  background-color: #48773C;
  padding:15px 15px;
  border:none;
  border-radius: 10px;
  font-family: 'Myriad Pro, Bold', sans-serif;  
  color:white
}

.edit-button{
  background: transparent;
  border: none !important;
  font-family: 'Myriad Pro', sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: #034750;
}

.popup-button-left{
  margin-left: 15px;
  margin-top:15px;
  background-color: #48773C;
  padding:15px 15px;
  border:none;
  border-radius: 10px;
  font-family: 'Myriad Pro, Bold', sans-serif;  
  color:white
}

.popup-button-right{
  margin-left: 45%;
  margin-top:15px;
  background-color: #48773C;
  padding:15px 15px;
  border:none;
  border-radius: 10px;
  font-family: 'Myriad Pro, Bold', sans-serif;  
  color:white
}

.table-header {
    font-family: 'Myriad Pro', sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: #034750;
    margin: 0;
}

.table-body {
    font-family: 'Myriad Pro', sans-serif;
    font-size: 17px;
    font-weight: 600;
    color: #034750;
    margin: 0;
}

table {
    margin-top: 30px;
    padding-left: 18px;
    border-collapse: collapse;
    width: 65%;
    background-color: #f2f1f2;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
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
    height: 30%;
    position: fixed;
    border: 3px solid #004d4d;
    border-radius: 10px;
    border-top: 75px solid #004d4d;
    background-color: #f2f1f2;
  }

  .popup-title{
    margin-left: 20px;
    margin-top: 20px;
    font-family: 'Myriad Pro, Bold', sans-serif;
    font-size: 28px;
    font-weight: 790;
    color: #034750;
    align-items: center;
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
    color: #ccc; /* light gray placeholder text */
    font-size: 18px;
  }

  .input-box:focus {
    outline: none; /* removes blue outline */
    background-color: #e1e1e1;
  }

  .quick-links {
    margin-top: -190px;
    margin-left:70%;
    width: 25%;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    gap: 16px;
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
</style>


