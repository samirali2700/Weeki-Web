<script>
  import { navigate } from "svelte-routing";
  import { slide } from "svelte/transition";

  let counter = 5;
  const dcr = () => (counter -= 1);

  let clear = setInterval(dcr, 1000);

  setTimeout(() => {
    clearInterval(clear);
    navigate("/", { replace: true });
  }, 5000);
</script>

<div class="w3-container container" in:slide>
  <h1>Page not found | Access Denied</h1>
</div>

<div class="w3-container w3-border content">
  <b>You either do not have access to this page or the page does not exist</b>

  <div class="w3-container w3-large w3-section">
    <h2>Redirecting in... {counter}</h2>
  </div>
</div>

<style>
  .container {
    background-color: var(--secondary-color, lightgrey);
    color: var(--text-color, lightgrey);
  }
  .content {
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
