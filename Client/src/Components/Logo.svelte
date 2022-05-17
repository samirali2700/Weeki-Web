<script>
  export let size;

  //the logo is going to be in 3 sizes, additionaly size can be added later
  //small -footer
  //medium - navBar
  //large - Intro logo /login

  //chage the font family of the logo
  let font_family = "";

  //default
  let w_size;
  let eeki_size;

  switch (size) {
    case "S":
      w_size = "36px";
      eeki_size = "16px";
      break;
    case "M":
      w_size = "76px";
      eeki_size = "46px";
      break;
    case "L":
      w_size = "106px";
      eeki_size = "96px";
      break;
    default:
      w_size = "56px";
      eeki_size = "36px";
  }

  let styles = {
    "w-size": w_size,
    "eeki-size": eeki_size,
  };

  $: logoStyles = Object.entries(styles)
    .map(([key, value]) => `--${key}: ${value}`)
    .join(";");
</script>

<div id="logo" style={logoStyles}>
  <span>W</span>
  <p>eeki</p>
</div>

<style>
  #logo > span {
    font-size: var(--w-size, "76px");
    color: var(--secondary-color, ligthgrey);
  }
  #logo > p {
    font-size: var(--eeki-size, "56px");
  }
</style>
