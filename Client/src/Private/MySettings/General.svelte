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
  <input type="text" value={user.firstname + " "+user.lastname || "ikke registeret"} />
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
