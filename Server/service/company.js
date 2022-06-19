import {FETCH_COMPANY, ADD_COMPANY, ADD_EMPLOYEE, REMOVE_EMPLOYEE, FETCH_EMPLOYEE, FETCH_EMPLOYEES  } from "../DB/queries/companyQueries.js";
import { COMPANY_EXISTS, UNKNOWN, COMPANY_NOT_FOUND, EMPLOYEE_EXISTS, EMPLOYEE_NOT_FOUND} from "../utils/errors/errors.js";
import { MONGO_DB_DUPLICATE_CODE, BAD_REQ_CODE, CREATED_CODE, OK_CODE, NOT_FOUND_CODE, DUPLICATE_RECORD, RECORD_DELETED } from "../utils/errors/statusCodes.js";

import { ID } from "../DB/mongoDBconnect.js";

export const GET_COMPANY = async ({ companyId }) => {
    return new Promise( async (resolve, reject) => {
        const company = await FETCH_COMPANY(companyId);
        if(company){
            resolve({code: OK_CODE, payload: { company: company }});
        }
        reject({code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND}})        
    })
}
export const CREATE_COMPANY = async ({ id, company }) => {
    return new Promise (async (resolve, reject) => {
        // console.log(company)
        company.createdBy = ID(id);
        company.createdAt = new Date().getTime();
        company.employees = [];      
        // console.log(company)      
    try{
        const result = await ADD_COMPANY(company);
        resolve({ code: CREATED_CODE, payload: { companyId: result.insertedId } })
    }catch(e){
        console.log(e)
        reject({code: BAD_REQ_CODE, error: e.code === MONGO_DB_DUPLICATE_CODE ? COMPANY_EXISTS : UNKNOWN})
    }
    })
}
export const GET_EMPLOYEE = async ({ companyId, employeeId }) => {
    return new Promise( async (resolve, reject) => {
        const { employees } = await FETCH_EMPLOYEE(companyId, employeeId);
        if(employees){
            resolve({code: OK_CODE, payload: { employee: employees[0] }});
        }reject({code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND }})
    })
}
export const GET_EMPLOYEES = async ({ companyId }) => {
    return new Promise( async (resolve, reject) => {
        const { employees } = await FETCH_EMPLOYEES(companyId);
        if(employees){
            resolve({code: OK_CODE, payload: { employees: employees }});
        }reject({code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND }})
    })
}
export const REGISTER_EMPLOYEE = async ({ companyId, id, position }) => {
    return new Promise( async (resolve, reject) => {
        const result = await ADD_EMPLOYEE(companyId, ID(id), position);
        if(result.matchedCount !== 0){
            if(result.modifiedCount !== 0){
                resolve({code: CREATED_CODE, payload: { message: 'Medarbejder tilføjet', modifiedCount: result.modifiedCount }})
            }   reject({code: DUPLICATE_RECORD, error: { message: EMPLOYEE_EXISTS } })
        }
        reject({code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND }})
    })
}
export const DELETE_EMPLOYEE = async ({ companyId, id }) => {
        return new Promise (async (resolve, reject) => {
            const result = await REMOVE_EMPLOYEE(companyId, id);
            if(result.matchedCount !== 0){
                if(result.modifiedCount !== 0){
                    resolve({code: RECORD_DELETED, payload: { message: 'Medarbejder slettet', modifiedCount: result.modifiedCount }})
                }   reject({code: NOT_FOUND_CODE, error: { message: EMPLOYEE_NOT_FOUND } })
            }
            reject({code: NOT_FOUND_CODE, error: { message: COMPANY_NOT_FOUND }})
        })
}

