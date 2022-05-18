<script>
  import Logo from "../Components/Logo.svelte";
  import Loader from "../Components/Loader.svelte";

  import { isLoading } from "../Stores/store";

  /**
   * This is for the public layout
   * becuase the private layout has themes and logo is set with a --seconday-color
   * that is passed down from parent to Logo, the same needs to be done from the public
   * but since i want a neutral default, and don't want the themes to go outside the private layout
   * some neccessary (--seconday-color) params needs to be passsed down to the Logo, in order to have the default color
   */

  const styles = `--secondary-color: #0088ff;`;

  /**
   * Reative logo for smaller screens
   * by binding the svelte:windows property innerWidth
   * the size of width is available to do some logic with
   * if the screen is smaller than 900 and equal to 'L': this is done to not run the code infinitly when the screen is smaller than 900
   * the same for bigger than 900 and equal to 'M'
   */

  let width;
  let size = "L";

  $: if (width < 900 && size === "L") {
    size = "M";
  } else if (width > 900 && size === "M") {
    size = "L";
  }

  function clicked() {}
</script>

<svelte:window bind:innerWidth={width} />
<div class="main w3-row" style={styles}>
  <div class="content w3-half container">
    {#if $isLoading}
      <Loader />
    {:else}
      <slot />
    {/if}
  </div>
  <div id="logo" class="logo w3-half w3-black container w3-hide-small">
    <Logo bind:size />
  </div>
</div>

<style>
  .content {
    position: relative;
  }
  .main {
    height: 100vh;
    width: 100vw;
  }
  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 960px) {
  }
</style>
