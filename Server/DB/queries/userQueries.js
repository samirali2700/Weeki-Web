import { users } from '../collections.js';

export const ADD_USER = async (user) => {
	return users.insertOne(user);
};
export const FETCH_USER = async (_id) => {
	return users.findOne({ _id: _id });
};

export const FETCH_USERS = async (companyId) => {
	return users.find({ companyId: companyId, admin: false });
};
export const EDIT_USER = async (_id, user) => {
	return users.updateOne(
		{ _id: _id },
		{
			$set: {
				firstname: user.firstname,
				lastname: user.lastname,
				phone: user.phone,
				pb: user.pb,
				address: user.address,
			},
			$currentDate: { lastModified: true },
		}
	);
};
export const VERIFY_USER = async (_id) => {
	return users.updateOne(
		{ _id: _id },
		{ $set: { verified: true }, $currentDate: { verifiedAt: true } }
	);
};
export const REMOVE_USER = async (_id) => {
	return users.deleteOne({ _id: _id });
};

export const REMOVE_USERS = async (ids) => {
	return users.deleteMany({ _id: { $in: ids } });
};
