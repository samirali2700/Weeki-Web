<script>
    export let company = {
        name: "Weeki",
        cvr: "4568743151",
        phone: "421545651",
    };

</script>

<div class="w3-animate-bottom">
    <div class="w3-section">
      <h2>Registrer din Virksomhed</h2>
      <p>
        Du er der næsten, sidste trin så kan du komme i gang med det samme!
      </p>
    </div>
    <form on:submit|preventDefault>
      <label>
        Virksomhed*
        <input bind:value={company.name} required class="w3-card-2 inputs" />
      </label>
      <label>
        CVR*
        <input
          type="number"
          bind:value={company.cvr}
          required
          class="w3-card-2 inputs"
        />
      </label>
      <label>
        Telefon nummer*
        <input
          type="tel"
          bind:value={company.phone}
          required
          class="w3-card-2 inputs" 
        />
      </label>
      <input type="submit" value="Opret" class="w3-button w3-left-align button" />
    </form>
  </div>