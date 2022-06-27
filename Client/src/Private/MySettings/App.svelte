<script>
	import { themes, theme } from '../../Stores/app';
	import { notifyInfo } from '../../utils/notify';
	import { user } from '../../Stores/user';
	let playing = false;

	let count = 0;
	let playInterval;
	let playingTheme = false;

	function resetPlay() {
		clearInterval(playInterval);
		count = 0;
		playingTheme = false;
		playing = false;
		$theme = localStorage.getItem('theme');
	}

	function playThemes() {
		if (playing) {
			resetPlay();
		} else {
			playing = true;

			playInterval = setInterval(() => {
				if (count < $themes.length - 1) {
					playingTheme = $themes[count];
					$theme = playingTheme.name;
					count++;
				} else {
					resetPlay();
				}
			}, 1500);
		}
	}
	function saveTheme() {
		localStorage.setItem('savedTheme', $theme);
		localStorage.setItem($user._id, $theme);

		notifyInfo('Tema gemt');
	}
</script>

<div class="flex-container">
	<div class="grid-container pick-container">
		<b class="grid-full-column">Vælg en tema fra vores eget udvalg</b>
		<p>Tema</p>
		<select
			bind:value={$theme}
			class:button={$user.verified}
			class:w3-disabled={!$user.verified}
		>
			{#each $themes as theme}
				{#if theme.name !== 'custom'}
					<option value={theme.name}>{theme['display-name']}</option>
				{/if}
			{/each}
		</select>
		<p>Gem Tema</p>
		<button
			class:button={$user.verified}
			class:w3-disabled={!$user.verified}
			on:click={saveTheme}>Gem</button
		>

		{#if $user.verified}
			<p class="grid-full-column info-text">
				Hvis du ikke gemmer, bliver temaet nulstillet næste gang siden opdateres .
			</p>
			<p class="grid-full-column info-text">
				Vær opmærksom på hvis du gemmer dit Tema valg, gemmes den for altid på din
				nuværende browser, indtil du tømmer din browser data.
			</p>
		{:else}
			<div class="center-container">
				<h3>Tema funktionen er låst indtil du verificeres</h3>
			</div>
		{/if}
	</div>

	<div />
	<div class="grid-container play-container">
		<button class="button  play-button" on:click={playThemes}
			>{#if !playing}Start Visual præsentation{:else}Stop{/if}</button
		>
	</div>
</div>

<style>
	.play-container {
		border-top: 1px solid var(--primary-color);
		padding: 25px 0 50px 0;
	}
</style>
