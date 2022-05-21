<script>
  import { Link, link, navigate } from "svelte-routing";
  import { fade, slide, fly, scale } from "svelte/transition";

  //store
  import { page } from "../Stores/store";

  import Logo from "./Logo.svelte";

  export let isAdmin;

  /**
   * menuOpen is used for to show the menu
   * and indicate to other parts of the component wheter it is open or not
   * navFocus is used to not close the menu as long as mouse is inside navBar
   *
   */

  import TiHomeOutline from "svelte-icons/ti/TiHomeOutline.svelte";

  import MdSchedule from "svelte-icons/md/MdSchedule.svelte";
  import IoIosChatboxes from "svelte-icons/io/IoIosChatboxes.svelte";
  import IoIosClose from "svelte-icons/io/IoIosClose.svelte";
  import IoIosPeople from "svelte-icons/io/IoIosPeople.svelte";

  import Menu from "./Menu/Menu.svelte";
  import MyAccount from "./Menu/MyAccount.svelte";
  import MenuLinks from "./Menu/MenuLinks.svelte";
  import { onMount } from "svelte";

  // update the sessionStorage each time the page state changes
  $: sessionStorage.setItem("lastVisited", $page);

  let name = "Ali Chouikhi";
  let email = "samirali@live.dk";

  let show = false;

  //array with available links
  let navigation_items = [
    { name: "Oversigt", icon: TiHomeOutline, endpoint: "/" },
    { name: "Vagtplan", icon: MdSchedule, endpoint: "/schedule" },
    { name: "Beskeder", icon: IoIosChatboxes, endpoint: "/messages" },
  ];

  onMount(() => {
    if (isAdmin) {
      navigation_items = [
        ...navigation_items,
        {
          name: "Medarbejder",
          icon: IoIosPeople,
          endpoint: "/employees",
        },
      ];
    }
  });

  let screenWidth;

  //compact, medium, full
  $: menu_mode = screenWidth > 1100 ? "C" : screenWidth > 760 ? "M" : "F";

  function goTo(e) {
    show = false;
    // $page = e.detail.endpoint;
    // navigate($page);
  }
</script>

<!-- Bind window innerWidth prop -->
<svelte:window bind:innerWidth={screenWidth} />

<div class="nav">
  <!-- Logo -->
  <div class="logo-container">
    <Logo size={"M"} />
  </div>

  <!-- Links -->
  {#if menu_mode === "C"}
    <div class="links">
      <MenuLinks {navigation_items} bind:page={$page} />
    </div>
  {/if}

  <!-- Overlay with menu -->
  <div class:overlay={show && menu_mode !== "C"} />

  <!-- Menu -->
  {#if show && menu_mode !== "C"}
    <div class="menu-close" on:click={() => (show = false)}><IoIosClose /></div>
  {/if}

  <div class="menu">
    <MyAccount bind:show {menu_mode} />
    <Menu
      {navigation_items}
      {name}
      {email}
      bind:mode={menu_mode}
      bind:show
      on:goTo={goTo}
      on:goTo
      on:signout
    />
  </div>
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
    justify-content: space-between;
  }
  .logo-container {
    display: flex;
    align-items: center;
  }

  .menu {
    position: absolute;
    top: 25px;
    right: 90px;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 70%;
    z-index: 5;
  }

  .menu-close {
    width: 52px;
    height: 52px;
    position: fixed;
    right: 25px;
    top: 15px;
    z-index: 999999;
    color: var(--primary-color);
  }
  .menu-close:hover {
    color: var(--secondary-color);
    cursor: pointer;
  }
</style>
