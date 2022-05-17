<div class="main w3-row">
  <div class="content w3-half container w3-padding ">
    <slot />
  </div>
  <div id="logo" class="logo w3-half w3-black container">
    <span>W</span>
    <p>eeki</p>
  </div>
</div>

<style>
  .main {
    height: 100vh;
    width: 100vw;
  }
  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #logo > span {
    font-size: 154px;
  }
  #logo > p {
    font-size: 105px;
  }
  @media screen and (max-width: 740px) {
    #logo > span {
      font-size: 116px;
    }
    #logo > p {
      font-size: 70px;
    }
  }
</style>
