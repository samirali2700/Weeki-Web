import 'dotenv/config';

import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';

const app = express();
const server = http.createServer(app);

import path from 'path';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'dev') {
	app.use(express.static(path.resolve('./Client/public')));

	try {
		await connect();
		server.listen(process.env.PORT, () => {
			console.log('app listening on port', server.address().port);
		});
	} catch (e) {
		console.log('could not connect to db');
	}
} else {
	app.use(express.static(path.resolve('./dev')));
	server.listen(process.env.PORT, () => {
		console.log('app listening on port', server.address().port);
	});
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNvbXBhbnlJZCI6IjYyYjA3MmYxMGNjZWZkNjc2NGQxMzZhYSIsImVtYWlsIjoiMTUwNXNhbWlyYWxpQGdtYWlsLmNvbSIsIm5hbWUiOiJXZWVraSJ9LCJpYXQiOjE2NTYxMTUxNzYsImV4cCI6MTY1NjU0NzE3Nn0.XYu4_0CwhiwOCEk4bZxT7vN2k04DBR-OcYEhQyK2yq0

app.get('/images/email-images/:image', (req, res) => {
	res.sendFile(path.resolve('./Server/mail/images/', req.params.image));
});
// app.use(authorize);

app.use(authRouter);
import { authorize } from './Server/utils/authorization.js';

app.use('/api/auth', authorize);
app.use((req, res, next) => {
	next();
});
app.use('/api', userRouter);

app.use('/api', companyRouter);

app.use('/*', (req, res) => {
	res.redirect('/');
});
import authRouter from './Server/routes/auth.routes.js';
import userRouter from './Server/routes/user.routes.js';
import companyRouter from './Server/routes/company.routes.js';
import { connect } from './Server/DB/mongoDBconnect.js';

// app.get('*', (req,res) => {res.redirect('/')})

// //io socket connection
// import { Server } from "socket.io";
// const io = new Server(server);

// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// let connectedUser = []

// io.on('connection', (socket) => {

//     const user = socket.handshake.auth;
//     connectedUser.push({uid: user.uid, email: user.email});

//     io.on('end', (socket) => {
//         socket.disconnect();
//     })
// })
