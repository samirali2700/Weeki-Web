<script>
	import MdContentCopy from 'svelte-icons/md/MdContentCopy.svelte';
	import Clipboard from 'svelte-clipboard';

	import { notifyError, notifyInfo, notifySuccess } from '../../utils/notify.js';
	import { apiGet, apiPost } from '../../utils/fetches';
	import {
		GET_INVITATION_TOKEN,
		POST_INVITATION_TOKEN,
	} from '../../utils/endpoints';

	let email;
	let token = '';

	async function generateCode() {
		if (email.length > 0) {
			const { payload, error } = await apiGet(GET_INVITATION_TOKEN(email));
			if (payload) {
				token = payload.token;
			} else notifyError(error.message);
		}
	}

	async function sendInvitation() {
		if (email.length > 0) {
			const { payload, error } = await apiPost(POST_INVITATION_TOKEN(email), {});
			if (payload) {
				email = '';
				notifySuccess(payload.message);
			} else notifyError(error.message);
		}
	}
</script>

<div>
	<form on:submit|preventDefault class="grid-container">
		<label for="email">Indtast din medarbejders email</label>
		<input
			id="email"
			bind:value={email}
			placeholder="email"
			type="email"
			required
		/>

		<p>Du kan vælge at generere en Token</p>
		<button class="button" on:click={generateCode}>Genererer Token</button>
		<p>Eller vi sender en invitation til din medarbejder</p>
		<button class="button" on:click={sendInvitation}>Send Invitation</button>
	</form>
	{#if token.length > 0}
		<div class="code-container w3-code w3-border w3-light-gray">
			<Clipboard
				text={token}
				let:copy
				on:copy={() => notifyInfo('Token Kopieret')}
			>
				<div class="copy-icon " on:click={copy}><MdContentCopy /></div>
				<div class="w3-padding ">
					{token}
				</div>
			</Clipboard>
		</div>
		<div class="w3-padding w3-border w3-pale-blue w3-card">
			Den genereret Token skal udleveres til din medarbejder, og bruges ved
			oprettelse for at tilknytte {email} til din virksomhed.
		</div>
	{/if}
</div>

<style>
	.code-container {
		width: 100%;
		height: auto;
		position: relative;
	}

	.copy-icon {
		width: 24px;
		height: 24px;
		position: absolute;
		right: 5px;
		top: 5px;
	}
	.copy-icon:hover {
		cursor: pointer;
		transform: scale(0.9);
	}
</style>
