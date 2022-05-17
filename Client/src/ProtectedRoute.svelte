<script>
  import { Route, navigate } from "svelte-routing";
  import { loggedIn } from "./Stores/user";

  export let path;
  export let component;

  $: isAuthenticated = $loggedIn;
</script>

{#if isAuthenticated}
  <Route {path}>
    <svelte:component this={component} />
  </Route>
{/if}
