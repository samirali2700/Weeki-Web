<script>
	import Authentication from './create/RegisterAuthentication.svelte';
	import Detail from './create/RegisterUser.svelte';
	import Company from './create/RegisterCompany.svelte';

	export let registerUser;
	export let registerCompany;
	export let registerAuthentication;

	export let step;
</script>

<div class="content parent">
	{#if step === 0}
		<Authentication onSubmit={registerAuthentication} />
	{:else if step === 1}
		<Company onSubmit={registerCompany} />
	{:else if step === 2}
		<Detail onSubmit={registerUser} />
	{/if}
</div>

<style>
	.parent :global(.error) {
		border: 1px solid red;
	}
</style>
