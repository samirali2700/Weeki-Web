<script>
	import { onMount } from 'svelte';
	import Loader from '../../Components/Loader.svelte';
	import { secondary_color, primary_color } from '../../Stores/app';
	import { apiGet, apiDelete } from '../../utils/fetches';
	import { GET_EMPLOYEES, DELETE_EMPLOYEE } from '../../utils/endpoints';

	import Table from '../../Components/Table.svelte';
	import { notifyError, notifySuccess } from '../../utils/notify';

	let employees = [];
	let info = [];
	let titles = ['', 'Navn', 'Telefon', 'Stilling'];

	let empty = true;
	let loading = true;

	onMount(async () => {
		await fetchEmployees();
	});

	let employeeToBeDeletedId = '';
	let employeeToBeDeletedName = '';
	let deleteConfirm = false;

	async function fetchEmployees() {
		loading = true;
		const { payload, error } = await apiGet(GET_EMPLOYEES());
		if (payload) {
			employees = payload.employees;
			info = payload.userInfo;
			empty = false;
		} else {
			empty = true;
		}

		loading = false;
	}

	function confirmDelete(id, name) {
		employeeToBeDeletedId = id;
		employeeToBeDeletedName = name;
		deleteConfirm = true;
	}

	async function deleteEmployee() {
		const { payload, error } = await apiDelete(
			DELETE_EMPLOYEE(employeeToBeDeletedId)
		);

		if (payload) {
			notifySuccess(payload.message);
			employeeToBeDeletedId = '';
			employeeToBeDeletedName = '';
			deleteConfirm = false;
			await fetchEmployees();
		} else notifyError(error.message);
	}
</script>

{#if loading}
	<div class="center-content">
		<Loader type={'Jumper'} color={$secondary_color} />
	</div>
{:else if empty}
	<div class="center-content">
		<p>Du har ingen registeret medarbejder</p>
	</div>
{:else}
	<div class="table">
		<Table {titles} {info} data={employees} onDelete={confirmDelete} />
	</div>
{/if}
<div class="w3-modal" class:w3-show={deleteConfirm}>
	<div class="w3-modal-content w3-animate-zoom modal-container">
		<div class="modal-header">
			<h3>Bekræft sletning</h3>
		</div>
		<div class="modal-body">
			<div>
				<p><b>Advarsel:</b> Denne handling kan ikke fortrydes</p>
			</div>
			<br />
			<p>
				Du vil permanent fjerne <b>{employeeToBeDeletedName}</b> og alle associeret vagter,
				opslag og beskeder
			</p>
			<br />
			<b>Er du sikker på du vil fortsætte?</b>
		</div>
		<div class="modal-footer">
			<button on:click={() => (deleteConfirm = false)} class="modal-button"
				>Nej</button
			>
			<button
				on:click={deleteEmployee}
				class="modal-button"
				style:color="#fff"
				style:background-color="red">Ja</button
			>
		</div>
	</div>
</div>

<style>
	.table {
		width: 100%;
		height: 100%;
	}
</style>
