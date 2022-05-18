<script>
  import { Circle2 } from "svelte-loading-spinners";

  //default colors, if none are set from parent component
  export let styles = { outer: "#0088ff", center: "#000" };
</script>

<div class="container w3-border">
  <Circle2
    size="80"
    colorOuter={styles.outer}
    colorCenter={styles.center}
    colorInner={styles.outer}
  />
</div>

<style>
  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
