<script>
	let detail = {
		admin: false,
		firstname: 'Malik',
		lastname: 'Mayo',
		phone: '42154651',
		pb: '',
	};
	export let onRegister;
</script>

<div class="title">
	<h1>Opret en bruger</h1>
	<p>Nu har vi brug for dine personlige oplysninger</p>
</div>
<form on:submit|preventDefault={() => onRegister(detail)}>
	<label>
		Fornavn*
		<input
			bind:value={detail.firstname}
			class="w3-card-2 inputs"
			placeholder="Fornavn"
			required
		/>
	</label>
	<label>
		Efternavn*
		<input
			bind:value={detail.lastname}
			class="w3-card-2 inputs"
			placeholder="Efternavn"
			required
		/>
	</label>
	<label>
		Mobil nummer
		<input
			bind:value={detail.phone}
			class="w3-card-2 inputs"
			placeholder="Mobil nummer"
		/>
	</label>
	<label>
		Profil billede
		<input
			bind:value={detail.pb}
			class="w3-card-2 inputs"
			placeholder="link til et profil billede"
		/>
	</label>
	<input
		type="submit"
		class="w3-button w3-left-align w3-hover-black"
		value="Opret"
	/>
</form>
