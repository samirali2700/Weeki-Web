<script>
    import PasswordInput from "../../../Components/PasswordInput.svelte";
    export let authentication = {};

    let rePass = "";
    let match = true;

    function checkMatch() {
    if (rePass.length > 0) {
        if (authentication.password !== rePass) {
                match = false;
        } else {
            match = true;
        }
    } 
  }

</script>

<div class="w3-animate-bottom">
    <div class="title">
      <h2>Opret en ny bruger</h2>
      <p>Først har vi brug for din login oplysninger</p>
    </div>
    <form on:submit|preventDefault>
      <label>
        E-mail*
        <input
          type="email"
          bind:value={authentication.email}
          class="w3-card-2 inputs"
          required
        />
      </label>
      <label for="password">Adgangskode*</label>
      <PasswordInput error={false}  bind:password={authentication.password} on:input={checkMatch}/>
      
      <label for='re-password'>Bekræft Adgangskode*</label>
      <PasswordInput id='re-password' error={!match}  bind:password={rePass} on:input={checkMatch}/>

      <input
        type="submit"
        value="Næste Trin"
        class="w3-button w3-left-align button inputs"
        disabled={!match}
      />
    </form>
  </div>
