<script>
	import FaChevronDown from 'svelte-icons/fa/FaChevronDown.svelte';
	import FaChevronUp from 'svelte-icons/fa/FaChevronUp.svelte';
	import IoIosTrash from 'svelte-icons/io/IoIosTrash.svelte';
	import { PATCH_USER, GET_LOGIN, DELETE_COMPANY } from '../../utils/endpoints';

	import { onMount } from 'svelte';
	import { user, isAdmin } from '../../Stores/user';
	import { apiPatch, apiGet, apiDelete } from '../../utils/fetches';
	import { notifySuccess, notifyInfo, notifyError } from '../../utils/notify';
	import { navigate } from 'svelte-navigator';
	import { page } from '../../Stores/app';

	let editable = false;
	let logonEdit = false;

	let showAddress = false;
	let showLogin = false;
	let email = '';
	let password = '';
	let rePass = '';

	let deleteConfirm = false;

	onMount(async () => {
		await getLogin();
	});

	async function deleteAccount() {
		const { error, payload } = await apiDelete(DELETE_COMPANY());

		if (payload) {
			$user = {};
			$page = '/';
		} else notifyError(error.message);
	}

	async function saveUserChange() {
		if (editable) {
			const { payload } = await apiPatch(PATCH_USER(), $user);
			if (payload) {
				notifySuccess(payload.message);
			}
			editable = false;
		} else editable = true;
	}
	async function saveAuthenticationChange() {
		if (logonEdit) {
			if (password === rePass) {
			}
			notifyError('Adganskode matcher ikke');
		} else logonEdit = true;
	}
	async function getLogin() {
		const { payload, error } = await apiGet(GET_LOGIN());
		if (payload) {
			email = payload.login.email;
		}
	}

	function toggleLogin() {
		if (showLogin) {
			showLogin = false;
			logonEdit = false;
			password = '';
			rePass = '';
		} else {
			showLogin = true;
		}
	}
</script>

<div class="flex-container">
	<div class="flex-container info-container">
		<div class="grid-container">
			<div class=" grid-full-column">
				<p class="undertitle">Personlig detaljer</p>
				<div class="divider" />
			</div>
			<p>Fornavn</p>
			<input
				class:value={!editable}
				class:editable-value={editable}
				bind:value={$user.firstname}
				readonly={!editable}
			/>
			<p>Efternavn</p>
			<input
				class:value={!editable}
				class:editable-value={editable}
				bind:value={$user.lastname}
				readonly={!editable}
			/>
			<p>Telefon</p>
			<input
				class:value={!editable}
				class:editable-value={editable}
				bind:value={$user.phone}
				readonly={!editable}
			/>
			<p>Profil Billede</p>
			<input
				class:value={!editable}
				class:editable-value={editable}
				bind:value={$user.pb}
				readonly={!editable}
			/>
		</div>
		<div class="grid-container ">
			<div class=" grid-full-column">
				<div class="flex-align" style:width="50%">
					<p class="undertitle">Adresse</p>
					<div class="icon-tiny icon" on:click={() => (showAddress = !showAddress)}>
						{#if showAddress}<FaChevronUp /> {:else} <FaChevronDown />{/if}
					</div>
				</div>
			</div>

			{#if showAddress}
				<div class="grid-full-column divider" />
				<p>Land</p>
				<input
					class:value={!editable}
					class:editable-value={editable}
					bind:value={$user.address.country}
					readonly={!editable}
				/>
				<p>By</p>
				<input
					class:value={!editable}
					class:editable-value={editable}
					bind:value={$user.address.city}
					readonly={!editable}
				/>
				<p>Vej</p>
				<input
					class:value={!editable}
					class:editable-value={editable}
					bind:value={$user.address.street}
					readonly={!editable}
				/>
				<p>Vej nummer</p>
				<input
					class:value={!editable}
					class:editable-value={editable}
					bind:value={$user.address.streetnumber}
					readonly={!editable}
				/>
				<p>Post nummer</p>
				<input
					class:value={!editable}
					class:editable-value={editable}
					bind:value={$user.address.zip}
					readonly={!editable}
				/>
			{/if}
		</div>
		<br />
		<button class="button" on:click={saveUserChange}
			>{#if !editable}Ændre person oplysninger{:else}Gem person oplysninger{/if}</button
		>
	</div>

	<div class="flex-container info-container">
		<div class="grid-container">
			<div class=" grid-full-column">
				<div class="flex-align" style:width="50%">
					<p class="undertitle">Login detaljer</p>
					<div class="icon-tiny icon" on:click={toggleLogin}>
						{#if showLogin}<FaChevronUp /> {:else} <FaChevronDown />{/if}
					</div>
				</div>
			</div>
			{#if showLogin}
				<div class="grid-full-column divider" />
				<p>E-mail</p>
				<input class="editable-value" value={email} readonly={!logonEdit} />
				{#if logonEdit}
					<p>Ny Adgangskode</p>
					<input class="editable-value" bind:value={password} />

					<p>Bekræft Ny Adgangskode</p>
					<input class="editable-value" bind:value={rePass} />
				{/if}
			{/if}
		</div>
		{#if showLogin}
			<br />
			<button class="button" on:click={saveAuthenticationChange}
				>{#if !logonEdit}Ændre login oplysninger{:else}Gem login oplysninger{/if}</button
			>
		{/if}
	</div>

	<br />
	{#if $isAdmin}
		<div class="flex-container delete-account">
			<div class="grid-container">
				<p class="undertitle w3-text-red">Slet konto</p>
				<div
					class="grid-full-column delete"
					on:click={() => (deleteConfirm = true)}
				>
					<div class="center-container">
						<div class="icon-small trash"><IoIosTrash /></div>
					</div>
				</div>
			</div>
		</div>
		<div class="w3-modal" class:w3-show={deleteConfirm}>
			<div class="w3-modal-content w3-animate-zoom modal-container">
				<div class="modal-header">
					<h3>Bekræft sletning</h3>
				</div>
				<div class="modal-body">
					<p>
						Du er ved at slette din virksomhed og alle associeret medarbejder, opslag,
						vagter
					</p>
					<br />
					<b>Er du sikker på du vil fortsætte?</b>
				</div>
				<div class="modal-footer">
					<button on:click={() => (deleteConfirm = false)} class="modal-button"
						>Nej</button
					>
					<button
						on:click={deleteAccount}
						class="modal-button"
						style:color="#fff"
						style:background-color="red">Ja</button
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.delete {
		border: 1px solid red;
		background-color: #fff;
		padding: 10px;
	}
	.delete:hover {
		background-color: red;
		cursor: pointer;
	}
	.delete:hover .trash {
		color: #fff;
	}
	.trash {
		color: red;
	}
	.delete-account {
		border: 1px solid red;
		padding: 25px;
	}
</style>
