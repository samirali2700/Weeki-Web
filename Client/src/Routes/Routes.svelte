<script>
  import { Router } from "svelte-navigator";

  import PublicRoutes from "./PublicRoutes.svelte";
  import PrivateRoutes from "./PrivateRoutes.svelte";

  import { loggedIn } from "../Stores/user";
</script>

<main>
  {#if $loggedIn}
    <Router primary={false}>
      <PrivateRoutes/>
    </Router>
  {:else}
    <Router primary={false}>
      <PublicRoutes/>
    </Router>
  {/if}
</main>


<style>
    @media (min-width: 640px) {
      main {
        max-width: none;
      }
    }
  </style>