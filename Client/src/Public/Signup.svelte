<script>
  import { navigate, Link } from "svelte-routing";

  import TiArrowBackOutline from "svelte-icons/ti/TiArrowBackOutline.svelte";

  import { slide } from "svelte/transition";

  //components
  import Create from "./Signup/Create.svelte";
  import Join from "./Signup/Join.svelte";

  let method = "init";
  let step = 0;

  function goBack() {
    if (method === "init") {
      navigate("/");
    } else if (method === "create" || method === "join") {
      if (step === 0) {
        method = "init";
      } else {
        step = 0;
      }
    }
  }
  function signup(e) {
    const user = e.detail[0];
    const company = e.detail[1];
  }
</script>

<div class="back" on:click={goBack}>
  <TiArrowBackOutline />
</div>

<div class="container w3-threequarter">
  {#if method === "init"}
    <div class="content w3-container" in:slide>
      <div class="title">
        <h2>Hej!</h2>
        <p>Hvad er du her for at lave i dag?</p>
      </div>
      <div>
        <div
          class="w3-card-2 w3-panel w3-hover-blue card"
          on:click={() => {
            method = "create";
          }}
        >
          <b>Oprette en ny bruger</b>
          <small>Jeg vil gerne se om Weeki er noget for min virksomhed</small>
        </div>
        <div
          class="w3-card-2 w3-panel w3-hover-blue card"
          on:click={() => {
            method = "join";
          }}
        >
          <b>Slutte mig til mine kollegaer</b>
          <small>Jeg vil gerne finde mit hold og se min vagtplan</small>
        </div>
      </div>
      <div />
    </div>
  {:else if method === "create"}
    <Create bind:step on:signup={signup} />
  {:else if method === "join"}
    <Join />
  {/if}
</div>

<style>
  .card {
    border: 1px solid #fff;
    cursor: pointer;
    padding: 15px 10px;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    border: 1px solid #808080;
    margin-bottom: 5px;
  }
  .title {
    margin-bottom: 25px;
  }
  h2,
  p {
    font-family: "Gluten", cursive;
    font-weight: bold;
    margin-bottom: 10px;
  }
  b {
    user-select: none;
    font-family: "Allerta Stencil", Sans-serif;
  }
  small {
    user-select: none;
  }
  .back {
    position: absolute;
    width: 52px;
    height: 52px;
    top: 1%;
    left: 5%;
  }
  .back:hover {
    cursor: pointer;
    transform: scale(0.9);
    color: #0088ff;
  }
  .container {
    margin: 0 7%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .content {
    width: 100%;
  }
</style>
