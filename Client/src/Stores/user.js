import { derived, writable, readable, get } from "svelte/store";


// export const loggedIn = writable(true);

//{name: 'ali', email: 'samirali@live.dk', admin: true}
export const user = writable({});


export const loggedIn = derived(user, ($user) => {
    if(Object.keys($user).length > 0){
        return true;
    }
    return false;
  
})

//extra and different layout for admin
//+previleges
export const isAdmin = derived(([loggedIn, user]), ($value, set) => {
    if($value[0]){
        if($value[1].admin){
            
             set(true);
        }
        else set(false);
    }
})