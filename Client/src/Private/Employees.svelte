<script>
  import { fade, slide, fly, scale } from "svelte/transition";
  import { Router, Route, link } from "svelte-routing";

  import AddEmployee from "./Employee/AddEmployee.svelte";
  import EditEmployee from "./Employee/EditEmployee.svelte";
  import SearchEmployee from "./Employee/SearchEmployee.svelte";

  let list = [
    { name: "add", displayname: "Tilføj", component: AddEmployee },
    { name: "edit", displayname: "Redigere", component: EditEmployee },
    { name: "search", displayname: "Søg", component: SearchEmployee },
  ];

  let selected = list[0];

  $: selectedComponent = selected.component;

  function selectTab(name) {
    selected = list.find((i) => i.name === name);
  }
</script>

<div class="w3-container container w3-card-4" in:slide>
  <h1>Medarbejder</h1>
</div>
<div class=" tab">
  {#each list as item}
    <span
      class="w3-button"
      class:current={selected.name === item.name}
      on:click={() => {
        selectTab(item.name);
      }}>{item.displayname}</span
    >
  {/each}
</div>
<div class="content" />

<div>
  <svelte:component this={selectedComponent} />
</div>

<style>
  .container {
    background-color: var(--secondary-color, ligthgrey);
    color: var(--text-color, ligthgrey);
  }
  .tab {
    margin: 15px 0;
    display: flex;
    column-gap: 15px;
    border-bottom: 1px solid #cecece;
  }
  .tab > span {
    width: 100px;
  }
  .current {
    border-bottom: 5px solid var(--secondary-color);
  }
  .content {
    height: 750px;
  }
</style>
