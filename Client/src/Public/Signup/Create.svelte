<script>
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  //array with the name of the inputs that are unacceptable in anyway
  let errors = [];

  let rePass = "123456789";

  export let step;

  let user = {
    firstname: "ali",
    lastname: "Chouikhi",
    email: "samirali@live.dk",
    phone: "25323150",
    password: "123456789",
  };
  let company = {
    name: "Weeki",
    cvr: "4568743151",
    phone: "421545651",
  };

  function goNext() {
    //only runs if true
    if (checkMatch()) {
      /**
       * The user data is stored inside user object
       * now next step is the company data
       *
       */
      step = 1;
    }
  }

  function checkMatch() {
    if (rePass.length > 0) {
      if (user.password !== rePass) {
        if (!errors.find((e) => e.name === "rePass")) {
          errors = [...errors, { name: "rePass" }];
          return false;
        }
      } else {
        errors = errors.filter((e) => e.name !== "rePass");
        return true;
      }
    }
    return false;
  }

  function signup() {
    dispatch("signup", [user, company]);
  }
</script>

<div class="content">
  {#if step === 0}
    <div class="w3-container" in:slide>
      <div class="title">
        <h2>Opret en ny bruger</h2>
        <p>Først har vi brug for dine personlige informationer</p>
      </div>
      <form on:submit|preventDefault={goNext}>
        <label for="name"> Navn </label>
        <span class="name">
          <input
            id="name"
            bind:value={user.firstname}
            class="w3-card-2"
            placeholder="Fornavn"
          />
          <input
            bind:value={user.lastname}
            class="w3-card-2"
            placeholder="Efternavn"
          />
        </span>
        <label>
          Email*
          <input
            type="email"
            bind:value={user.email}
            class="w3-card-2"
            placeholder="Efternavn"
            required
          />
        </label>
        <label>
          Mobil nummer
          <input
            bind:value={user.phone}
            class="w3-card-2"
            disabled
            placeholder="deaktiveret"
          />
        </label>
        <label>
          Adgangskode*
          <input
            type="password"
            bind:value={user.password}
            on:input={checkMatch}
            required
            class="w3-card-2"
          />
        </label>
        <label>
          Gentag Adgangskode*
          <input
            type="password"
            bind:value={rePass}
            on:input={checkMatch}
            required
            class="w3-card-2"
            class:error={errors.find((t) => t.name === "rePass")}
          />
        </label>
        <input
          type="submit"
          value="Næste Trin"
          class="w3-button w3-left-align"
        />
      </form>
    </div>
  {:else if step === 1}
    <div class="w3-container" in:slide>
      <div class="w3-section">
        <h2>Registrer din Virksomhed</h2>
        <p>
          Du er der næsten, sidste trin så kan du komme i gang med det samme!
        </p>
      </div>
      <form on:submit|preventDefault={signup}>
        <label>
          Virksomhed*
          <input bind:value={company.name} required class="w3-card-2" />
        </label>
        <label>
          CVR*
          <input
            type="number"
            bind:value={company.cvr}
            required
            class="w3-card-2"
          />
        </label>
        <label>
          Telefon nummer*
          <input
            type="tel"
            bind:value={company.phone}
            required
            class="w3-card-2"
          />
        </label>
        <input type="submit" value="Opret" class="w3-button w3-left-align" />
      </form>
    </div>
  {/if}
</div>

<style>
  h2,
  p {
    font-family: "Gluten", cursive;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .title {
    margin-bottom: 25px;
  }
  .name {
    display: flex;
    width: 100%;
    column-gap: 2px;
  }

  input {
    margin-bottom: 15px;
    width: 100%;
    height: 40px;
    padding-left: 15px;
    margin-top: 3px;
  }

  label,
  input {
    font-size: 12px;
  }
  input:focus {
    font-size: 14px;
    font-weight: bold;
  }
  input[type="submit"] {
    background-color: #0088ff;
    color: #fff;
    margin-top: 25px;
  }
  .error {
    border: 1px solid red;
  }

  @media screen and (max-width: 400px) {
    input {
      font-size: 10px;
    }
    input:focus {
      font-size: 12px;
    }
    h2 {
      font-size: 20px;
    }
    p {
      font-size: 14px;
    }
    label {
      font-size: 9px;
    }
  }
</style>
