<script>
	import { navigate } from 'svelte-navigator';
	import TiArrowBackOutline from 'svelte-icons/ti/TiArrowBackOutline.svelte';
</script>

<div class="back" on:click={() => navigate(-1)}>
	<TiArrowBackOutline />
</div>
<div class="content w3-animate-bottom">
	<div class="title">
		<h2 class="text">Hej!</h2>
		<p class="text">Hvad er du her for at lave i dag?</p>
	</div>
	<div>
		<div
			class="w3-card-2 w3-panel w3-hover-blue card"
			on:click={() => navigate('/signup/create')}
		>
			<b class="bold-text">Oprette en ny bruger</b>
			<small class="bold-text"
				>Jeg vil gerne se om Weeki er noget for min virksomhed</small
			>
		</div>
		<div
			class="w3-card-2 w3-panel w3-hover-blue card"
			on:click={() => navigate('/signup/join')}
		>
			<b class="bold-text">Slutte mig til mine kollegaer</b>
			<small class="bold-text"
				>Jeg vil gerne finde mit hold og se min vagtplan</small
			>
		</div>
	</div>
	<div />
</div>

<style>
	.back {
		position: absolute;
		width: 52px;
		height: 52px;
		top: 1%;
		left: 1%;
	}
	.back:hover {
		cursor: pointer;
		transform: scale(0.9);
		color: #0088ff;
	}
</style>
