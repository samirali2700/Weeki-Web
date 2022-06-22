import { Router } from "express";
import { AUTHENTICATE, SIGNIN, SIGNUP, SIGNOUT } from "../service/authenticateService.js";
const authRouter = Router();

import { authorize, checkParams, auth} from "../utils/validation.js";
authRouter.get('/', auth( async function (req, res, { accessToken, refreshToken })  {
    try{
        if(accessToken || refreshToken){
            const { code, payload, tokens } = await AUTHENTICATE({ accessToken, refreshToken });
            if(tokens){
                res.cookie('accessToken', tokens.accessToken, {httpOnly: true, maxAge: 1000 * 60 * 5})
                if(tokens.refreshToken){
                res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60})
                }
            }
            res.status(code).send({ payload: payload})
        } else res.status(401).send({error: 'Not authenticated'})
    }catch(e) {
        res.status(e.code).send({error: e.message})
    }
}))
.post('/signin', async (req, res) => {
    try{
        const { code,  payload, accessToken, refreshToken } = await SIGNIN({ email: req.body.email, password: req.body.password });
        res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 1000 * 60 * 5})
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60})
        res.status(code).send({ payload: payload });
    }catch(e){
        res.status(e.code).send({error: e.error});
    }
})
.post('/signup', async (req, res) => {
    try{
        const { code, payload } = await SIGNUP({ email: req.body.email, password: req.body.password });
            res.status(code).send({payload: payload}) 
    }catch(e){
        res.status(e.code).send({error: e.error});
    }
})
.delete('/signout', async (req, res) => {
    console.log('signed out')
    // await SIGNOUT(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.status(201).send('signed out 👍'); 
})



export default authRouter;