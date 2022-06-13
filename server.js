import "dotenv/config";

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";


const app = express();
const server = http.createServer(app);




//static 
import path from "path";
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve("./Client/public")));
}
else app.use(express.static(path.resolve("./dev")));




//parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// import authRoute from "./Server/routes/auth.route.js";
// app.use(authRoute);

// import userRoute from "./Server/User/userApi.js";
// app.use(userRoute);



app.get('*', (req,res) => {res.redirect('/')})


const PORT = process.env.PORT || 3000;
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