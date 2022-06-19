<script>
  import Authentication from "./create/RegisterAuthentication.svelte";
  import Detail from "./create/RegisterUser.svelte";
  import Company from "./create/RegisterCompany.svelte";

  import { toast } from '@zerodevx/svelte-toast'

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
  let user = {};


  async function registerAuthentication(e) {
    const response = await fetch('/signup', {method: 'POST', headers:  { 'Content-type': 'application/json'}, 
    body: JSON.stringify(e.detail)});
    const { payload, error } = await response.json();
    if(payload){
      console.log(payload.id)
      id = payload.id;
      step = 1;
    }else notify('error', error);
  }
  async function registerUser(e) {
    user = e.detail;
    console.log(user)
    step = 2;
  }
  async function registerCompany(e) {
    const response = await fetch(`/createCompany/${id}`, {method: 'POST', headers:  { 'Content-type': 'application/json'}, 
    body: JSON.stringify(e.detail)});
    const { payload, error } = await response.json();
    if(payload){
      console.log(payload)
      
    }else notify('error', error);
  }


</script>

<div class="w3-container parent">
  {#if step === 0}
   <Authentication on:registerAuthentication={registerAuthentication} />
   {:else if step === 1}
    <Detail on:registerUser={registerUser}/>
  {:else if step === 2}
    <Company on:registerCompany={registerCompany} />
  {/if}
</div>

<style>
  .parent :global(.error) {
    border: 1px solid red;
  }
</style>
