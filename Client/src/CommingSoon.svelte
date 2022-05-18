<script>
  import Logo from "./Components/Logo.svelte";

  const styles = `--secondary-color: #0088ff;`;
  let info = false;
</script>

<div class="main">
  <div class="container w3-container w3-border" style={styles}>
    <div>
      <Logo size={"L"} />
    </div>
    <h1>Vi kommer snart!</h1>
    <div class="w3-center w3-section">
      <b>Hvis alt går vel, er vi ude sommer 2023</b>
    </div>
    <div class="content w3-container  w3-center">
      <p>
        Snart kommer vi ud med <b> Weeki</b>, et management system for all typer
        virksomheder og størrelser.
      </p>
    </div>
  </div>
  <div class="container">
    <p
      class="w3-button w3-hover-blue"
      on:click={() => {
        info = !info;
        y = 250;
      }}
    >
      Se hvad Vi kan gøre for dig
    </p>
    {#if info}
      <div class="container content-container">
        <div
          class="content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom"
        >
          <b>For dig der er leder</b>
          <ul>
            <li>Du får kontrol og overblik over dine ansatte</li>
            <li>Du får kontrol og overblik over vagtplanen</li>
            <li>Du kan nemt og hurtigt kommunikere med dine ansatte</li>
          </ul>
        </div>
        <div
          class="content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom"
        >
          <b>For dig der er ansat</b>
          <ul>
            <li>Du får kontrol og overblik over dine vagter</li>
            <li>Søg ferie/fri dag/sygdag og mere gennem appen</li>
            <li>Byt vagter med dine kollegaer</li>
            <li>Anmod om flere vagter eller færre</li>
          </ul>
        </div>
        <div
          class="content w3-container w3-section w3-card-4 w3-blue w3-border w3-border-white w3-animate-zoom"
        >
          <b>For Alle</b>
          <ul>
            <li>
              Din data er sikker hos os, vi vidergiver ikke data til tredjepart
            </li>
            <li>
              Du behøver ikke at nøjes med vores Original Tema, du kan vælge fra
              et divers udvalg eller vælg dine helt egene unikke tema
            </li>
            <li>
              Vores mål er at gøre vores produkt til et brugervenligt produkt,
              dvs. at du skal kunne tage kontrol over alt hvad du gerne vil tage
              kontrol over
            </li>
          </ul>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .main {
    height: 100vh;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px 0;
  }
  .content {
    padding: 50px 25px;
    width: 80%;
  }
  p,
  ul {
    font-family: "Gluten", cursive;
  }
  ul {
    margin: 10px 25px;
  }
</style>
