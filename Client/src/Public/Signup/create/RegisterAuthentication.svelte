<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    import { toast } from '@zerodevx/svelte-toast';
    

    let authentication = {
      email: "samirali@live.dk",
      password: "123456789",
    };

    let rePass = "123456789";
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
  function registerUser (){
    if(match){
      dispatch("registerAuthentication", authentication);
    }
  }
</script>

<div class="w3-animate-bottom">
    <div class="title">
      <h2>Opret en ny bruger</h2>
      <p>Først har vi brug for din login oplysninger</p>
    </div>
    <form on:submit|preventDefault={registerUser}>
      <label>
        Email*
        <input
          type="email"
          bind:value={authentication.email}
          class="w3-card-2 inputs"
          placeholder="Efternavn inputs"
          required
        />
      </label>
      <label>
        Adgangskode*
        <input
          type="password"
          bind:value={authentication.password}
          on:input={checkMatch}
          required
          class="w3-card-2 inputs"
        />
      </label>
      <label>
        Bekræft Adgangskode*
        <input
          type="password"
          bind:value={rePass}
          on:input={checkMatch}
          required
          class="w3-card-2 inputs"
          class:error={!match}
        />
      </label>
      <input
        type="submit"
        value="Næste Trin"
        class="w3-button w3-left-align button inputs"
      />
    </form>
  </div>