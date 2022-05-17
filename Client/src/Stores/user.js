import { derived, writable, readable, get } from "svelte/store";


export const loggedIn = writable(true);


export const user = writable({});


// export const loggedIn = derived(user, (_user) => {
   
//     if(Object.keys(_user).length > 0){
//         return true;
//     }
//     return false;
  
// })

//extra and different layout for admin
//+previleges
export const isAdmin = derived(user, ($user) => {
    if(Object.keys($user).length > 0){
        if($user.admin === true){
            return true;
        }
        return false;
    }
})