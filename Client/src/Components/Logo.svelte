<script>
	export let size;

	//default
	let w_size;
	let eeki_size;

	$: if (size === 'L') {
		w_size = '156px';
		eeki_size = '106px';
	} else if (size === 'M') {
		w_size = '76px';
		eeki_size = '46px';
	} else if (size === 'S') {
		w_size = '36px';
		eeki_size = '16px';
	} else {
		w_size = '56px';
		eeki_size = '36px';
	}

	$: styles = {
		'w-size': w_size,
		'eeki-size': eeki_size,
	};

	$: logoStyles = Object.entries(styles)
		.map(([key, value]) => `--${key}: ${value}`)
		.join(';');
</script>

<div id="logo" style={logoStyles} class="w3-animate-zoom">
	<p translate="no"><span>W</span>eeki</p>
</div>

<style>
	#logo {
		user-select: none;
	}
	#logo > p > span {
		font-size: var(--w-size, '76px');
		color: var(--secondary-color, '#0088ff');
	}
	#logo > p {
		font-size: var(--eeki-size, '56px');
	}
</style>
