<script>
  import { Link, link, navigate } from "svelte-routing";
  import { fade, slide, fly, scale } from "svelte/transition";

  //store
  import { page } from "../Stores/store";

  import Logo from "./Logo.svelte";

  let menuOpen = false;

  //icons
  import TiThMenu from "svelte-icons/ti/TiThMenu.svelte";
  import GoSignOut from "svelte-icons/go/GoSignOut.svelte";
  import TiTimesOutline from "svelte-icons/ti/TiTimesOutline.svelte";
  import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte";

  // update the sessionStorage each time the page state changes
  $: sessionStorage.setItem("lastVisited", $page);

  /**
   * function to toggle the navbar flags
   * could have been inline, but is like this for future
   * and to make it easy to see, what the navbar function does
   * try to not close it if mouse is over, for future touch
   */

  function toggleMenu() {
    menuOpen = !menuOpen;
    setTimeout(() => {
      menuOpen = false;
    }, 5000);
  }

  function goToMySettings() {
    $page = "/mysettings";
    navigate("/mysettings");
  }
</script>

<div class="nav w3-row">
  <div class="w3-cell-row" style:width="70px">
    <div class="w3-cell w3-cell-middle " on:click={toggleMenu}>
      {#if !menuOpen}
        <div class="icon" in:scale>
          <TiThMenu />
        </div>
      {:else}
        <div class="icon" in:scale>
          <TiTimesOutline />
        </div>
      {/if}
    </div>
  </div>
  <div class="links" style:width="100%">
    {#if menuOpen}
      <div class=" link-container" in:fade>
        <a
          href="/"
          use:link
          class="link"
          class:current={$page === "/"}
          on:click={() => ($page = "/")}>Oversigt</a
        >
        <a
          href="/schedule"
          use:link
          class="link"
          class:current={$page === "/schedule"}
          on:click={() => ($page = "/schedule")}>Vagtplan</a
        >
        <a
          href="/messages"
          use:link
          class="link"
          class:current={$page === "/messages"}
          on:click={() => ($page = "/messages")}>Beskeder</a
        >
        <a
          href="/employees"
          use:link
          class="link"
          class:current={$page === "/employees"}
          on:click={() => ($page = "/employees")}>Medarbejder</a
        >
      </div>
    {:else}
      <div class="logo-container" in:slide>
        <Logo size={"M"} />
      </div>
    {/if}
  </div>

  {#if !menuOpen}
    <div class="tool-icons">
      <div
        class=" icon"
        style:width="50px"
        on:click={goToMySettings}
        class:current={$page === "/mysettings"}
      >
        <IoIosSettings />
      </div>
      <div class="icon" style:width="25px">
        <GoSignOut />
      </div>
    </div>
  {/if}
</div>

<style>
  .nav {
    height: 100px;
    background-color: var(--primary-color, ligthgrey);
    color: var(--text-color, ligthgrey);
    border-bottom: 4px solid var(--secondary-color, ligthgrey);
    padding: 0 5%;
    display: flex;
  }

  .icon:hover {
    color: var(--secondary-color, ligthgrey);
    cursor: pointer;
    transform: scale(0.9);
  }
  .tool-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 10px;
    width: 85px;
    height: 100%;
  }
  .links {
    padding-left: 25px;
    display: flex;
  }
  .link-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 25px;
  }
  .link {
    color: var(--text-color, ligthgrey);
    font-family: var(--font);
    font-size: x-large;
  }
  .link:hover {
    color: var(--secondary-color, ligthgrey);
  }
  .current {
    color: var(--secondary-color, ligthgrey);
    transform: scale(1.2);
  }
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
</style>
