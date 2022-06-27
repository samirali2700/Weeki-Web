<script>
	export let onValidate;
	let token;
</script>

<div class="title">
	<h2>Slut dig til dine kollegaer</h2>
	<p>Vi skal først bruge din invitations Token</p>
</div>
<form on:submit|preventDefault={() => onValidate(token)}>
	<input type="text" name="token" bind:value={token} />
	<input
		type="submit"
		value="Næste trin"
		class="w3-button w3-left-align w3-blue w3-hover-black"
	/>
</form>
