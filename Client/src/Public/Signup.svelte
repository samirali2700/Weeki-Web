<script>
	import { Router, Route, navigate } from 'svelte-navigator';

	import Intro from './Signup/Intro.svelte';
	import Create from './Signup/Create.svelte';
	import Join from './Signup/Join.svelte';

	import Loader from '../Components/Loader.svelte';

	import { authPost, apiPost } from '../utils/fetches';
	import { notifyError, notifySuccess } from '../utils/notify';

	import { user } from '../Stores/user';

	import { invitationInfo } from '../Stores/user';
	import { onMount } from 'svelte';

	import {
		SIGNUP,
		POST_COMPANY,
		POST_USER,
		POST_EMPLOYEE,
	} from '../utils/endpoints';

	let isLoading = false;

	let creatorId = '';

	let email = '';
	let companyName = '';
	let companyId = '';
	let inProgress = false;

	let step = 0;
	let authentication = {};

	onMount(() => {
		if ($invitationInfo) {
			email = $invitationInfo.email;
			companyName = $invitationInfo.companyName;
			companyId = $invitationInfo.companyId;
			inProgress = true;
			step = 1;
		}
	});

	async function onRegisterAuthentication(e, type) {
		isLoading = true;
		const { payload, error } = await authPost(SIGNUP(), e);
		if (payload) {
			creatorId = payload.id;
			authentication = e;
			if (type === 'join') {
				await addToCompany();
			}
			step++;
		} else notifyError(error.message);
		isLoading = false;
	}

	async function addToCompany() {
		const { error } = await apiPost(POST_EMPLOYEE(companyId), {
			id: creatorId,
		});

		if (error) {
			notifyError(error.message);
		}
	}

	async function onRegisterCompany(e) {
		isLoading = true;
		const { payload, error } = await apiPost(POST_COMPANY(creatorId), e);
		if (payload) {
			companyId = payload.companyId;
			step++;
		} else notifyError(error.message);
		isLoading = false;
	}

	async function onRegisterUser(e) {
		isLoading = true;
		const { payload, error } = await apiPost(
			POST_USER({ companyId: companyId, userId: creatorId }),
			{
				user: e,
				email: authentication.email,
			}
		);
		if (payload) {
			await onSignin(authentication);
		} else notifyError(error.message);
		isLoading = false;
	}

	async function onSignin(e) {
		isLoading = true;
		const { payload, error } = await authPost('signin', e);
		if (payload) {
			$user = payload.user;
			notifySuccess(`Velkommen, ${$user.firstname} ${$user.lastname}`);
		} else notifyError(error.message);
		isLoading = false;
	}
</script>

{#if isLoading}
	<Loader />
{:else}
	<Router primary={false}>
		<div class="container">
			<div class="content signup-parent ">
				<Route path="/"><Intro /></Route>

				<Route path="create">
					<Create
						{step}
						registerUser={onRegisterUser}
						registerCompany={onRegisterCompany}
						registerAuthentication={onRegisterAuthentication}
					/>
				</Route>

				<Route path="join">
					<Join
						bind:step
						bind:email
						bind:companyName
						bind:companyId
						registerUser={onRegisterUser}
						registerAuthentication={onRegisterAuthentication}
					/>
				</Route>
			</div>
		</div>
	</Router>
{/if}

<style>
	.container {
		position: relative;
	}
	.content {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.signup-parent :global(.card) {
		border: 1px solid #dddddd;
		cursor: pointer;
		padding: 15px 10px;
		display: flex;
		flex-direction: column;
		row-gap: 5px;
		margin-bottom: 5px;
	}
	.signup-parent :global(.title) {
		margin-bottom: 25px;
	}
	.signup-parent :global(.text) {
		font-family: 'Gluten', cursive;
		font-weight: bold;
		margin-bottom: 10px;
	}
	.signup-parent :global(.bold-text) {
		user-select: none;
		font-family: 'Allerta Stencil', Sans-serif;
	}

	.signup-parent :global(.inputs) {
		margin-bottom: 15px;
		width: 100%;
		height: 40px;
		padding-left: 15px;
		margin-top: 3px;
		font-size: 12px;
	}
	.signup-parent :global(.button) {
		background-color: #0088ff;
		color: #fff;
		margin-top: 25px;
	}
</style>
