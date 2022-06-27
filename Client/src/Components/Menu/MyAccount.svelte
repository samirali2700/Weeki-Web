<script>
	import IoIosArrowDown from 'svelte-icons/io/IoIosArrowDown.svelte';
	import IoIosArrowUp from 'svelte-icons/io/IoIosArrowUp.svelte';
	import FaUserCircle from 'svelte-icons/fa/FaUserCircle.svelte';
	import TiThMenu from 'svelte-icons/ti/TiThMenu.svelte';

	export let show;
	export let menu_mode;
</script>

<div on:click={() => (show = !show)}>
	{#if menu_mode === 'C'}
		<div class="myAccount">
			<div class="sidebar-icon"><FaUserCircle /></div>
			<span>Min Konto</span>
			<span class="arrow">
				{#if show}
					<IoIosArrowUp />
				{:else}
					<IoIosArrowDown />
				{/if}
			</span>
		</div>
	{:else}
		<div class="menu-icon">
			<TiThMenu />
		</div>
	{/if}
</div>

<style>
	.arrow {
		width: 26px;
		height: 26px;
		margin-left: 5px;
	}
	.myAccount {
		position: fixed;
		right: 50px;
		top: 30px;
		width: fit-content;
		height: 32px;
		display: flex;
		column-gap: 10px;
		align-items: center;
		color: var(--text-color);
		align-items: center;
	}
	.menu-icon {
		height: 32px;
		width: 32px;
		position: absolute;
		right: 30px;
		top: 30px;
	}
	.myAccount:hover,
	.menu-icon:hover {
		color: var(--secondary-color);
		cursor: pointer;
		user-select: none;
	}
	.myAccount:hover .sidebar-icon {
		color: var(--secondary-color);
	}
	.sidebar-icon {
		color: var(--text-color);
		border-radius: 50%;
		width: 38px;
		height: 38px;
		padding: 5px;
	}
</style>
