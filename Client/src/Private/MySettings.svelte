<script>
	import { slide } from 'svelte/transition';

	import General from './MySettings/General.svelte';
	import MyAccount from './MySettings/MyAccount.svelte';
	import App from './MySettings/App.svelte';

	import { Router, Route, link, useLocation } from 'svelte-navigator';

	let location = useLocation();
	$: sessionStorage.setItem('lastVisited', $location.pathname);
</script>

<div class="header w3-card-4" in:slide>
	<h1>Mine indstillinger</h1>
</div>

<div class="tab">
	<a
		href="/mysettings/"
		class="tab-button"
		class:active={$location.pathname === '/mysettings'}
		use:link>General</a
	>
	<a
		href="/mysettings/myaccount"
		class="tab-button"
		class:active={$location.pathname === '/mysettings/myaccount'}
		use:link>Min Konto</a
	>
	<a
		href="/mysettings/app"
		class="tab-button"
		class:active={$location.pathname === '/mysettings/app'}
		use:link>App</a
	>
</div>

<div class="content-container">
	<Router primary={false}>
		<Route path="/">
			<div class="content" in:slide><General /></div></Route
		>
		<div class="content" in:slide>
			<Route path="/myaccount">
				<MyAccount />
			</Route>
		</div>
		<Route path="/app">
			<div class="content" in:slide>
				<App />
			</div></Route
		>
	</Router>
</div>
