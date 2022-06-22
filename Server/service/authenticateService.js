import { GET_AUTHENTICATION, CREATE_AUTHENTICATION } from "../DB/queries/authenticationQueries.js";
import {} from "../DB/tokens/tokenQueries.js";
import { hash, compare } from "../utils/bcrypt.js";
import { EMAIL_EXISTS, WRONG_PASSWORD, UNKNOWN, EMAIL_NOT_FOUND, BAD_TOKEN } from "../utils/errors/errors.js";
import { MONGO_DB_DUPLICATE_CODE, BAD_REQ_CODE, CREATED_CODE, UNAUTHORIZED_CODE, INTERNAL_ERROR_CODE, OK_CODE } from "../utils/errors/statusCodes.js";

import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/tokens.js";
import { GET_USER } from "./user.js";

const GET_DETAIL = async (id) => {
    try{
        const { payload } = await GET_USER({id: id});
        return payload;
    }catch(e){
        return false;
    }
}

export const AUTHENTICATE = async ({ accessToken, refreshToken }) => {
    return new Promise(async (resolve, reject) => {
 
        if(accessToken){
            try{
                const { payload } = await verifyToken(accessToken, 'access');
                resolve({code: 200, payload: payload.data})
            }catch(e){
                reject({code: UNAUTHORIZED_CODE, error: { message: BAD_TOKEN }})
            }
        }
        else if(refreshToken){
            try{
                const { payload } = await verifyToken(refreshToken, 'refresh');
                const accessToken =  await generateAccessToken(payload.data);
                const tokens = {
                    accessToken: accessToken,
                    refreshToken: false
                }
                console.log(new Date(payload.exp * 1000).toLocaleTimeString())
                if (( payload.exp * 1000 - new Date().getTime()) > 5 * 1000 * 60) {
                    tokens.refreshToken =  await generateRefreshToken(payload.data, (60 * 60));
                }
                resolve({code: 200, payload: payload.data,  tokens: tokens })
                
            }catch(e){
                reject({code: UNAUTHORIZED_CODE, error: { message: BAD_TOKEN }})
            }
        }
    })
}

export const SIGNIN = async ({ email, password }) => {
    return new Promise( async (resolve, reject) => {
        const result = await GET_AUTHENTICATION(email);
        if(result !== null){
            if(compare(password, result.password)) {
                const detail = await GET_DETAIL(result._id);
                if(detail){
                    const accessToken =  await generateAccessToken(detail);
                    const refreshToken =  await generateRefreshToken(detail, (60 * 60));
                    resolve({code: OK_CODE, payload: detail, accessToken: accessToken, refreshToken: refreshToken });
                }
                reject({code: INTERNAL_ERROR_CODE, error: {message: UNKNOWN}})
                
            } reject({code: BAD_REQ_CODE, error: {message: WRONG_PASSWORD}})
        } reject({code: BAD_REQ_CODE, error: {message: EMAIL_NOT_FOUND}})
    }) 
}
export const SIGNUP = async ({ email, password }) => {
    return new Promise( async (resolve, reject) => {
        try{
            const result = await CREATE_AUTHENTICATION(email, hash(password));
            resolve({code: CREATED_CODE, payload: { id: result.insertedId }});
        }catch(e){
            reject({code: BAD_REQ_CODE, error: { message: e.code === MONGO_DB_DUPLICATE_CODE ? EMAIL_EXISTS : UNKNOWN}})
        }
    })
}
export const SIGNOUT = async (user) => {
  
}
