import "dotenv/config";

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

//static 
import path from "path";
app.use(express.static(path.resolve("./Client/public")));


//parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


//io socket connection
import { Server } from "socket.io";
const io = new Server(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

let connectedUser = []

// io.on('connection', (socket) => {

//     const user = socket.handshake.auth;
//     connectedUser.push({uid: user.uid, email: user.email});
  

//     io.on('end', (socket) => {
//         socket.disconnect();
//     })
// })


// import userRoute from "./Server/User/userApi.js";
// app.use(userRoute);


app.get('*', (req,res) => {res.redirect('/')})



server.listen(3000 || process.env.PORT, () => {
    console.log('app listening on port', server.address().port);
})
