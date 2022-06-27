import { derived, writable, readable, get } from 'svelte/store';

export const user = writable({});
export const isLoading = writable(false);

export const loggedIn = derived(user, $user => {
	if (Object.keys($user).length > 0) {
		return true;
	}
	return false;
});

export const isAdmin = derived([loggedIn, user], ($value, set) => {
	if ($value[0]) {
		if ($value[1].admin) {
			set(true);
		} else set(false);
	}
});

export const invitationInfo = writable(false);
