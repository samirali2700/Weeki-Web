<script>
	import Thead from './Table/Thead.svelte';
	import Tbody from './Table/Tbody.svelte';

	export let titles;
	export let data;
	export let info;

	export let onDelete;
</script>

<table>
	<Thead {titles} />
	<Tbody {data} {info} {onDelete} />
</table>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
	}
</style>
