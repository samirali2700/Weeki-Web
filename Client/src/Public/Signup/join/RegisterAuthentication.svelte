<script>
	import PasswordInput from '../../../Components/PasswordInput.svelte';
	import { notifyError } from '../../../utils/notify';

	export let email;
	export let password;
	export let registerAuthentication;

	let rePass = '';
	let match = true;

	function checkMatch() {
		if (rePass.length > 0) {
			if (password !== rePass) {
				match = false;
			} else {
				match = true;
			}
		}
	}
</script>

<form
	on:submit|preventDefault={() =>
		match
			? registerAuthentication({ email, password })
			: notifyError('Adganskode matcher ikke')}
>
	<label>
		Din E-mail
		<input value={email} readonly class="w3-large w3-center w3-border-white" />
	</label>
	<label for="password"> Adgangskode*</label>
	<PasswordInput bind:password />

	<label for="re-password">Bekræft adgangskode*</label>
	<PasswordInput
		error={!match}
		bind:password={rePass}
		on:input={checkMatch}
		id="re-password"
	/>
	<input
		type="submit"
		class="w3-button w3-blue w3-hover-black w3-left-align"
		value="Bekræft"
		class:w3-disabled={!match || rePass === ''}
	/>
</form>
