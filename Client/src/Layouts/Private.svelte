<script>
  //components
  import NavBar from "../Components/NavBar.svelte";
  import Footer from "../Components/Footer.svelte";
  import Loader from "../Components/Loader.svelte";

  import { isAdmin } from "../Stores/user";

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
</script>

<div style={cssVarStyles}>
  <NavBar isAdmin={$isAdmin} bind:isLoading={$isLoading} />
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
    position: relative;
    width: 90%;
    margin: 0 auto;
    color: #000;
    border-left: 1px solid var(--secondary-color, ligthgrey);
    border-right: 1px solid var(--secondary-color, ligthgrey);
  }
</style>
