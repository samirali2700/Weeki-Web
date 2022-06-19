import "dotenv/config";

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";


const app = express();
const server = http.createServer(app);

import path from "path";

if (process.env.NODE_ENV === 'dev') {
    app.use(express.static(path.resolve("./Client/public")));
}
else app.use(express.static(path.resolve("./dev")));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());



import authRouter from "./Server/routes/auth.routes.js";
app.use(authRouter);

import userRouter from "./Server/routes/user.routes.js";
app.use(userRouter);

import companyRouter from "./Server/routes/company.routes.js";
app.use(companyRouter);





app.get('*', (req,res) => {res.redirect('/')})


import { connect } from "./Server/DB/mongoDBconnect.js"
import { nextTick } from "process";
try{
    await connect()
    server.listen(process.env.PORT, () => {
        console.log('app listening on port', server.address().port);
    })
}catch(e) {
    console.log('could not connect to db');
}



   





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