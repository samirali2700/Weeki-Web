import { derived, writable } from 'svelte/store';

export const page = writable(sessionStorage.getItem('lastVisited') || '/');

export const isLoading = writable(false);

export const themes = writable([
	{
		name: 'default',
		'display-name': 'Original',
		primary: '#000000',
		secondary: '#0088ff',
		text: '#fff',
	},

	{
		name: 'honesty',
		'display-name': 'Ærlighed',
		primary: '#89ABE3FF',
		secondary: '#FCF6F5FF',
		text: '#000',
	},
	{
		name: 'summer',
		'display-name': 'Sommer',
		primary: '#00B1D2FF',
		secondary: '#FDDB27FF',
		text: '#000',
	},
	{
		name: 'easy_going',
		'display-name': 'Stille og Rolig',
		primary: '#101820FF',
		secondary: '#FEE715FF',
		text: '#fff',
	},
	{
		name: 'seabed',
		'display-name': 'Havbund',
		primary: '#FC766AFF',
		secondary: '#5B84B1FF',
		text: '#fff',
	},
	{
		name: 'strength_and_hope',
		'display-name': 'Styrke og Håb',
		primary: '#949398FF',
		secondary: '#F4DF4EFF',
		text: '#000',
	},
	{
		name: 'vibrant',
		'display-name': 'Levende',
		primary: '#00A4CCFF',
		secondary: '#F95700FF',
		text: '#000',
	},
	{
		name: 'tropical',
		'display-name': 'Tropisk',
		primary: '#42EADDFF',
		secondary: '#CDB599FF',
		text: '#fff',
	},
	{
		name: 'cold_mint',
		'display-name': 'Frisk Mynte',
		primary: '#00203FFF',
		secondary: '#ADEFD1FF',
		text: '#fff',
	},
	{
		name: 'greenery',
		'display-name': 'Naturen',
		primary: '#03811c', //
		secondary: '#3db217',
		text: '#fff',
	},
	{
		name: 'creativity',
		'display-name': 'Kreativit',
		primary: '#00539CFF',
		secondary: '#EEA47FFF',
		text: '#fff',
	},
	{
		name: 'cherry_tomato',
		'display-name': 'Cherry Tomat',
		primary: '#2D2926FF',
		secondary: '#E94B3CFF',
		text: '#fff',
	},
	{
		name: 'magic',
		'display-name': 'Magi',
		primary: '#5F4B8BFF',
		secondary: '#E69A8DFF',
		text: '#fff',
	},
	{
		name: 'custom',
		'display-name': 'custom',
		primary: '',
		secondary: '',
		text: '#fff',
	},
]);
export const default_primary = derived(themes, ($themes) => {
	return $themes.find((t) => t.name === 'default').primary;
});
export const default_secondary = derived(themes, ($themes) => {
	return $themes.find((t) => t.name === 'default').secondary;
});

localStorage.setItem('theme', 'default');
export const theme = writable('default');

export const primary_color = derived([theme, themes], ($value, set) => {
	set($value[1].find((c) => c.name === $value[0]).primary || '#000');
});

export const secondary_color = derived([theme, themes], ($value, set) => {
	set($value[1].find((c) => c.name === $value[0]).secondary || '#0088ff');
});

export const text_color = derived([theme, themes], ($value, set) => {
	set($value[1].find((c) => c.name === $value[0]).text);
});
