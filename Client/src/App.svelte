<script>
	import { onMount } from 'svelte';

	import Routes from './Routes/Routes.svelte';
	import { user, isLoading } from './Stores/user';

	import { authGet } from './utils/fetches';
	import Notifications from 'svelte-notifications';

	onMount(async () => {
		$isLoading = true;
		const { payload } = await authGet(null);
		if (payload) {
			$user = payload.user;
		} else {
			sessionStorage.removeItem('lastVisited');
			sessionStorage.removeItem('userId');
		}
		$isLoading = false;
	});
</script>

<svelte:head>
	<script
		id="CookieDeclaration"
		src="https://consent.cookiebot.com/c04f56d2-2bf3-4b95-9043-5f1cd5e904ed/cd.js"
		type="text/javascript"
		async></script>
</svelte:head>

<Notifications>
	<Routes />
</Notifications>
