import "dotenv/config";

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";


const app = express();
const server = http.createServer(app);


//authenticating every request to server
//is placed before resolving static files
// import authenticate from "./Server/Auth/authenticate.js";
// app.use(authenticate);


//static 
import path from "path";
app.use(express.static(path.resolve("./Client/public")));



//parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// import authRoute from "./Server/routes/auth.route.js";
// app.use(authRoute);

// import userRoute from "./Server/User/userApi.js";
// app.use(userRoute);



app.get('*', (req,res) => {res.redirect('/')})


const PORT = process.env.PORT || 300;
server.listen(PORT, () => {
    console.log('app listening on port', server.address().port);
})




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