import jwt    from 'jsonwebtoken'; 
import { insertToken, getToken, rmToken } from '../Database/tokenDB.js';
import bcrypt from 'bcrypt';
import User from '../Database/Schema/User.js';

//Temp refreshToken holder
let refreshTokens = [];

export function saveUser(user){
    return new Promise( async (resolve, reject) => {
        user.password = await bcrypt.hash(user.password, 12);
        const newUser = new User(user);
        newUser.save(function(err, result){
            if(err) {   reject(err) }
            resolve(result)
        })       
    })
}

export function checkUser(user){
    return new Promise( async (resolve, reject) => {
        User.findOne({email: user.email},  async function(err, result){
         
            if(err){ reject({error: err})}
            if(result){

                if(user.password !== null){
                    const passMatch = await bcrypt.compare(user.password, result.password);

                    if(!passMatch){
                        reject({message:'Incorrect password'})
                    }
                }
                resolve({
                        id: result._id,
                        name: result.name,
                        email: result.email
                })
            }
            else reject({message: 'Email not found'})
        })
    })
}

export const verifyToken = (token, secret) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token, secret, (err, user) => {
            if(err) reject(err);
            if(user.name === 'Admin'){
                resolve({name: user.name, email: user.name});
            }
            else User.findById(user.id)
                .then((data) => {
                    resolve({
                        id: data._id,
                        name: data.name,
                        email: data.email
                    });
                })
                .catch((e) => reject(e))
        })
    })
}


export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15min'});
}

export const generateRefreshToken = (user, expires) => {
    let expire;
    if(expires!==null) expire = expires;
    else expire = '1d'
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: expire})
}
