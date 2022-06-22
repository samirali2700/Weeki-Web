import { Router } from "express";
import {GET_COMPANY, GET_EMPLOYEE, GET_EMPLOYEES, CREATE_COMPANY, CREATE_EMPLOYEE, GENERATE_REGISTRATION_TOKEN } from "../service/company.js";

import { checkParams } from "../utils/validation.js";
const companyRouter = Router();

companyRouter
.get('/getCompany/:companyId/', checkParams( async function(req, res, params) {
    try{
        const { code, payload } = await GET_COMPANY({ companyId: params.companyId })
        res.status(code).send({ payload: payload });
    }catch(e) {
        res.status(e.code).send({error: e.error})
    }
}))
.get('/getEmployee/:companyId/:employeeId', checkParams( async function (req, res, params) {
    try{
        const { code, payload } = await GET_EMPLOYEE({ companyId: params.companyId, employeeId: params.employeeId });
        res.status(code).send({ payload: payload });
    }catch(e){
        res.status(e.code).send({error: e.error});
    }
}))
.get('/getEmployees/:companyId', checkParams(async function (req, res, params) {
    try{
        const { code, payload } = await GET_EMPLOYEES({ companyId: params.companyId });
        res.status(code).send({ payload: payload });
    }catch(e){
        res.status(e.code).send({ error: e.error });
    }
}))
.get('/getRegistrationToken/:email' ,async (req, res) => {
    try{
        const { token } = await GENERATE_REGISTRATION_TOKEN({companyId: req.user.companyId, email: req.params.email});
        res.status(201).send({token: token});
    }catch(e){
        res.status(e.code).send({error: e.error});
    }
})
.post('/createCompany/:creatorId', checkParams(async function (req, res, params) {
    try{
        const { code, payload } = await CREATE_COMPANY( { id: params.creatorId, company: req.body } );
        res.status(code).send({ payload: payload });
    }catch(e) {
        res.status(e.code).send({error: e.error});
    }
}))
.post('/createEmployee/:companyId', checkParams(async function (req, res, params) {
    try{
        const { code, payload } = await CREATE_EMPLOYEE({ companyId: params.companyId, id: req.body.id, position: req.body.position});
        res.status(code).send({ payload: payload });
    }catch(e){
        res.status(e.code).send({error: e.error});
    }
}))
.delete('/deleteEmployee/:companyId/:id/:employeeId', checkParams(async function (req, res, params) {
    res.status(200).send({ companyId: params.companyId, id: params.id, employeeId: params.employeeId })
}))

export default companyRouter;