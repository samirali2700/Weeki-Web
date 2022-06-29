import { authentication } from '../collections.js';

export const CREATE_AUTHENTICATION = async (email, password) => {
	return authentication.insertOne(
		{
			email: email,
			password: password,
		},
		{
			$currentDate: { createdAt: { $type: 'timestamp' } },
		}
	);
};
export const GET_AUTHENTICATION = (email) => {
	return authentication.findOne(
		{ email: email },
		{ projection: { password: 1 } }
	);
};
export const FETCH_LOGIN = (_id) => {
	return authentication.findOne(
		{ _id: _id },
		{ projection: { _id: 0, email: 1 } }
	);
};
export const UPDATE_PASSWORD = (id, password) => {
	return authentication.updateOne(
		{ _id: id },
		{ $set: { password: password }, $currentDate: { modifiedAt: true } }
	);
};
export const REMOVE_AUTHENTICATION = (id) => {
	return authentication.deleteOne({ _id: id });
};
export const REMOVE_AUTHENTICATIONS = (users) => {
	return authentication.deleteMany({ _id: { $in: users } });
};
export const GET_COUNT = async (email) => {
	return authentication.countDocuments({ email: email });
};
export const AUTHENTICATION_EXISTS = async (id) => {
	if ((await authentication.countDocuments({ _id: id })) > 0) {
		return true;
	}
	return false;
};
