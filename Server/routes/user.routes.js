import { Router } from "express";
import { DELETE_USER, GET_USER, GET_USERS, UPDATE_USER, CREATE_USER } from "../service/user.js";
import { checkParams } from "../utils/validation.js";

const userRouter = Router();

userRouter
.get('/getUser/:userId', checkParams( async function (req, res, params) {
    try{
        const { code, payload } = await GET_USER({ id: params.userId });
        res.status(code).send({ payload: payload })
    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}))
.get('/getUsers/:companyId', checkParams( async function (req, res, params) {
    try{
        const { code, payload } = await GET_USERS({ id: params.companyId});
        res.status(code).send({ payload: payload })
    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}))
.post('/createUser/:companyId/:userId', checkParams( async function (req, res, params)  {
    try{
        const { code, payload } = await CREATE_USER({ companyId: params.companyId, userId: params.userId, user: req.body  });
        res.status(code).send({ payload: payload });
    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}))
.patch('/updateUser/:userId', checkParams( async function (req, res, params)  {
    try{        
        const {code, payload} = await UPDATE_USER({ id: params.userId, user:  req.body.user })
        res.status(code).send({ payload: payload })
    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}))
.delete('/deleteUser/:userId', checkParams( async function (req, res, params)  {
    try{

    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}));


export default userRouter;