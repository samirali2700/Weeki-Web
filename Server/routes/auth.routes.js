import { Router } from "express";
import { AUTHENTICATE, SIGNIN, SIGNUP, SIGNOUT } from "../service/authenticateService.js";
const authRouter = Router();

import { authorize } from "../utils/validation.js";
authRouter.get('/auth', authorize( async function (req, res)  {
    try{
        res.status(200).send({ payload: {name: 'Ali'}})
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
        res.status(e.code).send({error: e.message});
    }
})
.post('/signout', async (req, res) => {
    await SIGNOUT(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.send('signed out 👍'); 
})



export default authRouter;