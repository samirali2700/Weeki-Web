<script>
  //components
  import NavBar from "../Components/NavBar.svelte";
  import Footer from "../Components/Footer.svelte";
  import Loader from "../Components/Loader.svelte";

  import { isAdmin, user } from "../Stores/user";
  import { page } from "../Stores/store";

  import { navigate } from "svelte-routing";

  import {
    primary_color,
    secondary_color,
    text_color,
    isLoading,
  } from "../Stores/store";

  $: styles = {
    "primary-color": $primary_color,
    "secondary-color": $secondary_color,
    "text-color": $text_color,
    font: '"Gluten", cursive',
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");

  async function signout() {
    const response = await fetch("/signout", { method: "DELETE" });

    //201 Ok
    if (response.status === 201) {
      //reset the page state,
      //to not get an access denied or papge not found error
      $page = "/";
      $user = {};
    }
  }

  function goTo(e) {
    $page = e.detail.endpoint;
    navigate($page);
  }
</script>

<div style={cssVarStyles}>
  <NavBar isAdmin={$isAdmin} on:signout={signout} on:goTo={goTo} />
  <div class="main">
    {#if $isLoading}
      <Loader styles={{ outer: $primary_color, center: $secondary_color }} />
    {:else}
      <slot />
      <!-- Slot for Component -->
    {/if}
  </div>
  <Footer />
</div>

<style>
  .main {
    min-height: calc(100vh - 200px);
    width: 90%;
    margin: 0 auto;
    color: #000;
    border-left: 1px solid var(--secondary-color, ligthgrey);
    border-right: 1px solid var(--secondary-color, ligthgrey);
    overflow: auto;
    overflow-y: overlay;
  }
</style>
