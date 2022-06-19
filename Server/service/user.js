import { ADD_USER, FETCH_USER, FETCH_USERS, EDIT_USER} from "../DB/queries/userQueries.js";
import {  UNKNOWN, USER_NOT_FOUND, USER_EXISTS } from "../utils/errors/errors.js";
import { BAD_REQ_CODE, CREATED_CODE, NOT_FOUND_CODE, OK_CODE, DUPLICATE_RECORD, MONGO_DB_DUPLICATE_CODE } from "../utils/errors/statusCodes.js";
import { ID } from "../DB/mongoDBconnect.js";

export const GET_USER = async ({ id }) => {
    return new Promise(async (resolve, reject) => {
        console.log(id)
        const user = await FETCH_USER(id);
        console.log(user)
        if(user) {
            resolve({code: OK_CODE, payload: { user: user }})
        }
        reject({code: NOT_FOUND_CODE, error: USER_NOT_FOUND});
    })
}
export const GET_USERS = ( comapanyId) => {
    return new Promise(async (resolve, reject) => {
        const users = await FETCH_USERS(comapanyId).toArray();
        if(users){
            resolve({code: OK_CODE, payload: { users: users }})
        }
        reject({code: NOT_FOUND_CODE, error: UNKNOWN})
})
}
export const CREATE_USER = async ({ companyId, userId, user }) => {
    return new Promise(async (resolve, reject) => {
        try{

            user._id = userId;
            user.companyId = companyId;
            const result = await ADD_USER(user);
            resolve({code: CREATED_CODE , payload: 'Bruger blev oprettet'  });
        }catch(e){
            reject( e.code === MONGO_DB_DUPLICATE_CODE ? {code: DUPLICATE_RECORD, error: USER_EXISTS } : {code: BAD_REQ_CODE, error: UNKNOWN})
        }
    })
}
export const UPDATE_USER = ( { id, user } ) => {
    return new Promise(async (resolve, reject) => {
        const result = await EDIT_USER(id,  user );
        if(result.matchedCount  !== 0){
            resolve({ code: OK_CODE, payload: { message: 'Bruger blev opdateret', modifiedCount: result.modifiedCount }})
        }
        reject({code: NOT_FOUND_CODE, error:  USER_NOT_FOUND})
  
    })
}
export const DELETE_USER = () => {
 
}