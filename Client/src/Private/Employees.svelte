<script>
	import { slide } from 'svelte/transition';

	import Overview from './Employee/Overview.svelte';
	import AddEmployee from './Employee/AddEmployee.svelte';
	import EditEmployee from './Employee/EditEmployee.svelte';
	import SearchEmployee from './Employee/SearchEmployee.svelte';

	import { Router, Route, link } from 'svelte-navigator';

	import { useLocation } from 'svelte-navigator';

	let location = useLocation();
	$: sessionStorage.setItem('lastVisited', $location.pathname);
</script>

<div class="header w3-card-4" in:slide>
	<h1>Medarbejder</h1>
</div>
<div class=" tab">
	<a
		href="/employees/"
		class="tab-button"
		class:active={$location.pathname === '/employees'}
		use:link>Oversigt</a
	>
	<a
		href="/employees/register"
		class="tab-button"
		class:active={$location.pathname === '/employees/register'}
		use:link>Tilføj</a
	>
	<a
		href="/employees/search"
		class="tab-button"
		class:active={$location.pathname === '/employees/search'}
		use:link>Søg</a
	>
</div>

<div class="content-container">
	<Router primary={false}>
		<Route path="/">
			<div class="content" in:slide>
				<Overview />
			</div>
		</Route>

		<Route path="/register">
			<div class="content" in:slide>
				<AddEmployee />
			</div></Route
		>
		<Route path="/edit/:id" let:params>
			<div class="content" in:slide>
				<EditEmployee id={params.id} />
			</div></Route
		>
	</Router>
</div>
