<script>
  import { Router, Route, navigate } from "svelte-routing";
  import ProtectedRoute from "./ProtectedRoute.svelte";

  import { loggedIn } from "./Stores/user";

  import Login from "./Public/Login.svelte";
  import Signup from "./Public/Signup.svelte";

  import Home from "./Private/Home.svelte";
  import Schedule from "./Private/Schedule.svelte";
  import Messages from "./Private/Messages.svelte";
  import Employees from "./Private/Employees.svelte";
  import MySettings from "./Private/MySettings.svelte";
  import NotFound from "./NotFound.svelte";

  import Public from "./Layouts/Public.svelte";
  import Private from "./Layouts/Private.svelte";
  import { onMount } from "svelte";

  import { page } from "./Stores/store";

  /**
   * Ensure that the page the user lands on after refresh is the lastVisited
   */
  onMount(() => {
    navigate($page);
  });
</script>

<Router>
  {#if $loggedIn}
    <main>
      <Private>
        <ProtectedRoute path="/" component={Home} />
        <ProtectedRoute path="/schedule" component={Schedule} />
        <ProtectedRoute path="/messages" component={Messages} />
        <ProtectedRoute path="/employees" component={Employees} />
        <ProtectedRoute path="/mysettings" component={MySettings} />
        <Route>
          <NotFound />
        </Route>
      </Private>
    </main>
  {:else}
    <Public>
      <Route path="/" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={Login} />
    </Public>
  {/if}
</Router>

<style>
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
