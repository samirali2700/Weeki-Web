<script>
  import { link } from "svelte-routing";
  import { slide } from "svelte/transition";

  import { isLoading } from "../Stores/store";
  import { user } from "../Stores/user";

  let user_ = {
    email: "samirali@live.dk",
    password: "123456789",
  };
  function login() {
    $isLoading = true;
    setTimeout(() => {
      $user = { name: "Ali", admin: true };
      $isLoading = false;
    }, 2500);
  }
</script>

<div class="container w3-threequarter" in:slide>
  <div class="content">
    <div class="intro">
      <h1 class="text">Velkommen Tilbage</h1>
      <p class="text">Login og planlæg din vagtplan nemt og hutigt!</p>
    </div>
    <div>
      <form on:submit|preventDefault={login}>
        <label for="email"> Brugernavn*</label>
        <input id="email" name="email" bind:value={user_.email} required />

        <label for="password"> Adgangskode*</label>
        <input
          id="password"
          type="password"
          bind:value={user_.password}
          required
        />

        <input
          type="submit"
          style:height="45px"
          style:margin-top="35px"
          value="Login"
          class="w3-button w3-round-small w3-hover-black w3-left-align"
        />
      </form>
    </div>
    <div>
      <p class="w3-section">
        Har du ikke en bruger? <span
          ><a href="/signup" use:link>Registrer din Virksomhed her</a>
        </span>
      </p>
    </div>
  </div>
</div>

<style>
  h1 {
    font-family: "Gluten", cursive;
    font-weight: bold;
  }
  a {
    color: #0088ff;
  }
  label {
    font-size: 12px;
  }

  .intro > p {
    color: #808080;
  }
  .intro {
    margin-bottom: 25px;
  }
  .container {
    margin: 0 7%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 100%;
  }
  input {
    margin-bottom: 15px;
  }
  input[type="submit"] {
    background-color: #0088ff;
    color: #fff;
    margin-top: 25px;
  }
  form {
    display: grid;
    row-gap: 5px;
  }
</style>
