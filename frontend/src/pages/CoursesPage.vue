<template>
  <div class="courses-page">
    <div class="header-container">
      <div class="courses-header">Courses</div>
      <p class="page-description">Sorry! Currently under construction.</p>
    </div>

    <div class="tiles-container">
        <div class="course-tile">
            <h2 class="tile-header">Active Enrollments</h2>
        </div>
    </div>

    <div class="content-body">
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

.course-tile {
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


.content-body {
  margin-top: 32px;
  padding: 0 32px;
}
</style>
