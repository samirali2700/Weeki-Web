<script>
  import { navigate, Link } from "svelte-routing";
  import { loggedIn } from "../Stores/user";

  let email;
  let password;
</script>

<div>
  <h1>hello</h1>
  <button
    class="w3-button w3-blue w3-hover-blakc"
    on:click={() => {
      navigate("/");
    }}>Login</button
  >
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
