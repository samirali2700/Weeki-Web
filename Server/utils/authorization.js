import { ID } from '../DB/mongoDBconnect.js';
import { AUTHENTICATE } from '../service/authenticate.service.js';
import { UNAUTHORIZED_CODE } from './errors/statusCodes.js';
import { NOT_AUTHROIZED } from './errors/errors.js';

export const auth = (fn) => {
	return function (req, res, next) {
		const accessToken = req.cookies.accessToken || false;
		const refreshToken = req.cookies.refreshToken || false;
		fn(req, res, { accessToken, refreshToken }, next);
	};
};
export const authorize = auth(async function (
	req,
	res,
	{ accessToken, refreshToken },
	next
) {
	if (!accessToken) {
		if (!refreshToken) {
			res.status(UNAUTHORIZED_CODE).send({ error: { message: NOT_AUTHROIZED } });
		} else await checkAuthentication(req, res, next, accessToken, refreshToken);
	} else {
		await checkAuthentication(req, res, next, accessToken, refreshToken);
	}
});
export const socketAuthenticate = async (socket, {}, next) => {
	try {
		const { payload } = await getAuthentication({
			accessToken: socket.cookies.accessToken,
			refreshToken: socket.cookies.refreshToken,
			type: 'socket',
		});
		socket.user = payload;
		next();
	} catch (e) {
		next(new Error(e.error));
	}
};

async function getAuthentication({ accessToken, refreshToken, type }) {
	return new Promise(async (resolve, reject) => {
		try {
			const { code, tokens, payload } = await AUTHENTICATE({
				accessToken,
				refreshToken,
				type,
			});
			resolve({ code: code, payload: payload.user, tokens: tokens });
		} catch (e) {
			reject({ code: e.code, error: e.error });
		}
	});
}

async function checkAuthentication(req, res, next, accessToken, refreshToken) {
	try {
		const { code, tokens, payload } = await AUTHENTICATE({
			accessToken,
			refreshToken,
		});
		req.user = payload.user;
		req.user._id = ID(payload.user._id);
		req.user.companyId = ID(payload.user.companyId);
		req.code = code;
		if (tokens) {
			res.cookie('accessToken', tokens.accessToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 5,
			});
			if (tokens.refreshToken) {
				res.cookie('refreshToken', tokens.refreshToken, {
					httpOnly: true,
					maxAge: 1000 * 60 * 60,
				});
			}
		}
		next();
	} catch (e) {
		res.clearCookie('refreshToken');
		res.clearCookie('accessToken');
		res.status(e.code).send(e.error);
	}
}
