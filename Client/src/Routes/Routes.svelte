<script>
	import { Router } from 'svelte-navigator';
	import Loader from '../Components/Loader.svelte';

	import PublicRoutes from './PublicRoutes.svelte';
	import PrivateRoutes from './PrivateRoutes.svelte';

	import { loggedIn, isLoading } from '../Stores/user';
	import { primary_color, secondary_color, theme } from '../Stores/app';

	if ($loggedIn) {
		$theme = localStorage.getItem('savedTheme') || localStorage.getItem('theme');
	}
</script>

{#if $isLoading}
	<div class="loader">
		<Loader styles={{ outer: $primary_color, center: $secondary_color }} />
	</div>
{:else}
	<main>
		{#if $loggedIn}
			<Router primary={false}>
				<PrivateRoutes />
			</Router>
		{:else}
			<Router primary={false}>
				<PublicRoutes />
			</Router>
		{/if}
	</main>
{/if}

<style>
	.loader {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
