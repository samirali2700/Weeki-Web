<script>
	export let data;
	export let info;
	export let onDelete;

	import FaUserEdit from 'svelte-icons/fa/FaUserEdit.svelte';
	import FaUserMinus from 'svelte-icons/fa/FaUserMinus.svelte';

	let list = info.map((i) => ({
		id: i._id,
		pb: i.pb,
		name: `${i.firstname} ${i.lastname}`,
		phone: i.phone,
		position: data.find((e) => e._id === e._id).position,
	}));
</script>

<tbody class="w3-white">
	{#each list as item}
		<tr class="w3-card">
			<td
				><img
					class="w3-image w3-circle w3-hide-small"
					src={item.pb}
					alt="profile"
				/></td
			>
			<td>{item.name}</td>
			<td>{item.phone}</td>
			<td>{item.position}</td>
			<td>
				<div>
					<div
						class="delete-icon icon-small"
						on:click={() => onDelete(item.id, item.name)}
					>
						<FaUserMinus />
					</div>
				</div>
			</td>
		</tr>
	{/each}
</tbody>

<style>
	td {
		text-align: center;
	}
	img {
		width: 46px;
		height: 46px;
	}
	tr {
		padding: 15px 0;
		height: 60px;
	}
</style>
