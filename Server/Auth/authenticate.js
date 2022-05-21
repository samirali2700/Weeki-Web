import { app } from "../configs/firebase-admin.js";
import "dotenv/config";

export default (req, res, next) => {

    if(!process.env.NODE_ENV === 'development') {
       if(req.hostname !== 'weekiprojekt.com' || req.hostname !== 'weeki.dk') {
            res.redirect('http://weekiprojekt.com');
       } 
    }


    try{
        const session = req.cookies.session_cookie;
        console.log(req.url)
        console.log(req.hostname)
        res.send('hello')
    }
    catch(e){
       
        if (req.url === '/'){
            next();
        }
        else {
            next();
        }
    }
    
   
};