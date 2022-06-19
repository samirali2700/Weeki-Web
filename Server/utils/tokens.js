import jwt from "jsonwebtoken";



export const generateAccessToken = async (payload) => {
    return jwt.sign({ data: payload }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60 * 5 });
}
export const generateRefreshToken = async (payload, expiresIn) => {
    return jwt.sign({data: payload}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: expiresIn});
}
export const verifyToken = (token, type) => {
    const secret = type === 'access' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error, result) => {
            if(error) reject(err)
            resolve(result)
        })
    })
}

// notBefore: expressed in seconds or a string describing a time span vercel/ms.
// Eg: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default ("120" is equal to "120ms").

// audience
// issuer
// jwtid
// subject
// noTimestamp
// header
// keyid
// mutatePayload: 