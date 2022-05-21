<script>
  import TiArrowSortedUp from "svelte-icons/ti/TiArrowSortedUp.svelte";
  import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte";
  import TiMessage from "svelte-icons/ti/TiMessage.svelte";
  import IoIosHelpCircleOutline from "svelte-icons/io/IoIosHelpCircleOutline.svelte";
  import IoIosLogOut from "svelte-icons/io/IoIosLogOut.svelte";

  export let navigation_items = {};

  let menu_items = [
    {
      name: "Kontoindstillinger",
      icon: IoIosSettings,
      endpoint: "/mysettings",
    },
  ];
  let help_items = [
    { name: "Kontakt", icon: TiMessage, endpoint: "/" },
    { name: "Guide og FAQ", icon: IoIosHelpCircleOutline, endpoint: "/" },
  ];

  let tool_items = [
    { name: "Log ud", icon: IoIosLogOut, endpoint: "/signout" },
  ];

  import MenuSection from "./MenuSection.svelte";

  export let name;
  export let email;

  export let mode;
  export let show;
</script>

{#if show}
  <div
    class="w3-card-4 menu"
    class:compact={mode === "C"}
    class:medium={mode === "M"}
    class:full={mode === "F"}
  >
    <div class="user-sidebar">
      <div class="menu-arrow">
        <TiArrowSortedUp />
      </div>
      <div class="user-sidebar-name">{name}</div>
      <div class="user-sidebar-email">{email}</div>
    </div>
    {#if mode !== "C"}
      <MenuSection
        items={navigation_items}
        style="navigation-sidebar"
        on:goTo
      />
    {/if}
    <MenuSection items={menu_items} style="menu-sidebar" on:goTo />
    <MenuSection items={help_items} style="help-sidebar" on:goTo />
    <MenuSection items={tool_items} style="tool-sidebar" on:signout />
  </div>
{/if}

<style>
  .menu {
    position: fixed;
    z-index: 999;
    background-color: #fff;
    color: #000;
    font-family: "Gluten", cursive;
  }
  .menu-arrow {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 35px;
    top: -12px;
    color: #fff;
  }

  .compact {
    right: 15px;
    top: 70px;
    width: 280px;
    height: 450px;
    padding: 0 15px;
  }
  .medium {
    right: 0;
    top: 0;
    width: 380px;
    height: 100vh;
    padding: 0 25px;
    font-size: 26px;
  }

  .full {
    right: 0;
    top: 0;
    width: 300px;
    height: 100vh;
    padding: 0 15px;
  }

  .user-sidebar-email {
    font-size: small;
    opacity: 50%;
  }
  .user-sidebar {
    border-bottom: 1px solid var(--secondary-color);
    padding: 40px 0;
  }
</style>
