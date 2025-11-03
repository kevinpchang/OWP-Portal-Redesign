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
    width: 100%;
    max-width: 65%;
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
</style>


