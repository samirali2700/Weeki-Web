import { users } from "../collections.js";

export const ADD_USER = (user) => {
    return users.insertOne(user);
}
export const FETCH_USER = ( _id ) => {
    return users.findOne({ _id: _id });
}
export const FETCH_USERS = (  companyId  ) => {
    return users.find({ companyId: companyId });
}
export const EDIT_USER = ( _id, user) => {
    return users.updateOne({ _id: _id }, { $set: { firstName: user.firstName, 
    lastName: user.lastName, phone: user.phone, pb: user.pb }})
}
export const DELETE_USER = (_id) => {
    return users.findOneAndDelete({ _id: _id });
}
