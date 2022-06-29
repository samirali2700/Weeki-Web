import jwt from 'jsonwebtoken';

export const generateRegisterToken = async (payload) => {
	return jwt.sign({ data: payload }, process.env.REGISTER_TOKEN_SECRET, {
		expiresIn: 60 * 60 * 24 * 5,
	});
};

export const generateAccessToken = async (payload) => {
	return jwt.sign({ data: payload }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: 60 * 5,
	});
};
export const generateRefreshToken = async (payload, expiresIn) => {
	return jwt.sign({ data: payload }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: expiresIn,
	});
};
export const verifyToken = (token, type) => {
	let secret = '';
	switch (type) {
		case 'access':
			secret = process.env.ACCESS_TOKEN_SECRET;
			break;
		case 'refresh':
			secret = process.env.REFRESH_TOKEN_SECRET;
			break;
		case 'registration':
			secret = process.env.REGISTER_TOKEN_SECRET;
			break;
	}

	return new Promise(async (resolve, reject) => {
		jwt.verify(token, secret, function (error, decoded) {
			if (error) reject({ error: error });
			resolve({ payload: decoded });
		});
	});
};
