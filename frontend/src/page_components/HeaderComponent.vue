<template>
  <div class="header">
    <div class="left"><img src="../assets/owp_logo.png"/></div>
    <div class="center"></div>
    <div class="right">
      <div class = "search-bar"><input type=text placeholder="Search" class="search"></input></div>
      <div class="help_btn"></div>
      <div class="divider"></div>
      <div class="messages_btn"></div>
      <div class="notif_btn"></div>
      <div class="divider"></div>
      <div class="account_btn">
        <div class="icon"></div>
        <div class="text">User</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
    background-color: white;
  }

  .header .right .help_btn {
    width: 24.05px;
    height: 24.05px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .messages_btn {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .notif_btn {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    margin-left: 16.5px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .account_btn {
    height: 24.05px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-left: 16.5px;
  }

  .header .right .account_btn .icon {
    width: 24.05px;
    height: 24.05px;
    border-radius: 4px;
    background-color: #034750;
    border-radius: 4px;
    border: #FFFFFF;
    border-style:solid;
    border-width: 2px;
  }

  .header .right .account_btn .text {
    font-size: 15px;
    font-family: Myriad Pro;
    margin-top: 4px;
    margin-left: 8px;
    color: #FFFFFF;
  }
</style>
