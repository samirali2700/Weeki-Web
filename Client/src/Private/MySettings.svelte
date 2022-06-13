<script>
  import { slide, scale } from "svelte/transition";
  import { themes, theme } from "../Stores/store";

  import { user, isAdmin } from "../Stores/user";

  import General from "../Components/MySettings/General.svelte";
  import App from "../Components/MySettings/App.svelte";

  let current = "app";
  let selected = $theme;

  let playingTheme = "";
  let playingThemeName = "";

  function setTheme() {
    $theme = playingThemeName;
  }

  function changeTheme() {
    localStorage.setItem("theme", selected);
    $theme = selected;
  }
  let playInterval;
  let count = 0;

  function playTheme(e) {
    //either true or false
    //cannot be false without having been true
    //false would mean to stop the ongoing play

    //make sure themes is not empty | very unlikely
    //and to clear the interval after there is no more themes in array
    //the last is a custom theme

    if (e.detail) {
      playInterval = setInterval(() => {
        if (count < $themes.length - 1) {
          const theme = $themes[count];
          count++;
          playingTheme = theme["display-name"];
          playingThemeName = theme.name;
          setTheme();
        } else {
          clearInterval(playInterval);
          count = 0;
          playingTheme = "";
          changeTheme();
        }
      }, 2000);
    } else {
      clearInterval(playInterval);
    }

    count = 0;
    playingTheme = "";
    changeTheme();
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

<div class="content-container">
  {#if current === "general"}
    <div in:slide>
      <General isAdmin={$isAdmin} user={$user} />
    </div>
  {:else if current === "app"}
    <div in:slide>
      <App
        themes={$themes}
        bind:selected
        bind:playingTheme
        on:click={changeTheme}
        on:playTheme={playTheme}
      />
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
    margin: 25px 0 0 25px;
    border-bottom: 1px solid #cecece;
  }
  .active {
    border-bottom: 5px solid var(--secondary-color, ligthgrey);
  }
  .content-container {
    padding: 25px 25px 25px 25px;
  }
</style>
