<script>
  let token;

  async function validateRegistrationToken(){
    const response = await fetch('/validateRegistrationToken/'+token);
    
  }

</script>

<div class="content parent">
  <div class="title">
    <h2>Slut dig til dine kollegaer</h2>
    <p>Vi skal først bruge din invitations Token</p>
  </div>
  <form on:submit|preventDefault={validateRegistrationToken}>
    <input type="text"  bind:value={token}>
    <input type="submit" value="Næste trin" class="w3-button w3-left-align w3-blue w3-hover-black" />
  </form>
</div>


