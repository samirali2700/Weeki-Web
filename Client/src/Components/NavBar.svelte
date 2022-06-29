<script>
	import { navigate } from 'svelte-navigator';
	import { onMount } from 'svelte';

	import { user, isAdmin } from '../Stores/user';
	import { page } from '../Stores/app';

	import TiHomeOutline from 'svelte-icons/ti/TiHomeOutline.svelte';
	import MdSchedule from 'svelte-icons/md/MdSchedule.svelte';
	import IoIosChatboxes from 'svelte-icons/io/IoIosChatboxes.svelte';
	import IoIosClose from 'svelte-icons/io/IoIosClose.svelte';
	import IoIosPeople from 'svelte-icons/io/IoIosPeople.svelte';

	import Menu from './Menu/Menu.svelte';
	import MyAccount from './Menu/MyAccount.svelte';
	import MenuLinks from './Menu/MenuLinks.svelte';
	import Logo from './Logo.svelte';

	import { SIGNOUT, authGet } from '../utils/fetches';
	import { notifyInfo } from '../utils/notify';

	import { DISCONNECT, joined, left } from '../utils/socket';

	import { getNotificationsContext } from 'svelte-notifications';
	const { addNotification } = getNotificationsContext();

	// update the sessionStorage each time the page state changes
	$: sessionStorage.setItem('lastVisited', $page);

	let show = false;

	//array with available links
	let navigation_items = [
		{ name: 'Oversigt', icon: TiHomeOutline, endpoint: '/' },
		{ name: 'Vagtplan', icon: MdSchedule, endpoint: '/schedule' },
		{ name: 'Beskeder', icon: IoIosChatboxes, endpoint: '/messages' },
	];
	onMount(() => {
		if ($isAdmin) {
			navigation_items = [
				...navigation_items,
				{
					name: 'Medarbejder',
					icon: IoIosPeople,
					endpoint: '/employees',
				},
			];
		}
	});

	joined((data) => {
		addNotification({
			text: data,
			position: 'bottom-right',
			removeAfter: 2000,
		});
	});

	left(function (data) {
		addNotification({
			text: data,
			position: 'bottom-right',
			removeAfter: 2000,
			type: 'danger',
		});
	});

	let screenWidth;

	//compact, medium, full
	$: menu_mode = screenWidth > 1100 ? 'C' : screenWidth > 760 ? 'M' : 'F';
	$: navigate($page);

	$: if ($page) {
		checkAuth();
	}

	async function checkAuth() {
		const { error } = await authGet(null);
		if (error) {
			$page = '/';
			$user = {};
			notifyInfo('Du er blevet logget ud');
		}
	}

	async function signout() {
		const { success, error } = await SIGNOUT();
		if (success) {
			DISCONNECT();
			$page = '/';
			$user = {};
			sessionStorage.setItem('lastVisited', '/');
			sessionStorage.removeItem('userId');
			localStorage.removeItem('savedTheme');
			navigate('/');
		} else notifyError(error.message);
	}
	async function onClick(e) {
		const endpoint = e.detail.endpoint;
		if (endpoint === '/signout') {
			await signout();
		} else {
			show = false;
			$page = endpoint;
		}
	}
</script>

<!-- Bind window innerWidth prop -->
<svelte:window bind:innerWidth={screenWidth} />

<div class="nav">
	<!-- Logo -->
	<div class="logo-container">
		<Logo size={'M'} />
	</div>

	<!-- Links -->
	{#if menu_mode === 'C'}
		<div class="links">
			<MenuLinks {navigation_items} bind:page={$page} />
		</div>
	{/if}

	<!-- Overlay with menu -->
	<div class:overlay={show && menu_mode !== 'C'} />

	<!-- Menu -->
	{#if show && menu_mode !== 'C'}
		<div class="menu-close" on:click={() => (show = false)}><IoIosClose /></div>
	{/if}

	<div>
		<div class="menu">
			<MyAccount bind:show {menu_mode} />
		</div>
		<Menu
			{navigation_items}
			bind:mode={menu_mode}
			bind:show
			on:onClick={onClick}
		/>
	</div>
</div>

<style>
	.nav {
		height: 100px;
		background-color: var(--primary-color);
		color: var(--text-color);
		border-bottom: 4px solid var(--secondary-color, ligthgrey);
		padding: 0 5%;
		display: flex;
		align-items: center;
		column-gap: 10%;
	}
	.logo-container {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		opacity: 70%;
		z-index: 5;
	}
	.menu-close {
		width: 52px;
		height: 52px;
		position: fixed;
		right: 25px;
		top: 15px;
		z-index: 999999;
		color: var(--primary-color);
	}
	.menu-close:hover {
		color: var(--secondary-color);
		cursor: pointer;
	}
</style>
