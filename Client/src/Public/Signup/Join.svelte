<script>
	import { apiPost } from '../../utils/fetches';
	import ValidateToken from './join/ValidateToken.svelte';
	import RegisterAuthentication from './join/RegisterAuthentication.svelte';
	import RegisterUser from './join/RegisterUser.svelte';
	import { notifyError, notifySuccess } from '../../utils/notify';

	import {
		GET_INVITATION_VALIDATION,
		POST_EMPLOYEE,
		POST_INVITATION_VALIDATION,
	} from '../../utils/endpoints';

	export let registerUser;
	export let registerAuthentication;

	export let email;
	export let companyName;
	export let companyId;
	export let step;

	let password = '123456789';

	let termAgree = false;

	async function validateRegistrationToken(token) {
		const { payload, error } = await apiPost(
			POST_INVITATION_VALIDATION('activation'),
			{
				token: token,
			}
		);
		if (payload) {
			notifySuccess('Token valideret');
			email = payload.info.email;
			companyId = payload.info.companyId;
			companyName = payload.info.name;
			step++;
		} else notifyError(error.message);
	}

	async function onRegisterAuthentication(e) {
		await registerAuthentication(e, 'join');
	}
</script>

<div class="content parent">
	{#if step === 0}
		<ValidateToken onValidate={validateRegistrationToken} />
	{:else if step === 1}
		<div class="w3-animate-bottom">
			<div class="title">
				<h2>Bekræft detaljerne</h2>
				<p>
					Hvis detaljerene nedunder ikke er korrekte, skal du ikke forsætte
					oprettelsen og istedet kontakt en ansvarlig fra din virksomhed
				</p>
			</div>
			<form on:submit={() => step++}>
				<label
					>Din Virksomhed
					<input
						value={companyName}
						readonly
						class="w3-large w3-center w3-border-white"
					/>
				</label>
				<label>
					Din E-mail
					<input value={email} readonly class="w3-large w3-center w3-border-white" />
				</label>
				<label>
					<input type="checkbox" required bind:checked={termAgree} />
					Jeg acceptere
					<a href="/terms/Terms&Conditions.html" target="_blank"
						>vilkårene og betingelserne</a
					>
					og
					<a href="/terms/PrivacyPolicy.html" target="_blank">Fortrolighedspolitik</a
					>
				</label>
				<input
					type="submit"
					class="w3-button w3-blue w3-hover-black w3-left-align"
					value="Bekræft"
					disabled={!termAgree}
				/>
			</form>
		</div>
	{:else if step === 2}
		<RegisterAuthentication
			bind:email
			bind:password
			registerAuthentication={onRegisterAuthentication}
		/>
	{:else if step === 3}
		<RegisterUser onRegister={registerUser} />
	{/if}
</div>
