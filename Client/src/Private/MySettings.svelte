<script>
  import { slide, fly } from "svelte/transition";
  import { themes, theme } from "../Stores/store";

  import { user } from "../Stores/user";

  let current = "general";

  let selected = $theme;
  $: selectedTheme = $themes.find((th) => th.name === selected);

  function changeTheme() {
    localStorage.setItem("theme", selectedTheme.name);
    $theme = selectedTheme.name;
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

<div class="settings w3-section  w3-card">
  {#if current === "general"}
    {#if $user.admin}
      <p>Administrator</p>
      <input value="Ja" style:border="none" />
      <p>Medarbejder</p>
      <input value="0" style:border="none" />
    {/if}

    <p>Virksomhed</p>
    <input readonly value="Weeki" style:border="none" />

    <p>Navn</p>
    <input type="text" value={$user.name || "ikke registeret"} />

    <p>Email</p>
    <input type="email" value={$user.email} />

    <p>Agangskode</p>
    <input type="password" value={$user.password} />

    <p>Mobil nummer</p>
    <input type="number" value={$user.phone} />
  {:else if current === "app"}
    <p>Tema</p>
    <div>
      <select
        bind:value={selected}
        default={localStorage.getItem("theme") || "default"}
        style:width="100%"
        style:height="45px"
      >
        {#each $themes as theme, index}
          <option value={theme.name}>{theme["display-name"]}</option>
        {/each}
      </select>
    </div>
    <p>Farvepalet</p>
    <div style:display="flex" class="w3-border">
      <div
        style:height="45px"
        style:width="50%"
        style:background-color={selectedTheme.primary}
      />
      <div
        style:height="45px"
        style:width="50%"
        style:background-color={selectedTheme.secondary}
      />
    </div>
    <div />
    <button
      class="w3-button w3-hover w3-text-white"
      style:background-color={selectedTheme.primary}
      on:click={changeTheme}>Bekræft Tema</button
    >
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
    margin: 15px 0;
    border-bottom: 1px solid #cecece;
  }
  .active {
    border-bottom: 5px solid var(--secondary-color, ligthgrey);
  }
</style>
