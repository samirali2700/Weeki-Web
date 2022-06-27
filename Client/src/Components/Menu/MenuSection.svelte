<script>
	import MenuItem from './MenuItem.svelte';

	export let style;
	export let items;
</script>

<div class={style}>
	{#each items as item}
		<MenuItem {item} on:onClick />
	{/each}
</div>

<style>
	.menu-sidebar {
		padding-top: 10px;
	}

	.navigation-sidebar {
		margin-top: 10px;
		padding-top: 10px;
		border-bottom: 1px solid var(--secondary-color);
	}

	.tool-sidebar,
	.help-sidebar {
		border-top: 1px solid var(--secondary-color);
		margin-top: 10px;
		padding-top: 10px;
	}
</style>
