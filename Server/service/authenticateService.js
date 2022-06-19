import { GET_AUTHENTICATION, CREATE_AUTHENTICATION } from "../DB/queries/authenticationQueries.js";
import {} from "../DB/tokens/tokenQueries.js";
import { hash, compare } from "../utils/bcrypt.js";
import { EMAIL_EXISTS, WRONG_PASSWORD, UNKNOWN, EMAIL_NOT_FOUND } from "../utils/errors/errors.js";
import { MONGO_DB_DUPLICATE_CODE, BAD_REQ_CODE, CREATED_CODE } from "../utils/errors/statusCodes.js";

import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/tokens.js";


export const AUTHENTICATE = (user) => {
    
}

export const SIGNIN = async ({ email, password }) => {
    return new Promise( async (resolve, reject) => {
        const result = await GET_AUTHENTICATION(email);
        if(result !== null){
            if(compare(password, result.password)) {
                const accessToken =  await generateAccessToken(result._id);
                const refreshToken =  await generateRefreshToken(result._id, (60 * 60));
                resolve({code: CREATED_CODE,  payload:{ id: result._id }, accessToken: accessToken, refreshToken: refreshToken });
            } reject({code: BAD_REQ_CODE, error: WRONG_PASSWORD})
        } reject({code: BAD_REQ_CODE, error: EMAIL_NOT_FOUND})
    }) 
}
export const SIGNUP = async ({ email, password }) => {
    return new Promise( async (resolve, reject) => {
        try{
            const result = await CREATE_AUTHENTICATION(email, hash(password));
            resolve({code: CREATED_CODE, payload: { id: result.insertedId }});
        }catch(e){
            reject({code: BAD_REQ_CODE, message: e.code === MONGO_DB_DUPLICATE_CODE ? EMAIL_EXISTS : UNKNOWN})
        }
    })
}
export const SIGNOUT = async (user) => {
  
}
