<script>
	export let titles;
</script>

<thead class="w3-white">
	<tr>
		{#each titles as title}
			<th>{title}</th>
		{/each}
		<th />
	</tr>
</thead>

<style>
	th {
		height: 35px;
		padding-bottom: 15px;
	}
	tr {
		border-bottom: 1px solid var(--secondary-color);
	}
</style>
