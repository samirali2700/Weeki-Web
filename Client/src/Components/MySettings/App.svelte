<script>
  export let themes;
  export let selected;

  $: selectedTheme = themes.find((th) => th.name === selected);
</script>

<div class="container">
  <p>Tema</p>
  <select
    bind:value={selected}
    default={localStorage.getItem("theme") || "default"}
    style:width="100%"
    style:height="45px"
  >
    {#each themes as theme, index}
      <option value={theme.name}>{theme["display-name"]}</option>
    {/each}
  </select>

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
  <button
    class="w3-button w3-hover"
    style:background-color={selectedTheme.primary}
    style:color={selectedTheme.text}
    on:click>Bekræft Tema</button
  >
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 50px;
    row-gap: 15px;
  }

  select {
    background-color: var(--primary-color, darkgrey);
    color: var(--text-color, ligthgrey);
  }
</style>
