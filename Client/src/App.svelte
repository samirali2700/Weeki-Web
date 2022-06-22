<script>
  import Loader from "./Components/Loader.svelte";
  import Routes from "./Routes/Routes.svelte";

  import { onMount } from "svelte";

  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { primary_color, secondary_color, default_primary, default_secondary } from "./Stores/store";
  import { user, loggedIn } from "./Stores/user";


  let state = "init";

  $: primary = $loggedIn ? $primary_color : $default_primary;
  $: secondary = $loggedIn ? $secondary_color: $default_secondary;


  onMount(async () => {
    const response = await fetch('/auth');
    const { payload } = await response.json();
    if(payload) {
      $user = payload.user;
    }
    state = "ready";
  });

  const options = {
    reversed: true, intro: { x: -200 } 
  };

</script>
<SvelteToast {options} />
{#if state === "init"}
  <Loader styles={{ outer: primary, center: secondary }} />
{:else}
  <Routes />
{/if}

