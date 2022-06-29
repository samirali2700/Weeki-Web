import { ID_VALIDATED } from '../DB/mongoDBconnect.js';

export const checkParams = (fn) => {
	return async function (req, res) {
		let params = {};
		try {
			for (const key of Object.keys(req.params)) {
				params[key] = await ID_VALIDATED(req.params[key]);
			}
			fn(req, res, params);
		} catch (e) {
			res.status(401).send(e.error);
		}
	};
};
