<script>
  import { navigate, Link } from "svelte-routing";
  import { loggedIn } from "../Stores/user";

  let email;
  let password;
</script>

<div class="container">
  <form on:submit|preventDefault>
    <label for="email"> Brugernavn*</label>
    <input
      id="email"
      name="email"
      bind:value={email}
      on:focus={() => console.log("focues")}
    />

    <label for="password"> Adgangskode*</label>
    <input
      id="password"
      name="password"
      type="password"
      bind:value={password}
    />

    <button
      style:height="45px"
      style:margin-top="35px"
      on:click={() => {
        $loggedIn = true;
      }}
      class="w3-button w3-blue w3-round-small w3-hover-black w3-left-align"
      >Login</button
    >
  </form>
  <p class="w3-section">
    Har du ikke en bruger? <span
      ><Link to="signup">Registrer din Virksomhed her</Link>
    </span>
  </p>
</div>

<style>
  .container {
    width: 80%;
  }
  input {
    margin-bottom: 15px;
  }
  form {
    display: grid;
    row-gap: 5px;
  }
</style>
