import "dotenv/config";
import fetch from "node-fetch";

//type: string, payload: Object
const sendRequest = (type, payload) => {
    const POSTOptions = {
        method: 'POST',
        headers: {
            'Content-type':'application/json'
        }
    }


    let url = '';
    let body = {};

    switch(type){
        case 'SIGNIN':
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
                body = {
                    email: payload.email, 
                    password: payload.password,
                    returnSecureToken: true
                }
                
            break;
        case 'VERFIY_EMAIL':
                url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key='

                body = {
                    requestType: 'VERIFY_EMAIL',
                    idToken: payload.idToken,
                };
            break;
        default:
                return 'INVALID REQUEST TYPE';
    }

    POSTOptions.body = JSON.stringify(body);

    //add the api key to the request url
    url += process.env.FIREBASE_KEY;

    return new Promise(async (resolve, reject) => {
            const response = await fetch(url, POSTOptions);    
            const data = await response.json();

            //a successfull request is indicated by code 200, so anything different will be an error
            if(response.status !== 200){
                reject(data);
            }
            resolve(data);
    })

}

export default sendRequest;