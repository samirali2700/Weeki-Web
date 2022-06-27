<script>
	import { link } from 'svelte-navigator';
	import { fade } from 'svelte/transition';

	export let navigation_items;
	export let page;
</script>

<div class=" link-container" in:fade>
	{#each navigation_items as item}
		<a
			href={item.endpoint}
			use:link
			class="link"
			class:current={page === item.endpoint}
			on:click={() => (page = item.endpoint)}>{item.name}</a
		>
	{/each}
</div>

<style>
	.link-container {
		display: flex;
		padding: 0 15px;
		height: 100%;
		align-items: center;
		justify-content: center;
		column-gap: 25px;
	}
	.link {
		color: var(--text-color, ligthgrey);
		font-family: var(--font);
		font-size: 22px;
	}
	.current {
		color: var(--secondary-color, ligthgrey);
		transform: scale(1.2);
	}
	.link:hover {
		color: var(--secondary-color);
		cursor: pointer;
	}
</style>
