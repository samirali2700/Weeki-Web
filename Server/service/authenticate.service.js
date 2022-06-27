import {
	GET_AUTHENTICATION,
	CREATE_AUTHENTICATION,
	AUTHENTICATION_EXISTS,
	REMOVE_AUTHENTICATION,
	GET_COUNT,
	REMOVE_AUTHENTICATIONS,
} from '../DB/queries/authenticationQueries.js';
import { hash, compare } from '../utils/bcrypt.js';
import {
	EMAIL_EXISTS,
	WRONG_PASSWORD,
	UNKNOWN,
	EMAIL_NOT_FOUND,
	BAD_TOKEN,
	USER_NOT_FOUND,
	USER_EXISTS,
} from '../utils/errors/errors.js';
import {
	MONGO_DB_DUPLICATE_CODE,
	BAD_REQ_CODE,
	CREATED_CODE,
	UNAUTHORIZED_CODE,
	INTERNAL_ERROR_CODE,
	OK_CODE,
	NOT_FOUND_CODE,
	RECORD_DELETED,
	DUPLICATE_RECORD,
} from '../utils/errors/statusCodes.js';

import {
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
} from '../utils/tokens.js';
import { GET_USER, DELETE_USER, DELETE_USERS } from './user.service.js';
import { ID } from '../DB/mongoDBconnect.js';

const GET_DETAIL = async (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { payload } = await GET_USER({ id: id });
			resolve(payload);
		} catch (e) {
			reject(e);
		}
	});
};

export const AUTHENTICATE = async ({ accessToken, refreshToken }) => {
	return new Promise(async (resolve, reject) => {
		if (accessToken) {
			try {
				const { payload } = await verifyToken(accessToken, 'access');
				const user = await GET_DETAIL(ID(payload.data.user._id));
				resolve({ code: 200, payload: user });
			} catch (e) {
				reject({ code: UNAUTHORIZED_CODE, error: { message: BAD_TOKEN } });
			}
		} else if (refreshToken) {
			try {
				const { payload } = await verifyToken(refreshToken, 'refresh');
				const accessToken = await generateAccessToken(payload.data);
				const tokens = {
					accessToken: accessToken,
					refreshToken: false,
				};
				console.log(new Date(payload.exp * 1000).toLocaleTimeString());
				if (payload.exp * 1000 - new Date().getTime() > 5 * 1000 * 60) {
					tokens.refreshToken = await generateRefreshToken(payload.data, 60 * 60);
				}
				const user = await GET_DETAIL(ID(payload.data.user._id));
				resolve({ code: 200, payload: user, tokens: tokens });
			} catch (e) {
				reject({ code: UNAUTHORIZED_CODE, error: { message: BAD_TOKEN } });
			}
		}
	});
};

export const SIGNIN = async ({ email, password }) => {
	return new Promise(async (resolve, reject) => {
		const result = await GET_AUTHENTICATION(email);

		if (result !== null) {
			if (compare(password, result.password)) {
				try {
					const detail = await GET_DETAIL(result._id);
					const accessToken = await generateAccessToken({
						user: {
							_id: detail.user._id,
							companyId: detail.user.companyId,
							admin: detail.user.admin,
						},
					});
					const refreshToken = await generateRefreshToken(
						{
							user: {
								_id: detail.user._id,
								companyId: detail.user.companyId,
								admin: detail.user.admin,
							},
						},
						60 * 60
					);

					resolve({
						code: OK_CODE,
						payload: detail,
						accessToken: accessToken,
						refreshToken: refreshToken,
					});
				} catch (e) {
					reject({ code: e.code, error: e.error });
				}
			}
			reject({ code: BAD_REQ_CODE, error: { message: WRONG_PASSWORD } });
		}
		reject({ code: BAD_REQ_CODE, error: { message: EMAIL_NOT_FOUND } });
	});
};
export const SIGNUP = async ({ email, password }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CREATE_AUTHENTICATION(email, hash(password));
			resolve({ code: CREATED_CODE, payload: { id: result.insertedId } });
		} catch (e) {
			reject({
				code: BAD_REQ_CODE,
				error: {
					message: e.code === MONGO_DB_DUPLICATE_CODE ? EMAIL_EXISTS : UNKNOWN,
				},
			});
		}
	});
};
export const DELETE_AUTHENTICATION = ({ id }) => {
	return new Promise(async (resolve, reject) => {
		const result = await REMOVE_AUTHENTICATION(id);
		if (result.matchedCount !== 0) {
			try {
				const { code, payload } = await DELETE_USER({ id });
				resolve({ code: code, payload: payload });
			} catch (e) {
				reject({ code: e.code, error: e.error });
			}
		}
		reject({ code: NOT_FOUND_CODE, error: { message: USER_NOT_FOUND } });
	});
};
export const DELETE_AUTHENTICATIONS = ({ ids }) => {
	return new Promise(async (resolve, reject) => {
		const result = await REMOVE_AUTHENTICATIONS(ids);
		if (result.deletedCount !== 0) {
			try {
				const { code, payload } = await DELETE_USERS({ ids });
				resolve({ code: code, payload: payload });
			} catch (e) {
				reject({ code: e.code, error: e.eroor });
			}
		}
		reject({
			code: NOT_FOUND_CODE,
			error: { message: USER_NOT_FOUND },
		});
	});
};
export const CHECK_AUTHENTICATION_EXISTS = ({ email }) => {
	return new Promise(async (resolve, reject) => {
		const count = await GET_COUNT(email);
		if (count === 0) {
			resolve({ code: OK_CODE });
		} else reject({ code: DUPLICATE_RECORD, error: { message: USER_EXISTS } });
	});
};
export const SIGNOUT = async (user) => {};
