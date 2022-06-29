<script>
	import { link } from 'svelte-navigator';

	import Loader from '../Components/Loader.svelte';
	import PasswordInput from '../Components/PasswordInput.svelte';

	import { user } from '../Stores/user';

	import { notifyError, notifySuccess } from '../utils/notify';
	import { authPost } from '../utils/fetches.js';
	import { SIGNIN } from '../utils/endpoints';
	import { CONNECT } from '../utils/socket';

	let isLoading = false;

	let email = '1505samirali@gmail.com';
	let password = '123456789';

	async function login() {
		isLoading = true;

		const { payload, error } = await authPost(SIGNIN(), {
			email: email,
			password: password,
		});

		if (payload) {
			$user = payload.user;
			CONNECT();
			sessionStorage.setItem('userId', $user._id);
			sessionStorage.removeItem('lastVisited');
			const theme = localStorage.getItem($user._id);
			if (theme) {
				localStorage.setItem('savedTheme', theme);
			} else {
				localStorage.removeItem('savedTheme');
			}
			notifySuccess(`Velkommen, ${$user.firstname} ${$user.lastname}`);
		} else {
			notifyError(error.message);
		}

		isLoading = false;
	}
</script>

{#if isLoading}
	<Loader type={'Plane'} />
{:else}
	<div class="container w3-animate-zoom">
		<div class="content">
			<div class="intro">
				<h1 class="text">Velkommen Tilbage</h1>
				<p class="intro-text text">Login og planlæg din vagtplan nemt og hutigt!</p>
			</div>
		</div>
		<div class="content">
			<form on:submit|preventDefault={login}>
				<label for="email"> Brugernavn*</label>
				<input
					class="w3-card-2 inputs"
					id="email"
					name="email"
					bind:value={email}
					required
				/>

				<label for="password"> Adgangskode*</label>
				<PasswordInput bind:password />
				<input
					type="submit"
					style:height="45px"
					style:margin-top="35px"
					value="Login"
					class="w3-button w3-round-small w3-hover-black w3-left-align"
				/>
			</form>
		</div>
		<div class="content">
			<p class="w3-section">
				Har du ikke en bruger?
				<span> <a href="/signup" use:link>Registrer din Virksomhed her</a></span>
			</p>
		</div>
	</div>
{/if}
