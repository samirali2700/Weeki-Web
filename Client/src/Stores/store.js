import { derived, writable, readable, get } from "svelte/store";

/**
 * This will be a general store for the app
 * app specific configuration
 * like, theme current page
 */

//page either lastvisited from session if exist, or default home page '/'
export const page = writable(sessionStorage.getItem('lastVisited') || '/');


export const isLoading = writable(false);


/**
 * Save in db? or hardcode the themes?
 * for now the solution will be hardcoded
 * and in the future the possibility to switch over to db is there
 */
export const themes = writable([
    {
        "name": "default",
        "display-name": "Original",
        "primary": '#000000',
        "secondary": '#0088ff',
        "text": "#fff"
    },
    {
        "name": "balance",
        "display-name": "Balance",
        "primary": '#000000FF',
        "secondary": '#FFFFFFFF',
        "text": "#808080"
    },
    { 
        "name": 'honesty',
        "display-name": "Ærlighed",
        "primary": "#89ABE3FF",
        "secondary": "#FCF6F5FF",
        "text": "#000"
    },
    { 
        "name": 'summer',
        "display-name": "Sommer",
        "primary": "#00B1D2FF",
        "secondary": "#FDDB27FF",
        "text": "#000"
    },
    { 
        "name": 'easy_going',
        "display-name": "Stille og Rolig",
        "primary": "#101820FF",
        "secondary": "#FEE715FF",
        "text": "#fff"
    },
    {
        "name": "seabed",
        "display-name": "Havbund",
        "primary": '#FC766AFF',
        "secondary": '#5B84B1FF',
        "text": "#fff"
    },
    {
        "name": "strength_and_hope",
        "display-name": "Styrke og Håb",
        "primary": '#949398FF',
        "secondary": '#F4DF4EFF',
        "text": "#000"
    },
    {
        "name": "vibrant",
        "display-name": "Levende",
        "primary": '#00A4CCFF',
        "secondary": '#F95700FF',
        "text": "#000"
    },
    {
        "name": "tropical",
        "display-name": "Tropisk",
        "primary": '#42EADDFF',
        "secondary": '#CDB599FF',
        "text": "#fff"
    },
    { 
        "name": 'cold_mint',
        "display-name": "Frisk Mynte",
        "primary": "#00203FFF",
        "secondary": "#ADEFD1FF",
        "text": "#fff"
    },
    { 
        "name": 'Greenery',
        "display-name": "Naturen",
        "primary": "#2C5F2D",
        "secondary": "#97BC62FF",
        "text": "#fff"
    },
    { 
        "name": 'creativity',
        "display-name": "Kreativit",
        "primary": "#00539CFF",
        "secondary": "#EEA47FFF",
        "text": "#fff"
    },
    { 
        "name": 'cherry_tomato',
        "display-name": "Cherry Tomat",
        "primary": "#2D2926FF",
        "secondary": "#E94B3CFF",
        "text": "#fff"
    },
    {
        "name": "magic",
        "display-name": "Magi",
        "primary": '#5F4B8BFF',
        "secondary": '#E69A8DFF',
        "text": "#fff"
    },
     
]);


/**
 * Should the theme the user chose be stored in localStorage or in db?
 * the easiest and fastest solution is localStorage
 * but to have to choose a theme again if the localStorage is deleted 
 * or loggedIn from somewhere different from usual
 * is not something i would like, personaly, but for now the theme will be stored in local
 */

export const theme = writable(localStorage.getItem('theme') || 'default');

//the theme is stored in local each time the theme is changed 
$: localStorage.setItem('theme', get(theme));



//derive primary and seconday colors from current theme and themes list
export const primary_color = derived([theme, themes], ($value, set) => {
    set($value[1].find((c) => c.name === $value[0]).primary || '#000');
});

export const secondary_color = derived([theme, themes], ($value, set) => {
    set($value[1].find((c) => c.name === $value[0]).secondary || '#0088ff');
});

export const text_color = derived([theme, themes], ($value, set) => {
    set($value[1].find((c) => c.name === $value[0]).text || '#808080');
});
