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
          <div class="body">
            <div class="object1">
              <div class="left">
                <div class="icon"></div>
              </div>
              <div class="right">
                <div class="title"><div class="text">Operation of Wastewater Treatment Plants, Vol 3</div></div>
                <div class="data">
                  <div class="text">Completion</div>
                  <div class="text">Enrollment expires: 10/11/2025</div>
                </div>
                <div class="progress">
                  <div class="percent">
                    <div class="text">30%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="object2">
              <div class="left">
                <div class="icon"></div>
              </div>
              <div class="right">
                <div class="title"><div class="text">Operation of Wastewater Treatment Plants, Vol 2</div></div>
                <div class="data">
                  <div class="text">Completion</div>
                  <div class="text">Enrollment expires: 10/11/2025</div>
                </div>
                <div class="progress">
                  <div class="percent">
                    <div class="text">65%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="view-all">
            <div class="text">(View all enrollments)</div>
          </div>
        </div>

        <div class="instructor-slides">
          <div class="header">
            <div class="icon"></div>
            <div class="text">Instructor Slides</div>
          </div>
          <div class="divider"></div>
          <div class="body">
            <div class="text">Advanced Water Treatment</div>
            <div class="text">Operation and Maintenance of Wastewater Collection Systems, Vol I</div>
            <div class="text">Operation and Maintenance of Wastewater Collection Systems, Vol II</div>
          </div>
          <div class="view-all">
            <div class="text">(View all slides)</div>
          </div>
        </div>
      </div>
      <div class="dashboard-right">

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
    object-fit: scale-down;
    object-position: center;
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
    column-gap: 16px;
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
    background-color: #007C8A;
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
    flex-direction: column;
  }

  .active-enrollments .body .object1 {
    height: 118px;
    display: flex;
    cursor: pointer;
    flex-direction: row;
  }

  .active-enrollments .body .object1 .left {
    width: 83px;
    display: flex;
    align-items: center;
  }

  .active-enrollments .body .object1 .left .icon {
    width: 59px;
    height: 71px;
    margin-left: 24px;
    border-radius: 4rem;
    display: flex;
    background-color: #5d9632;
  }

  .active-enrollments .body .object1 .right {
    width: 617px;
    display: flex;
    cursor: pointer;
    flex-direction: column;
  }

  .active-enrollments .body .object1 .right .title {
    height: 17px;
    margin-top: 23px;
    color: #034750;
  }

  .active-enrollments .body .object1 .right .title .text {
    height: 17px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: underline;
    margin-left: 13.5px;
    color: #707070;
  }

  .active-enrollments .body .object1 .right .data {
    height: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 16px;
    margin-left: 13px;
    margin-right: 24px;
  }

  .active-enrollments .body .object1 .right .data .text {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #707070;
  }

  .active-enrollments .body .object1 .right .progress {
    height: 16px;
    border-radius: 4rem;
    display: flex;
    margin-top: 8px;
    margin-left: 13px;
    margin-right: 24px;
    background-color: #7A7A7A;
  }

  .active-enrollments .body .object1 .right .progress .percent{
    width: 30%;
    border-radius: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00A5B5;
  }

  .active-enrollments .body .object1 .right .progress .percent .text {
    height: 13px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1px;
    margin-top: 2px;
    color: #FFFFFF;
  }

  .active-enrollments .body .object2 {
    height: 118px;
    display: flex;
    flex-direction: row;
  }

  .active-enrollments .body .object2 .left {
    width: 83px;
    display: flex;
    cursor: pointer;
    align-items: center;
  }

  .active-enrollments .body .object2 .left .icon {
    width: 59px;
    height: 71px;
    margin-left: 24px;
    border-radius: 4rem;
    display: flex;
    background-color: #5d9632;
  }

  .active-enrollments .body .object2 .right {
    width: 617px;
    display: flex;
    cursor: pointer;
    flex-direction: column;
  }

  .active-enrollments .body .object2 .right .title {
    height: 17px;
    margin-top: 23px;
    color: #034750;
  }

  .active-enrollments .body .object2 .right .title .text {
    height: 17px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: underline;
    margin-left: 13.5px;
    color: #707070;
  }

  .active-enrollments .body .object2 .right .data {
    height: 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 16px;
    margin-left: 13px;
    margin-right: 24px;
  }

  .active-enrollments .body .object2 .right .data .text {
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #707070;
  }

  .active-enrollments .body .object2 .right .progress {
    height: 16px;
    border-radius: 4rem;
    display: flex;
    margin-top: 8px;
    margin-left: 13px;
    margin-right: 24px;
    background-color: #7A7A7A;
  }

  .active-enrollments .body .object2 .right .progress .percent{
    width: 65%;
    border-radius: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #00A5B5;
  }

  .active-enrollments .body .object2 .right .progress .percent .text {
    height: 13px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1px;
    margin-top: 2px;
    color: #FFFFFF;
  }

  .active-enrollments .view-all {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .active-enrollments .view-all .text {
    height: 20px;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    cursor: pointer;
    color: #034750;
  }

  .instructor-slides {
    height: 250px;
    border-radius: 14rem;
    display: flex;
    flex-direction: column;
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
    border-radius: 4rem;
    margin-top: 18.53px;
    margin-left: 23.55px;
    background-color: #007C8A;
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
    height: 140px;
    display: flex;
    flex-direction: column;
  }

  .instructor-slides .body .text {
    height: 14px;
    margin-top: 25px;
    margin-left: 24px;
    font-size: 16px;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    color: #007C8A;
  }

  .instructor-slides .view-all {
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .instructor-slides .view-all .text {
    height: 20px;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 12px;
    cursor: pointer;
    color: #034750;
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
    cursor: pointer;
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
    cursor: pointer;
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
    cursor: pointer;
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
    cursor: pointer;
    color: #034750;
  }

</style>
