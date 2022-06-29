import { io } from 'socket.io-client';

const socket = io();

socket.on('connect', () => {});
socket.on('connect_error', () => {
	socket.connect();
});

socket.emit('login', { id: sessionStorage.getItem('userId') });
export const CONNECT = () => {
	socket.connect();

	socket.emit('login', { id: null });
};
export const DISCONNECT = () => {
	socket.emit('logout');
	socket.disconnect();
};

export const joined = (fn) => {
	socket.removeListener('joined');
	socket.on('joined', ({ data }) => {
		fn(data);
	});
};
export const left = (fn) => {
	socket.removeListener('loggedOut');
	socket.on('loggedOut', ({ data }) => {
		fn(data);
	});
};

export default socket;
