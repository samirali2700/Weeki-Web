<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();


    let user = {
        firstname: 'Ali',
        lastname: 'Chouikhi',
        phone: '25323150',
        pb: 'https://i.pinimg.com/originals/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg'
    };

    async function registerUser() {
        dispatch('registerUser',  user);
    } 
</script>

<div class="w3-animate-bottom">
    <div class="title">
      <h2>Opret en ny bruger</h2>
      <p>Nu har vi brug for dine personlige oplysninger</p>
    </div>
    <form on:submit|preventDefault={registerUser}>
        <label> Fornavn* 
            <input
            bind:value={user.firstname}
            class="w3-card-2 inputs"
            placeholder="Fornavn"
            required
          />
        </label>
        <label> Efternavn*
            <input
            bind:value={user.lastname}
            class="w3-card-2 inputs"
            placeholder="Efternavn"
            required
          />
        </label>
        <label> Mobil nummer 
            <input
            bind:value={user.phone}
            class="w3-card-2 inputs"
            placeholder="Mobil nummer"
          />
        </label>
        <label> Profil billede
            <input
            bind:value={user.pb}
            class="w3-card-2 inputs"
            placeholder="link til et profil billede"
          />
        </label>
      <input
        type="submit"
        value="Næste Trin"
        class="w3-button w3-left-align button inputs"
      />
    </form>
  </div>