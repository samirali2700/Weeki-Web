<script>
	//components
	import NavBar from '../Components/NavBar.svelte';
	import Footer from '../Components/Footer.svelte';
	import Loader from '../Components/Loader.svelte';

	import {
		primary_color,
		secondary_color,
		text_color,
		isLoading,
		theme,
	} from '../Stores/app';
	import { user } from '../Stores/user';

	$theme = localStorage.getItem($user._id) || 'default';

	$: styles = {
		'primary-color': $primary_color,
		'secondary-color': $secondary_color,
		'text-color': $text_color,
		font: '"Gluten", cursive',
	};

	$: Style = Object.entries(styles)
		.map(([key, value]) => `--${key}:${value}`)
		.join(';');
</script>

<div style={Style}>
	<NavBar />
	<div class="main">
		{#if $isLoading}
			<div class="center-content">
				<Loader styles={{ outer: $primary_color, center: $secondary_color }} />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
	<Footer />
</div>

<style>
	.main {
		min-height: calc(100vh - 200px);
		width: 90%;
		margin: 0 auto;
		color: #000;
		border-left: 1px solid var(--secondary-color, ligthgrey);
		border-right: 1px solid var(--secondary-color, ligthgrey);
	}

	.main :global(.center-content) {
		display: flex;
		align-items: center;
		justify-content: center;
		height: calc(100vh - 200px);
	}

	.main :global(.center-container) {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.main :global(.content-container) {
		width: 100%;
		min-height: 250px;
	}
	.main :global(.content) {
		padding: 25px 25px 50px 25px;
	}
	.main :global(.grid-container) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 15px;
	}
	.main :global(.grid-full-column) {
		grid-column: 1 / 3;
	}
	.main :global(.flex-container) {
		display: flex;
		flex-direction: column;
		row-gap: 15px;
		padding: 0 0 25px 0;
	}
	.main :global(.flex-align) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 15px;
		column-gap: 15px;
	}
	.main :global(.divider) {
		border-bottom: 2px solid var(--secondary-color);
		width: 100%;
		margin: 15px 0;
	}
	.main :global(.header) {
		background-color: var(--secondary-color, ligthgrey);
		color: var(--text-color, ligthgrey);
		padding: 5px 16px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}
	.main :global(.tab) {
		display: flex;
		column-gap: 0;
		border-bottom: 1px solid #cecece;
	}
	.main :global(.tab a) {
		width: 100px;
	}
	.main :global(.tab-button) {
		min-width: 150px;
		padding: 12px 15px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.main :global(.tab-button:hover) {
		cursor: pointer;
		background-color: var(--secondary-color);
		color: var(--text-color);
	}

	.main :global(.active) {
		border-bottom: 2px solid var(--secondary-color);
	}

	.main :global(.info-text) {
		font-size: 11px;
	}
	.main :global(.value) {
		text-align: center;
		border: 1px solid var(--secondary-color);
		padding: 12px 15px;
		user-select: none;
		pointer-events: none;
	}
	.main :global(.button) {
		background-color: var(--primary-color);
		color: var(--text-color);
		width: 100%;
		padding: 10px;
	}
	.main :global(.button:hover) {
		background-color: var(--secondary-color);
		cursor: pointer;
	}
	.main :global(.editable-value) {
		border: 1px solid var(--secondary-color);
		padding: 12px 15px;
		text-align: left;
	}
	.main :global(.icon-tiny) {
		width: 16px;
	}
	.main :global(.icon-small) {
		width: 26px;
	}
	.main :global(.icon-medium) {
		width: 46px;
	}
	.main :global(.icon-large) {
		width: 76px;
	}
	.main :global(.icon:hover) {
		cursor: pointer;
		transform: scale(0.9);
		color: var(--secondary-color);
	}
	.main :global(.delete-icon:hover) {
		color: red;
		cursor: pointer;
		transform: scale(0.9);
	}
	.main :global(.info-container) {
		padding: 25px;
		border: 1px solid var(--secondary-color);
	}
	.main :global(.undertitle) {
		font-size: 22px;
		font-weight: 500;
		letter-spacing: 2px;
	}
	.main :global(.relative) {
		position: relative;
		height: 100%;
	}
	.main :global(.loader) {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	.main :global(.modal-container) {
		border-radius: 7px 7px 0 0;
	}
	.main :global(.modal-header) {
		height: 75px;
		border-radius: 7px 7px 0 0;
		display: flex;
		align-items: center;
		padding: 16px;
		color: var(--text-color);
		background-color: var(--primary-color);
	}
	.main :global(.modal-body) {
		display: flex;

		justify-content: center;
		flex-direction: column;
		min-height: 150px;
		padding: 25px;
	}
	.main :global(.modal-footer) {
		border-top: 2px solid #eee;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex-flow: row;
		column-gap: 10px;
		padding: 0;
	}
	.main :global(.modal-button) {
		min-width: 125px;
		padding: 8px;
	}
	.main :global(.modal-button:hover) {
		cursor: pointer;
	}
	@media screen and (max-width: 460px) {
		.main :global(.grid-container) {
			display: flex;
			flex-direction: column;
		}
	}
</style>
