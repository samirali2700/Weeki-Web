<script>
  export let isAdmin;
  export let user;
</script>

<div class="container">
  {#if isAdmin}
    <p>Administrator</p>
    <input value="Ja" style:border="none" />

    <p>Medarbejder</p>
    <input value="0" style:border="none" />
  {/if}

  <p>Virksomhed</p>
  <input readonly value="Weeki" style:border="none" />

  <p>Navn</p>
  <input type="text" value={user.name || "ikke registeret"} />

  <p>Email</p>
  <input type="email" value={user.email} />

  <p>Agangskode</p>
  <input type="password" value={user.password} />

  <p>Mobil nummer</p>
  <input type="number" value={user.phone} />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 10px;
  }
  input {
    text-align: center;
  }
</style>
