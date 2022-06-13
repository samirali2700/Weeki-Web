<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let themes;
  export let selected;

  $: playing = playingTheme !== "" ? true : false;

  export let playingTheme = "";

  $: selectedTheme = themes.find((th) => th.name === selected);

  $: show_primary = playing ? "" : selectedTheme.primary || "";
  $: show_secondary = playing ? "" : selectedTheme.secondary || "";
  $: show_playing_primary = playing ? "" : "#fff";

  function playThemes() {
    playing = !playing;
    if (playing) {
      dispatch("playTheme", true);
    } else {
      dispatch("playTheme", false);
    }
  }
</script>

<div class="main">
  <div class="container pick-container">
    <b class="intro">Vælg en tema fra vores eget udvalg</b>

    <p>Tema</p>
    <select
      bind:value={selected}
      default={localStorage.getItem("theme") || "default"}
      class="item"
    >
      {#each themes as theme}
        {#if theme.name !== "custom"}
          <option value={theme.name}>{theme["display-name"]}</option>
        {/if}
      {/each}
    </select>
    <div style:display="flex" class="w3-border">
      <div class="show-primary show" style:background-color={show_primary} />
      <div
        class="show-secondary show"
        style:height="45px"
        style:width="50%"
        style:background-color={show_secondary}
      />
    </div>
    <button
      class="w3-button w3-hover w3-hover-black confirm"
      style:background-color={selectedTheme.primary}
      style:color={selectedTheme.text}
      disabled={playing}
      on:click>Bekræft Tema</button
    >
    <div />
  </div>
  <div class="container play-container">
    <button class="w3-button r play-button" on:click={playThemes}
      >{#if !playing}Start Visual præsentation{:else}Stop{/if}</button
    >
    <div class="content" style:background-color={show_playing_primary}>
      <b>
        {playingTheme}
      </b>
    </div>
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
  }
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 15px;
    column-gap: 25px;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-color);
    background-color: var(--primary-color);
  }
  .play-button {
    border: 1px solid var(--primary-color);
  }
  .play-container {
    border-top: 1px solid var(--primary-color);
    padding: 25px 0 50px 0;
  }
  select {
    background-color: var(--primary-color, darkgrey);
    color: var(--text-color, ligthgrey);
  }
  .intro {
    grid-column: 1/ 3;
  }
  .item {
    height: 45px;
    width: 100%;
  }
  .show {
    height: 45px;
    width: 50%;
  }
  .show-primary {
    background-color: var(--primary-color);
  }
  .show-secondary {
    background-color: var(--secondary-color);
  }

  @media screen and (max-width: 460px) {
    .container {
      display: flex;
      flex-direction: column;
    }
  }
</style>
