import { Router } from "express";
import {GET_COMPANY, GET_EMPLOYEE, GET_EMPLOYEES, CREATE_COMPANY, REGISTER_EMPLOYEE } from "../service/company.js";

import { checkParams } from "../utils/validation.js";
const companyRouter = Router();

companyRouter
.get('/getCompany/:companyId/', checkParams( async function(req, res, params) {
    try{
        const { code, payload } = await GET_COMPANY({ companyId: params.companyId })
        res.status(code).send(payload);
    }catch(e) {
        res.status(e.code).send(e.error)
    }
}))
.get('/getEmployee/:companyId/:employeeId', checkParams( async function (req, res, params) {
    try{
        const { code, payload } = await GET_EMPLOYEE({ companyId: params.companyId, employeeId: params.employeeId });
        res.status(code).send(payload);
    }catch(e){
        res.status(e.code).send(e.error);
    }
}))
.get('/getEmployees/:companyId', checkParams(async function (req, res, params) {
    try{
        const { code, payload } = await GET_EMPLOYEES({ companyId: params.companyId });
        res.status(code).send(payload);
    }catch(e){
        res.status(e.code).send(e.error);
    }
}))
.post('/createCompany/:creatorId', checkParams(async function (req, res, params) {
    try{
        console.log(req-body);
        res.send({payload: 'good'})
        // const { code, payload } = await CREATE_COMPANY( { id: params.creatorId, company: req.body } );
        // res.status(code).send(payload);
    }catch(e) {
        res.status(e.code).send(e.error);
    }
}))
.post('/addEmployee/:companyId', checkParams(async function (req, res, params) {
    try{
        const { code, payload } = await REGISTER_EMPLOYEE({ companyId: params.companyId, id: req.body.id, position: req.body.position});
        res.status(code).send(payload);
    }catch(e){
        res.status(e.code).send(e.error);
    }
}))
.delete('/deleteEmployee/:companyId/:id/:employeeId', checkParams(async function (req, res, params) {
    res.status(200).send({ companyId: params.companyId, id: params.id, employeeId: params.employeeId })
}))

export default companyRouter;