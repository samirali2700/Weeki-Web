<script>
  import { fade, slide, fly, scale } from "svelte/transition";


  import Overview from "./Employee/Overview.svelte";
  import AddEmployee from "./Employee/AddEmployee.svelte";
  import EditEmployee from "./Employee/EditEmployee.svelte";
  import SearchEmployee from "./Employee/SearchEmployee.svelte";

  import { Router, Route, link, Link} from "svelte-navigator";
  import Loader from "../Components/Loader.svelte";
  import { secondary_color, primary_color } from "../Stores/store";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator"

  export let location;
  let loading = false;

  onMount(() => {
    navigate('/employees/register')
  });

</script>

  <div class="w3-container container w3-card-4" in:slide>
    <h1>Medarbejder</h1>
  </div>
  <div class=" tab">
      <a class="w3-button w3-hover-light-gray" class:current={location.pathname === '/employees'} use:link href="/employees/">Oversigt</a>
      <a class="w3-button w3-hover-light-gray" class:current={location.pathname === '/employees/register'} use:link href="/employees/register">Tilføj</a>
      <a class="w3-button w3-hover-light-gray" class:current={location.pathname === '/employees/search'} use:link href="/employees/search">Søg</a>
  </div>

  <div class="content parent">
    {#if loading}
    <div class="w3-border loader">
      <Loader type={'BarLoader'} color={$primary_color}/>
    </div>
    {:else}
    <Router primary={false}>
        <Route path="/"><Overview/></Route>
        <Route path="/register"><AddEmployee/></Route>
    </Router>
    {/if}
  </div>


<style>
  .container {
    background-color: var(--secondary-color, ligthgrey);
    color: var(--text-color, ligthgrey);
  }
  .tab {
    margin: 15px 0;
    display: flex;
    column-gap: 0;
    border-bottom: 1px solid #cecece;
  }
  .tab > a {
    width: 100px;
  }
  .current {
    border-bottom: 5px solid var(--secondary-color);
  }
  .content {
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .parent :global(.loader){
    position: relative;
    height: 100%;
    width:100%;
  }
  .parent :global(.container){
    width:100%; 
    height:100%;
  }
</style>
