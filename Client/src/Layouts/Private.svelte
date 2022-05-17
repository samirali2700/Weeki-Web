<script>
  //components
  import NavBar from "../Components/NavBar.svelte";
  import Footer from "../Components/Footer.svelte";

  $: styles = {
    "primary-color": "#000",
    "secondary-color": "#0088ff",
    "text-color": "#fff",
    font: '"Gluten", cursive',
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";");
</script>

<div style={cssVarStyles}>
  <NavBar />
  <div class="main">
    <slot />
    <!-- Slot for Component -->
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
