<script>
	import {
		Circle2,
		Chasing,
		Shadow,
		Diamonds,
		Plane,
		BarLoader,
		SpinLine,
		DoubleBounce,
		Stretch,
		GoogleSpin,
		ScaleOut,
		RingLoader,
		SyncLoader,
		Jumper,
		Wave,
		Firework,
		Square,
		Pulse,
		Moon,
		Clock,
	} from 'svelte-loading-spinners';

	//default colors, if none are set from parent component
	export let styles = { outer: '#0088ff', center: '#000' };
	export let type = 'Circle2';

	export let size = 80;
	export let color = styles.outer;

	const loaders = [
		{ name: 'Chasing', component: Chasing },
		{ name: 'Shadow', component: Shadow },
		{ name: 'Diamonds', component: Diamonds },
		{ name: 'Plane', component: Plane },
		{ name: 'BarLoader', component: BarLoader },
		{ name: 'SpinLine', component: SpinLine },
		{ name: 'DoubleBounce', component: DoubleBounce },
		{ name: 'Stretch', component: Stretch },
		{ name: 'GoogleSpin', component: GoogleSpin },
		{ name: 'ScaleOut', component: ScaleOut },
		{ name: 'RingLoader', component: RingLoader },
		{ name: 'SyncLoader', component: SyncLoader },
		{ name: 'Jumper', component: Jumper },
		{ name: 'Wave', component: Wave },
		{ name: 'Firework', component: Firework },
		{ name: 'Square', component: Square },
		{ name: 'Pulse', component: Pulse },
		{ name: 'Moon', component: Moon },
		{ name: 'Clock', component: Clock },
	];

	const component =
		type !== 'Circle2'
			? loaders.find((c) => c.name === type).component
			: undefined;
</script>

{#if type === 'Circle2'}
	<Circle2
		{size}
		colorOuter={styles.outer}
		colorCenter={styles.center}
		colorInner={styles.outer}
	/>
{:else}
	<svelte:component this={component} {size} {color} />
{/if}
