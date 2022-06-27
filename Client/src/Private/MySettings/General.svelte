<script>
	import { onMount } from 'svelte';
	import { user, isAdmin } from '../../Stores/user';
	import { apiGet } from '../../utils/fetches';
	import { notifyError } from '../../utils/notify';
	import { GET_COMPANY } from '../../utils/endpoints';
	import GoUnverified from 'svelte-icons/go/GoUnverified.svelte';
	import GoVerified from 'svelte-icons/go/GoVerified.svelte';
	let company = {};
	let employees = [];

	onMount(async () => {
		const { payload, error } = await apiGet(GET_COMPANY($user.companyId));
		if (error) {
			notifyError(error.message);
		} else {
			company = payload.company;
			employees = company.employees;
		}
	});
</script>

<div class="grid-container">
	{#if isAdmin}
		<p>Administrator</p>
		<p class="value">Ja</p>

		<p>Medarbejder</p>
		<p class="value">{employees.length}</p>
	{/if}

	<p>Virksomhed</p>
	<p class="value">{company.name}</p>

	<p>Verficeret</p>

	<div class="center-container">
		<div class="icon-small">
			{#if $user.verified}
				<GoVerified />
			{:else}
				<GoUnverified />
			{/if}
		</div>
	</div>
	{#if !$user.verified}
		<div class="grid-full-column">
			<p class="info-text">Har du ikke modtaget verificerings mail?</p>
			<p class="info-text">Klik på knappen nedenfor for at tilsendt en ny mail</p>
		</div>
		<button class="button">Send verificerings mail</button>
	{/if}
</div>
