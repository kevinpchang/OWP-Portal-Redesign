<template>
  <div class="dashboard-page">
    <div class="dashboard-top">
      <div class="text">
        <div class="date">Wednesday, October 15</div>
        <div class="welcome-message">Hello, User!</div>
        <div class="dashboard-description">
          Here is a quick look at your active and completed enrollments.
          You can also view a snapshot of your previous purchases.
        </div>
      </div>

      <div class="image">
        <img src="../assets/owpart.png"/>
      </div>
    </div>

    <div class="dashboard-bottom">
      <div class="dashboard-left">
        <div class="active-enrollments">
          <div class="header">
            <div class="icon"></div>
            <div class="text">Active Enrollments</div>
          </div>
          <div class="divider"></div>
          <div class="body"></div>
        </div>

        <div class="instructor-slides">
          <div class="header">
            <div class="icon"></div>
            <div class="text">Instructor Slides</div>
          </div>
          <div class="divider"></div>
          <div class="body"></div>
        </div>
      </div>
      <div class="dashboard-right">

        <div class="messages">
          <div class="header">
            <div class="icon"></div>
            <div class="text">Messages</div>
          </div>
          <div class="divider"></div>
          <div class="body"></div>
        </div>

        <div class="purchase-history">
          <div class="header">
            <div class="icon"></div>
            <div class="text">Purchase History</div>
          </div>
          <div class="divider"></div>
          <div class="body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .dashboard-page {
    display: grid;
    grid-template-rows: auto 1fr;
    row-gap: 32px;
    justify-content: center;
    align-items: top;
  }

  .dashboard-top {
    grid-row: 1;
    display: grid;
    grid-template-columns: 508px 508px;
    margin-top: 32px;
  }

  .text {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 240px;
    font-family: Myriad Pro;
    color: #034750;
  }

  .image {
    grid-column: 2;
  }

  .image > img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;            /* fills + crops */
    object-position: center;      /* change to 'top'/'50% 30%' to shift the crop */
    display: block;
  }

  .date {
    font-size: 20px;
    font-weight: 600;
    color: #707070;
    margin-top: 24px;
    margin-bottom: 32px;
    margin-left: 24px;
  }

  .welcome-message {
    font-size: 56px;
    font-weight: 700;
    color: #00A5B5;
    margin-bottom: 16px;
    margin-left: 24px;
  }

  .dashboard-description {
    width: 395px;
    height: 71px;
    font-size: 19px;
    font-weight: 400;
    color: #747474;
    margin-bottom: 33px;
    margin-left: 24px;
  }

  .dashboard-bottom {
    grid-row: 2;
    display: grid;
    grid-template-columns: 700px 300px;
    column-gap: 16rem;
    margin-bottom: 48px;
  }

  .dashboard-left {
    grid-column: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .divider {
    width: 100%;
    height: 0px;
    border: 1px, solid, #FFFFFF;
  }

  .active-enrollments {
    height: 450px;
    border-radius: 14rem;
    display: flex;
    flex-direction: column; 
    justify-content: top;
    align-items: top;
    background-color: #F2F1F2;
  }

  .active-enrollments .header {
    height: 68px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .active-enrollments .header .icon {
    width: 26.53px;
    height: 33.67px;
    border-radius: 4rem;
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #c9c9c9;
  }

  .active-enrollments .header .text {
    height: 20px;
    font-size: 20px;
    font-weight: 700;
    margin-top: 29px;
    margin-left: 8px;
    color: #034750;
  }
  .active-enrollments .body {
    height: 382px;
    display: flex;
  }

  .instructor-slides {
    height: 250px;
    border-radius: 14rem;
    background-color: #F2F1F2;
  }

  .instructor-slides .header {
    height: 68px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }

  .instructor-slides .header .icon {
    width: 26.53px;
    height: 33.67px;
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #c9c9c9;
  }

  .instructor-slides .header .text {
    height: 20px;
    font-size: 20px;
    font-weight: 700;
    margin-top: 29px;
    margin-left: 8px;
    color: #034750;
  }
  .instructor-slides .body {
    height: 382px;
    display: flex;
  }

  .dashboard-right {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .messages {
    height: 240px;
    border-radius: 14rem;
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
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #c9c9c9;
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
    height: 382px;
    display: flex;
  }

  .purchase-history {
    height: 460px;
    border-radius: 14rem;
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
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #c9c9c9;
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
    height: 382px;
    display: flex;
  }

</style>
