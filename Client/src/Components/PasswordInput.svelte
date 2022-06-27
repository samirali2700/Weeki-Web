<script>
	import IoIosEye from 'svelte-icons/io/IoIosEye.svelte';
	import IoIosEyeOff from 'svelte-icons/io/IoIosEyeOff.svelte';
	export let password = '';
	export let id = 'password';
	export let error = false;
	export let placeholder = '';

	let toggled = false;

	$: icon = toggled ? IoIosEyeOff : IoIosEye;
</script>

{#if toggled}
	<input
		{id}
		class="w3-card-2 inputs"
		{placeholder}
		class:error
		type="text"
		bind:value={password}
		required
		on:input
	/>
{:else}
	<input
		{id}
		class="w3-card-2 inputs"
		{placeholder}
		class:error
		type="password"
		bind:value={password}
		required
		on:input
	/>
{/if}
<div class="toggle-password" on:click={() => (toggled = !toggled)}>
	<svelte:component this={icon} />
</div>

<style>
	.toggle-password {
		width: 22px;
		position: relative;
		top: -3.4em;
		left: 87%;
	}
	.toggle-password:hover {
		cursor: pointer;
		transform: scale(1.2);
	}
	.inputs {
		width: 100%;
	}
</style>
