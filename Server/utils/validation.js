import { refreshToken } from "firebase-admin/app";
import { ID_VALIDATED } from "../DB/mongoDBconnect.js";
import { verifyToken } from "./tokens.js";
import { AUTHENTICATE } from "../service/authenticateService.js";

export const checkParams = (fn) => {
    return async function (req, res, next) {
        let params = {};
        try{
            for (const key of Object.keys(req.params)) { 
                params[key] = await ID_VALIDATED(req.params[key]);
            }
            fn(req, res, params);
        }catch(e){
            console.log(e);
            res.status(401).send(e.error)
        }  
    }
}  



export const auth = (fn) => {
    return function (req, res, next) {
        const accessToken = req.cookies.accessToken || false;
        const refreshToken = req.cookies.refreshToken || false;
        fn(req, res, { accessToken, refreshToken }, next);
    }
}

export const authorize = auth( async function (req, res, {accessToken, refreshToken}, next)  {    
    let url = req.url
    if(url.includes('/signup/')){
        res.redirect('/');
    }
    if(req.url === '/' || req.url === '/signup' || req.url === '/signin' || req.url === '/signout' || req.url === '/auth'){
        next();
    }else {
        if(!accessToken && !refreshToken){
            res.status(401).send();
            // res.redirect('/');
        } else {
            try{
                const { tokens, payload } = await AUTHENTICATE({accessToken, refreshToken});
                req.user = payload.user;
                if(tokens){
                    res.cookie('accessToken', tokens.accessToken, {httpOnly: true, maxAge: 1000 * 60 * 5})
                    if(tokens.refreshToken){
                    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60})
                    }
                }
                next();
            }catch(e){
                console.log(e);
            }
        }
    }
});