<script>
	import PasswordInput from '../../../Components/PasswordInput.svelte';
	import { notifyError } from '../../../utils/notify';

	let email = '';
	let password = '';
	let rePass = '123456798';
	let match = true;
	let checked = false;

	export let onSubmit;

	function checkMatch() {
		if (rePass.length > 0) {
			if (password !== rePass) {
				match = false;
			} else {
				match = true;
			}
		}
	}
	function submit() {
		onSubmit({ email, password });
	}
</script>

<div class="w3-animate-bottom">
	<div class="title">
		<h2>Opret en ny bruger</h2>
		<p>Først har vi brug for din login oplysninger</p>
	</div>
	<form
		on:submit|preventDefault={() =>
			match ? submit() : notifyError('Adganskode matcher ikke')}
	>
		<label>
			E-mail*
			<input type="email" bind:value={email} class="w3-card-2 inputs" required />
		</label>
		<label for="password">Adgangskode*</label>
		<PasswordInput error={false} bind:password on:input={checkMatch} />

		<label for="re-password">Bekræft Adgangskode*</label>
		<PasswordInput
			id="re-password"
			error={!match}
			bind:password={rePass}
			on:input={checkMatch}
		/>
		<label>
			<input type="checkbox" required bind:checked />
			Jeg acceptere
			<a href="/terms/Terms&Conditions.html" target="_blank"
				>vilkårene og betingelserne</a
			>
			og
			<a href="/terms/PrivacyPolicy.html" target="_blank">Fortrolighedspolitik</a>
		</label>
		<input
			type="submit"
			value="Næste Trin"
			class="w3-button w3-left-align button inputs"
			disabled={!match || !checked}
		/>
	</form>
</div>
