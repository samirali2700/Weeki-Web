<script>
    import Loader from "../Components/Loader.svelte";
    import { link } from "svelte-navigator";
    import PasswordInput from "../Components/PasswordInput.svelte";
    import { user } from "../Stores/user";
    let isLoading = false;
    import { toast } from '@zerodevx/svelte-toast';
      
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
    const response = await fetch("/auth/signin", options);
    const { payload, error} = await response.json();
    if(payload){
       $user = payload.user;
    } else {
      toast.pop()
      toast.push(error.message, {
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
    <Loader type={'Plane'}/>
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
              <input class="w3-card-2 inputs" id="email" name="email" bind:value={email} required />
    
              <label for="password"> Adgangskode*</label>
              <PasswordInput  bind:password/>
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


