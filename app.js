import 'dotenv/config';

import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

import path from 'path';
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('./dev')));
} else {
	app.use(express.static(path.resolve('./Client/public')));
}

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server);

import { connect } from './Server/DB/mongoDBconnect.js';

import { authorize, socketAuthenticate } from './Server/utils/authorization.js';

try {
	await connect();
	server.listen(process.env.PORT, () => {
		console.log('app listening on port', server.address().port);
	});

	const wrap = (middleware) => (socket, next) =>
		middleware(socket.request, {}, next);
	io.use(wrap(cookieParser()));
	io.use(wrap(socketAuthenticate));
	io.on('connection', (socket) => {
		const user = socket.request.user;
		const room = user.companyId.toString();

		socket.on('login', ({ id }) => {
			if (id === null) {
				socket.join(room);
				socket.to(room).emit('joined', {
					data: `${user.firstname} ${user.lastname} er nu online`,
				});
			}
		});

		socket.on('logout', () => {
			socket.to(room).emit('loggedOut', {
				data: `${user.firstname} ${user.lastname} er nu offline`,
			});
		});
	});
} catch (e) {
	console.log('could not connect to db');
}

app.get('/images/email-images/:image', (req, res) => {
	res.sendFile(path.resolve('./Server/mail/images/', req.params.image));
});

app.use('/api/auth', authorize);

import authRouter from './Server/routes/auth.routes.js';
app.use(authRouter);

import userRouter from './Server/routes/user.routes.js';
app.use('/api', userRouter);

import companyRouter from './Server/routes/company.routes.js';
app.use('/api', companyRouter);

import postRouter from './Server/routes/post.routes.js';
app.use('/api', postRouter);

app.use('/*', (req, res) => {
	res.redirect('/');
});
