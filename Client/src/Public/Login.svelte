<script>
    import Loader from "../Components/Loader.svelte";
    import { link } from "svelte-navigator";

    
    let isLoading = false;

      
    let email;
    let password;

    async function login() {
    isLoading = true;
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    };
    const response = await fetch("/signin", options);
    const { payload, error} = await response.json();

    if(payload){
    //    $user = payload;
    } else {
      toast.pop()
      toast.push(error, {
          theme: {
            '--toastBackground': '#F56565',
            '--toastBarBackground': '#C53030'
          }
        })
    }
    isLoading = false;
  }
</script>


{#if isLoading}
    <Loader/>
{:else}
    <div class="container w3-animate-zoom">
        <div class="content">
            <div class="intro">
                <h1 class="text">Velkommen Tilbage</h1>
                <p class="intro-text text">Login og planlæg din vagtplan nemt og hutigt!</p>
            </div>
        </div>
        <div class="content">
            <form on:submit|preventDefault={login}>
              <label for="email"> Brugernavn*</label>
              <input id="email" name="email" bind:value={email} required />
    
              <label for="password"> Adgangskode*</label>
              <input id="password" type="password" bind:value={password} required />
    
              <input
                type="submit"
                style:height="45px"
                style:margin-top="35px"
                value="Login"
                class="w3-button w3-round-small w3-hover-black w3-left-align"
              />
            </form>
        </div>
        <div class="content">
            <p class="w3-section">
              Har du ikke en bruger? 
              <span>
                <a href="/signup" use:link>Registrer din Virksomhed her</a></span>
            </p>
        </div>
    </div>
{/if}

<style>
</style>


