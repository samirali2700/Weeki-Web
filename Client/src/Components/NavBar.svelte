<script>
  import { Link, link, navigate } from "svelte-routing";
  import { fade, slide, fly, scale } from "svelte/transition";

  //store
  import { page } from "../Stores/store";
  import Logo from "./Logo.svelte";

  export let isAdmin;
  export let isLoading;

  /**
   * menuOpen is used for to show the menu
   * and indicate to other parts of the component wheter it is open or not
   * navFocus is used to not close the menu as long as mouse is inside navBar
   *
   */
  let menuOpen = false;
  let navFocus = false;

  //icons
  import TiThMenu from "svelte-icons/ti/TiThMenu.svelte";
  import GoSignOut from "svelte-icons/go/GoSignOut.svelte";
  import TiTimesOutline from "svelte-icons/ti/TiTimesOutline.svelte";
  import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte";

  // update the sessionStorage each time the page state changes
  $: sessionStorage.setItem("lastVisited", $page);

  /**
   * reactive if statement, to ensure menu is not closed
   * when user is using the menu,
   * and is auto closing when the focus is away from the menu
   * by clearing the timeOut if navfocused and menu is open
   * if the user leaves the navbar but comes back before the menu is close
   * it is annoying if it closes while one tries to navigate the menu
   */

  let clear;

  $: if (!navFocus && menuOpen) {
    clear = setTimeout(() => {
      menuOpen = false;
    }, 2500);
  } else if (navFocus && menuOpen) {
    clearTimeout(clear);
  }

  function goToMySettings() {
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      $page = "/mysettings";
      navigate("/mysettings");
    }, 2500);
  }

  //array with available links > endpoint : Name
  const links_list = [
    ["/", "Oversigt"],
    ["/schedule", "Vagtplan"],
    ["/messages", "Beskeder"],
  ];
  console.log(links_list[0][1]);
</script>

<div
  class="nav"
  on:mouseleave={() => {
    navFocus = false;
  }}
  on:mouseenter={() => {
    navFocus = true;
  }}
>
  <div class="menu" style:width="70px">
    <div
      on:click={() => {
        menuOpen = !menuOpen;
      }}
    >
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
  <div class="links" class:mobile={menuOpen} in:slide>
    {#if menuOpen}
      <div class=" link-container" in:fade>
        {#each links_list as item}
          <a
            href={item[0]}
            use:link
            class="link"
            class:current={$page === item[0]}
            on:click={() => ($page = item[0])}>{item[1]}</a
          >
        {/each}

        {#if isAdmin}
          <a
            href="/employees"
            use:link
            class="link"
            class:current={$page === "/employees"}
            on:click={() => ($page = "/employees")}>Medarbejder</a
          >
        {/if}
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
        on:click={goToMySettings}
        class:current={$page === "/mysettings"}
      >
        <IoIosSettings />
      </div>
      <div class="icon">
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
    align-items: center;
    justify-content: center;
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
    width: 100%;
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
    font-size: xx-large;
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

  @media screen and (max-width: 640px) {
    .icon {
      width: 32px;
    }
    .logo-container {
      margin-left: 25px;
    }
    .menu {
      position: absolute;
      top: 25px;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile {
      position: absolute;
      top: 100px;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--primary-color, ligthgrey);
      z-index: 999;
    }
    .link-container {
      padding: 25px 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      row-gap: 10px;
      width: 100%;
    }
    .links {
      padding: 0;
    }
    .link {
      font-size: 16px;
      height: 40px;

      color: #fff;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    .link:hover {
      color: var(--secondary-color, ligthgrey);
    }

    .links .current {
      background-color: var(--secondary-color, ligthgrey);
      color: var(--primary-color, ligthgrey);
      transform: none;
    }
    .links .current:hover {
      color: var(--primary-color, ligthgrey);
    }
  }
</style>
