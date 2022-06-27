<script>
	import { Route } from 'svelte-navigator';
	import Public from '../Layouts/Public.svelte';

	import Login from '../Public/Login.svelte';
	import Signup from '../Public/Signup.svelte';
</script>

<Public>
	<Route path="/">
		<Login />
	</Route>
	<Route path="/signup/*">
		<Signup />
	</Route>
	<Route><Login /></Route>
</Public>
