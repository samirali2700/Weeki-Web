<script>
  //default arrow for all items
  import IoIosArrowForward from "svelte-icons/io/IoIosArrowForward.svelte";

  //import dispatcher
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  // {name, endpoint, and icon}
  export let item;

  function dispatchClick(endpoint) {
    if (endpoint === "/signout") {
      dispatch("signout");
    } else dispatch("goTo", { endpoint: endpoint });
  }
</script>

<div class="sidebar-item" on:click={() => dispatchClick(item.endpoint)}>
  <div class="sidebar-icon">
    <svelte:component this={item.icon} />
  </div>
  <div>
    {item.name}
  </div>
  <div class="sidebar-arrow">
    <IoIosArrowForward />
  </div>
</div>

<style>
  .sidebar-icon {
    background-color: var(--primary-color);
    color: var(--secondary-color);
    border-radius: 50%;
    width: 38px;
    height: 38px;
    padding: 5px;
  }
  .sidebar-item {
    padding: 0 4px;
    border-radius: 50px 50px 50px 50px;
    display: flex;
    align-items: center;
    height: 45px;
    column-gap: 15px;
    margin-bottom: 10px;
  }
  .sidebar-item:hover {
    background-color: var(--secondary-color);
    user-select: none;
    cursor: pointer;
    color: var(--text-color);
  }
  .sidebar-item:hover .sidebar-icon {
    background-color: var(--secondary-color);
    color: var(--primary-color);
  }

  .sidebar-arrow {
    width: 28px;
    height: 28px;
    position: absolute;
    right: 20px;
  }
</style>
