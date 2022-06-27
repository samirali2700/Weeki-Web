import {
	ADD_USER,
	FETCH_USER,
	FETCH_USERS,
	EDIT_USER,
	VERIFY_USER,
	REMOVE_USER,
	REMOVE_USERS,
} from '../DB/queries/userQueries.js';
import {
	UNKNOWN,
	USER_NOT_FOUND,
	USER_EXISTS,
} from '../utils/errors/errors.js';
import {
	BAD_REQ_CODE,
	CREATED_CODE,
	NOT_FOUND_CODE,
	OK_CODE,
	DUPLICATE_RECORD,
	MONGO_DB_DUPLICATE_CODE,
	RECORD_DELETED,
	INTERNAL_ERROR_CODE,
} from '../utils/errors/statusCodes.js';
import { ID } from '../DB/mongoDBconnect.js';

import mailService from '../mail/mailService.js';
import { FETCH_LOGIN } from '../DB/queries/authenticationQueries.js';

export const GET_USER = async ({ id }) => {
	return new Promise(async (resolve, reject) => {
		const user = await FETCH_USER(id);
		if (user) {
			resolve({ code: OK_CODE, payload: { user: user } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};
export const GET_USER_LOGIN = async ({ id }) => {
	return new Promise(async (resolve, reject) => {
		const login = await FETCH_LOGIN(id);
		if (login) {
			resolve({ code: OK_CODE, payload: { login: login } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};
export const GET_USERS = (comapanyId) => {
	return new Promise(async (resolve, reject) => {
		const users = await FETCH_USERS(comapanyId).toArray();
		if (users) {
			resolve({ code: OK_CODE, payload: { users: users } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: UNKNOWN } });
	});
};
export const CREATE_USER = async ({ companyId, userId, user, email }) => {
	return new Promise(async (resolve, reject) => {
		try {
			user._id = userId;

			if (user.pb.length === 0) {
				user.pb =
					'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=';
			}
			user.companyId = companyId;
			user.verified = false;
			user.address = {
				country: '',
				city: '',
				street: '',
				streetnumber: '',
				zip: '',
			};
			const result = await ADD_USER(user);
			const data = {
				type: 'register_confirm',
				to: email,
				linkTo: `api/users/account/validation/${userId}`,
				name: user.firstname + ' ' + user.lastname,
			};

			await mailService(data);
			resolve({ code: CREATED_CODE, payload: 'Bruger blev oprettet' });
		} catch (e) {
			reject(
				e.code === MONGO_DB_DUPLICATE_CODE
					? { code: DUPLICATE_RECORD, error: { message: USER_EXISTS } }
					: { code: BAD_REQ_CODE, error: { message: UNKNOWN } }
			);
		}
	});
};
export const UPDATE_USER = ({ id, user }) => {
	return new Promise(async (resolve, reject) => {
		const result = await EDIT_USER(id, user);
		if (result.matchedCount !== 0) {
			resolve({
				code: OK_CODE,
				payload: {
					message: 'Ændringerne blev gemt',
					modifiedCount: result.modifiedCount,
				},
			});
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};

export const VERIFY_ACCOUNT = ({ id }) => {
	return new Promise(async (resolve, reject) => {
		const result = await VERIFY_USER(id);
		if (result.matchedCount !== 0) {
			resolve({
				code: OK_CODE,
				payload: {
					message: 'Bruger verificeret',
					modifiedCount: result.modifiedCount,
				},
			});
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};

export const DELETE_USER = ({ id }) => {
	return new Promise(async (resolve, reject) => {
		const result = await REMOVE_USER(id);

		if (result.deletedCount !== 0) {
			resolve({
				code: OK_CODE,
				payload: {
					message: `Bruger (${result.deletedCount}) info slettet`,
				},
			});
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};
export const DELETE_USERS = ({ ids }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await REMOVE_USERS(ids);
			if (result.deletedCount !== 0) {
				resolve({
					code: OK_CODE,
					payload: { message: `(${result.deletedCount}) Bruger blev slettet ` },
				});
			}
		} catch (e) {
			console.log(e);
			reject({ code: INTERNAL_ERROR_CODE, error: { message: UNKNOWN } });
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};
