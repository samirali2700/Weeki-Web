<script>
  import { Router, Route, navigate } from "svelte-routing";
  import ProtectedRoute from "./ProtectedRoute.svelte";

  import Login from "./Public/Login.svelte";
  import Signup from "./Public/Signup.svelte";

  import Home from "./Private/Home.svelte";
  import Schedule from "./Private/Schedule.svelte";
  import Messages from "./Private/Messages.svelte";
  import Employees from "./Private/Employees.svelte";
  import MySettings from "./Private/MySettings.svelte";
  import NotFound from "./NotFound.svelte";
  import CommingSoon from "./CommingSoon.svelte";

  import Public from "./Layouts/Public.svelte";
  import Private from "./Layouts/Private.svelte";
  import { onMount } from "svelte";

  import { page, isLoading } from "./Stores/store";
  import { loggedIn, user } from "./Stores/user";

  /**
   * Ensure that the page the user lands on after refresh is the lastVisited
   */

  onMount(() => {
    if ($loggedIn) {
      navigate($page);
    } else {
      navigate("/");
    }
  });

  function login() {}

  let development = true;
</script>

{#if development}
  <CommingSoon />
{:else}
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
        <Route path="/">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route>
          <div>
            <NotFound />
          </div>
        </Route>
      </Public>
    {/if}
  </Router>
{/if}

<style>
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
