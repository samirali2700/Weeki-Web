<script>
  import { slide, fly } from "svelte/transition";
</script>

<div class="w3-container container w3-card-4" in:slide>
  <h1>Beskeder</h1>
</div>

<style>
  .container {
    background-color: var(--secondary-color, ligthgrey);
    color: var(--text-color, ligthgrey);
  }
</style>
