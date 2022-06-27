<script>
	import { Route } from 'svelte-navigator';
	import PrivateRouteGuard from './PrivateRouteGuard.svelte';

	export let path;
	export let component;
</script>

<Route {path} let:params let:location let:navigate>
	<PrivateRouteGuard>
		<svelte:component this={component} />
	</PrivateRouteGuard>
</Route>
