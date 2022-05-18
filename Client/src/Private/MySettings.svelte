<script>
  import { slide, scale } from "svelte/transition";
  import { themes, theme } from "../Stores/store";

  import { user, isAdmin } from "../Stores/user";

  import General from "../Components/MySettings/General.svelte";
  import App from "../Components/MySettings/App.svelte";

  let current = "general";
  let selected = $theme;

  function changeTheme() {
    localStorage.setItem("theme", selected);
    $theme = selected;
  }
</script>

<div class="w3-container container w3-card-4" in:slide>
  <h1>Mine indstillinger</h1>
</div>
<div class="tab">
  <span
    class=" w3-button w3-hover-light-grey"
    class:active={current === "general"}
    on:click={() => (current = "general")}>General</span
  >
  <span
    class="w3-button w3-hover-light-grey"
    class:active={current === "app"}
    on:click={() => (current = "app")}>App</span
  >
  <span
    class="w3-button w3-hover-light-grey"
    class:active={current === "mere"}
    on:click={() => (current = "mere")}>mere</span
  >
</div>

<div class="w3-container content">
  {#if current === "general"}
    <div in:slide>
      <General isAdmin={$isAdmin} user={$user} />
    </div>
  {:else if current === "app"}
    <div in:slide>
      <App themes={$themes} bind:selected on:click={changeTheme} />
    </div>
  {:else if current === "mere"}
    <h1>mere</h1>
  {/if}
</div>

<style>
  .container {
    background-color: var(--secondary-color, ligthgrey);
    color: var(--text-color, ligthgrey);
  }
  .tab {
    margin-top: 15px;
    border-bottom: 1px solid #cecece;
  }
  .active {
    border-bottom: 5px solid var(--secondary-color, ligthgrey);
  }
</style>
