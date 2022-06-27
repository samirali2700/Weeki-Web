<script>
	import Logo from './Logo.svelte';
</script>

<footer class="">
	<div class="footer-container w3-padding">
		<p>Copyright &copy; 2022</p>

		<div>
			<Logo size={'S'} />
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: var(--primary-color, darkgrey);
		color: var(--text-color, ligthgrey);
		width: 100%;
		height: 100px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-top: 5px solid var(--secondary-color, ligthgrey);
		padding: 0 5%;
	}
	.footer-container {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		column-gap: 25px;
	}
</style>
