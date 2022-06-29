<script>
	import Logo from '../Components/Logo.svelte';
	import { onMount } from 'svelte';

	import { apiPost } from '../utils/fetches';

	import { navigate } from 'svelte-navigator';

	import { invitationInfo } from '../Stores/user';

	import { POST_INVITATION_VALIDATION } from '../utils/endpoints';

	onMount(async () => {
		const { payload } = await apiPost(POST_INVITATION_VALIDATION('status'), {});
		if (payload) {
			$invitationInfo = {
				email: payload.info.email,
				companyId: payload.info.companyId,
				companyName: payload.info.name,
			};
			if (payload.redirect) {
				navigate('/signup/join');
			}
		}
	});

	const styles = `--secondary-color: #0088ff;`;

	let width;
	let size = 'L';

	$: if (width < 900 && size === 'L') {
		size = 'M';
	} else if (width > 900 && size === 'M') {
		size = 'L';
	}
</script>

<svelte:window bind:innerWidth={width} />
<div class="main w3-row" style={styles}>
	<div class="container parent" class:w3-half={width > 992}>
		<slot />
	</div>
	<div id="logo" class="logo w3-half w3-black container w3-hide-medium">
		<Logo bind:size />
	</div>
</div>

<style>
	.parent :global(.container) {
		height: 100%;
		padding: 0 25px;
		width: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.parent :global(.content) {
		width: 100%;
		margin: 15px 0;
	}
	.parent :global(h1) {
		font-family: 'Gluten', cursive;
		font-weight: bold;
	}
	.parent :global(.intro) {
		margin-bottom: 25px;
	}
	.parent :global(.intro-text) {
		color: #808080;
	}
	.parent :global(form) {
		display: grid;
		row-gap: 5px;
	}
	.parent :global(input) {
		margin-bottom: 15px;
	}
	.parent :global(label) {
		font-size: 12px;
	}
	.parent :global(input[type='submit']) {
		background-color: #0088ff;
		color: #fff;
		margin-top: 25px;
	}
	.parent :global(a) {
		color: #0088ff;
	}
	.main {
		width: 100vw;
		height: 100%;
		overflow: hidden;
	}
	.container {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
	}
	.logo {
		height: 100vh;
	}

	@media screen and (max-width: 960px) {
	}
</style>
