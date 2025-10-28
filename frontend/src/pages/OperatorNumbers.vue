<template>
  <div class="courses-page">
    <div class="header-container">
      <div class="courses-header">Operator Numbers</div>
      <!--<p class="page-description">Sorry! Currently under construction.</p>-->
    </div>

    <!--<div class="tiles-container">
        <div class="table-tile">-->
            <!--<h2 class="tile-header">Table goes here</h2>-->
    <table>
        <thead class="tile-header">
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
                <td>Edit/Remove</td>
            </tr>
            <tr>
                <td>Colorado</td>
                <td>67890</td>
                <td>Edit/Remove</td>
            </tr>
            <tr>
                <td>Washington</td>
                <td>59746</td>
                <td>Edit/Remove</td>
            </tr>
        </tbody>
    </table>
        <!--</div>
    </div>-->

    <div class="content-body">
      <p>where is this</p>
    </div>

  </div>
</template>

<style scoped>
.courses-page {
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

.courses-header {
  width: 331px;
  height: 28px;
  font-family: 'Myriad Pro, Bold', sans-serif;
  font-size: 28px;
  font-weight: 790;
  color: #034750;
  align-items: center;
}

.page-description {
  font-size: 16px;
  color: #555;
  font-family: 'Myriad Pro', sans-serif;
  margin: 0;
}

.tiles-container {
    margin-top: 46px;
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.table-tile {
    background-color: #f2f1f2;
    border-radius: 14px;
    padding: 24px;
    width: 700px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tile-header {
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
    margin-top: 75px;
    padding-left: 18px;
    border-collapse: collapse;
    width: 100%;
    max-width: 1000px;
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

.content-body {
  margin-top: 32px;
  padding: 0 32px;
}
</style>
