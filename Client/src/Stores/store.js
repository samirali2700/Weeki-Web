import { derived, writable, readable, get } from "svelte/store";

/**
 * This will be a general store for the app
 * app specific configuration
 * like, theme current page
 */

//page either lastvisited from session if exist, or default home page '/'
export const page = writable(sessionStorage.getItem('lastVisited') || '/');


export const loading = writable(false);


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
        "secondary": '#0088ff'
    },
      {
        "name": "vibrant",
        "display-name": "Levende",
        "primary": '#00A4CCFF',
        "secondary": '#F95700FF'
    },
    {
        "name": "balance",
        "display-name": "Balance",
       "primary": '#000000FF',
       "secondary": '#FFFFFFFF'
   },
    {
        "name": "tropical",
        "display-name": "Tropisk",
    "primary": '#42EADDFF',
    "secondary": '#CDB599FF'
    },
     {
         "name": "magic",
         "display-name": "Magi",
        "primary": '#5F4B8BFF',
        "secondary": '#E69A8DFF'
    },
     {
         "name": "seabed",
         "display-name": "Havbund",
        "primary": '#FC766AFF',
        "secondary": '#5B84B1FF'
    },
     {
        "name": "strength_and_hope",
        "display-name": "Styrke og Håb",
        "primary": '#949398FF',
        "secondary": '#F4DF4EFF'
    }
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

    console.log('hello here from store')
    set($value[1].filter((t) => t.name === $value[0])[0].primary || '#000' );
});

export const secondary_color = derived([theme, themes], ($value, set) => {
    set($value[1].filter((t) => t.name === $value[0])[0].secondary || '#000' );
});
