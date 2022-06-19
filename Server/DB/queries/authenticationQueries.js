import { authentication } from "../collections.js";

export const CREATE_AUTHENTICATION = async (email, password) => {
    return authentication.insertOne( { email: email, password: password, createdAt: new Date().getTime()});
}
export const GET_AUTHENTICATION = (email) => {
    return authentication.findOne({ email: email}, { projection: { password: 1} });
}
export const UPDATE_PASSWORD = (id, password) => {
    return authentication.updateOne({ _id: id }, {$set: { password: password } })
}
export const DELETE_USER = (id) => {
    return authentication.deleteOne({ _id: id });
}

// return new Promise(async (resolve, reject) => {
//     try{
//         const result = await authentication.insertOne( { email: user.email, password: hash(user.password), createdAt: new Date().getTime()});
//         resolve({ id: result.insertedId})
//     }catch(e){
//         reject({code: 403, message: e.code === 11000 ? 'E-mail eksisterer allerede' : 'Der er sket en fejl'})  //return 
//     }
// })