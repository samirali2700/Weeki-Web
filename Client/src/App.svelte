<script>
  //svelte-routing  and protected Route
  import { Router, Route, navigate } from "svelte-routing";
  import ProtectedRoute from "./ProtectedRoute.svelte";

  //Public components/pages
  import Login from "./Public/Login.svelte";
  import Signup from "./Public/Signup.svelte";

  //Private components/pages
  import Home from "./Private/Home.svelte";
  import Schedule from "./Private/Schedule.svelte";
  import Messages from "./Private/Messages.svelte";
  import Employees from "./Private/Employees.svelte";
  import MySettings from "./Private/MySettings.svelte";
  import NotFound from "./NotFound.svelte";

  //loader component
  import Loader from "./Components/Loader.svelte";

  /**
   * layout is as the word tells, a layout for the pages
   * the difference between a public and private is big
   * so keeping them seperate is for the better
   * also logic for the different authorization is done inside the layouts
   * since the layout is a source of truth for all the pages
   * Public Layout => Login | Signup
   * Private Layout => Home | Schedule | Messages | Employees | MySettings
   *
   *
   */
  import Public from "./Layouts/Public.svelte";
  import Private from "./Layouts/Private.svelte";

  import { onMount } from "svelte";

  //stores
  import { page, primary_color, secondary_color } from "./Stores/store";
  import { loggedIn, user } from "./Stores/user";

  /**
   * while the app is loading and waiting for the response from the server
   * the state is init, and a loading screen will cover the whole page
   */

  let state = "init";

  onMount(async () => {
    //$user = { name: "ali", email: "samirali@live.dk" };
    /**
     * auth needs to be done here, and on Mount
     * that is, to early on define whether the user is authorized to access the private pages
     * this will all happen, while the user is seeing the loader
     * so even if the first landing page is the login,
     * and the user is authenticated and gets access to Home
     * and the routes hopes from login to Home, it will all be hidden from the user
     * and the user will only see the screen he is suppose to
     */

    // const respons = await fetch("/api/auth");
    // const data = await respons.json();

    // if (respons.status !== 403) {
    //   $user = data;
    //   navigate($page);
    // } else {
    //   navigate("/");
    // }
    // navigate($page);
    state = "ready";
  });
</script>

{#if state === "init"}
  <Loader styles={{ outer: $primary_color, center: $secondary_color }} />
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
