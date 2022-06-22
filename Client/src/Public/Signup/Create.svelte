<script>
  import Authentication from "./create/RegisterAuthentication.svelte";
  import Detail from "./create/RegisterUser.svelte";
  import Company from "./create/RegisterCompany.svelte";

  import { toast } from '@zerodevx/svelte-toast';
  import Loader from "../../Components/Loader.svelte";


  import { user } from "../../Stores/user";

  function notify(type, message){
    toast.pop();
    toast.push(message, {
      theme: {
        '--toastBackground': type === 'error' ? '#F56565' :  '#48BB78',
        '--toastBarBackground': type === 'error' ? '#C53030' : '#2F855A' 
      }
    })
  }

  let step = 0;
  let id = 0;
  let authentication = {};
  let detail = {
    admin: true
  };
  let company = {};

  let isLoading = false;


  async function registerAuthentication() {
    const { payload } = await fetchFunction('/auth/signup', authentication);
    if(payload){
      id = payload.id;
      step = 1;
    }
  }

  async function registerCompany() {
    const url = `/createCompany/${id}`;
    const { payload } = await fetchFunction(url, company);
    if(payload){
      await registerUser(payload.companyId);
    }
  }

  async function registerUser(companyId){
    const url = `/createUser/${companyId}/${id}`
    const { payload } = await fetchFunction(url, detail);
    if(payload) {
      await signin()
    }
  }
  async function signin(){
    const { payload } = await fetchFunction('/auth/signin', authentication);
    if(payload) {
      $user = payload;
    }
  }


  async function fetchFunction(url, body){
    toast.pop();
    isLoading = true;
    const response = await fetch(url, {method: 'POST', headers: {'Content-type': 'application/json'},
      body: JSON.stringify(body)});
    const { payload, error } = await response.json();
    isLoading = false;
    if(payload) {
      return { payload };
    }
    notify('error', error.message);
    return { undefined }
  }
</script>


{#if isLoading}
    <Loader/>
{:else}
  <div class="content parent">
    {#if step === 0}
    <Authentication bind:authentication  on:submit={registerAuthentication} />
    {:else if step === 1}
      <Detail bind:detail on:submit={() => step = 2}/>
    {:else if step === 2}
      <Company bind:company on:submit={registerCompany} />
    {/if}
  </div>
{/if}

<style>
  .parent :global(.error) {
    border: 1px solid red;
  }

</style>
