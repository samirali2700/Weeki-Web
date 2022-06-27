export const SIGNOUT = async () => {
	const response = await fetch('/auth/signout', { method: 'DELETE' });
	const { success, error } = await response.json();
	return { success, error };
};

export const authGet = async (url) => {
	let fetchUrl = '/auth';
	if (url !== null) {
		fetchUrl += `/${url}`;
	}
	const response = await fetch(fetchUrl);
	const { payload, error } = await response.json();
	return { payload, error };
};
export const apiGet = async (url) => {
	const response = await fetch(`/api/${url}`);
	const { payload, error } = await response.json();
	return { payload, error };
};

export const authPost = async (url, body) => {
	const response = await fetch(`/auth/${url}`, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(body),
	});
	const { payload, error } = await response.json();
	return { payload, error };
};
export const apiPost = async (url, body) => {
	const response = await fetch(`/api/${url}`, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(body),
	});
	const { payload, error } = await response.json();
	return { payload, error };
};
export const apiPatch = async (url, body) => {
	const response = await fetch(`/api/${url}`, {
		method: 'PATCH',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify(body),
	});
	const { payload, error } = await response.json();
	return { payload, error };
};

export const apiDelete = async (url) => {
	const response = await fetch(`/api/${url}`, { method: 'DELETE' });
	const { payload, error } = await response.json();
	return { payload, error };
};
