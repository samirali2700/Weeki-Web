<script>
    import { onMount } from "svelte";
    import { user } from "../../Stores/user";
    import Loader from "../../Components/Loader.svelte";
    import { secondary_color, primary_color } from "../../Stores/store";
    import { navigate } from "svelte-navigator";

    let loading;
    let url;

    let empty = false;

    onMount( async () => {
        loading = true;
        url = `/getEmployees/${$user.companyId}`
        const response = await fetch(url);
        const { payload, error } = await response.json();

        if(payload){
            console.log(payload)
        }
        else {
            if(response.status === 401){
                $user = {};
                navigate('/', {replace: true})
            }
            empty = true;
        }

        loading= false;
    });
</script>


{#if loading}
<div class="w3-border loader">
    <Loader type={'Jumper'} color={$secondary_color}/>
<!-- Diamonds, Jumper, RingLoader, SyncLoader, SpinLine -->
  </div>
{:else}
    {#if empty}
        <p>Du har ingen registeret medarbejder</p>
        
    {:else}
        <h1>Hello</h1>
    {/if}
{/if}

<style></style>