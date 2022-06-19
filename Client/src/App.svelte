<script>
  import Loader from "./Components/Loader.svelte";
  import Routes from "./Routes/Routes.svelte";

  import { onMount } from "svelte";

  import { SvelteToast } from "@zerodevx/svelte-toast";


  import { page, primary_color, secondary_color } from "./Stores/store";
  import { user } from "./Stores/user";


  let state = "init";
  let theme = 'light';

  onMount(async () => {
    // const response = await fetch('/auth');
    // const { payload } = await response.json();
    // if(payload) {
    //   // $user = payload;
    // }
    state = "ready";
  });
  const options = {
    reversed: true, intro: { x: -200 } 
  };

</script>
<SvelteToast {options} />
{#if state === "init"}
  <Loader styles={{ outer: $primary_color, center: $secondary_color }} />
{:else}
  <Routes />
{/if}

