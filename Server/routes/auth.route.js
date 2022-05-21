import { app, db } from "../configs/firebase-admin.js";
import { Router } from "express";

import sendRequest from "../Auth/firebaseRest.js";

const authRoute = Router();

const expiresIn = ( 24 * 60 * 60 * 1000);   // 1 days


const companies = app.firestore().collection('companies');

// const snap = await companies.where('name','==', 'Weeki').get();
// const snap = await companies.orderBy('cvr', 'desc').limit(1).get();

async function createSession(req, res, user) {
    try{
        const response = await sendRequest('SIGNIN', user);
      
     

        const verified = await app.auth().verifyIdToken(response.idToken, true);
        //new Date(verified.iat*1000).toString()
        const now = new Date().getTime()

        // if((now - verified.iat*1000) < (5 * 60 * 1000)){  // as long as request to server happens before 5 min runs out

             /**
             * Fireabse admin SDK
             * createSessionCookie() method from the admin sdk will create a token that user info can be extracted from
             * expiration interval 5 minutes to 2 weeks.
             */
            const sessionCookie = await app.auth().createSessionCookie(response.idToken, { expiresIn /** A Day */});
            res.cookie('session_cookie', sessionCookie,  {httpOnly: true, secure: false, sameSite: 'strict', maxAge: expiresIn});
            
            const returnObject = {
                email: verified.email,
                uid: verified.uid,
                admin: verified.admin,
                emailVerified: verified.email_verified
            };
          
            res.status(201).send(returnObject);
        // }
    }
    catch(e){
            /* The error message is sent back as an error
             * future implementations, 
             * to translate the known messages to danish
             */
        console.log(e);
        res.status(403).send({error: e.error.message});
    }
}


authRoute
.get('/auth', async (req, res, next) => {
    const sessionCookie = req.cookies.session_cookie || undefined;
    if(sessionCookie !== undefined){
        try{
            // arg2, check state, is account deleted? disabled? accessRevoked?
            const result = await app.auth().verifySessionCookie(sessionCookie, true);
      

            //Do something with issuedAt, and expiration
//            const iat = new Date(decoded.iat*1000);
//            const exp = new Date(decoded.exp*1000);
            //console.log('Verfied session: ',result);

            const returnObject = {
                email: result.email,
                uid: result.uid,
                admin: result.admin,
                emailVerified: result.email_verified
            }

            res.status(201).send(returnObject);



        }
        catch(e){
            console.log(e);
            res.clearCookie('session_cookie');
            res.status(403).send({error: 'UNAUTHORIZED ACCESS'})
        }
    }
    else{
        res.status(403).send({error: 'UNAUTHORIZED ACCESS'})
    }
})
.post('/signin', (req, res) => {
    createSession(req, res, req.body);
})
.post('/signup', async (req, res) => {
   
    const company = req.body.company
    const user = req.body.user

    // TODO: take company address info in signup frontend
  

  
    /**
     * The user cannot or should not be created before the db is checked for the company
     * if the company exist, then a new user should not be created until the correct company is input
     * cases this can happen, if the company name was input wrong (very little chance)
     * the other is if it is an employee trying to signup the wrong way, to prevent an employee from being created as admin
     * the db should always be checked for if the company exists, this way a foolish screw up in the stcrutur will not happen
     */

    try{
        const snap = await companies.where('name', '==', company.name).get()
        if(!snap.empty){
            res.status(403).send({error: 'Virksomheden existerer allerede'})
        }
        else {
 
            

            /**
             * The user is created with admin privileges
             * and customClaims can be defined for the newly created user
             * the pro of using the admin sdk, is that there are no limits to what can be done
             * anything can be done by the admin, in this way the server gets full control over the db and authentication
             * extra: a rule can be addedd to only allow disallow any write, since the admin bypasses any rules
             */

            const result = await app.auth().createUser({
                email: user.email,
                password: user.password,
                displayName: user.firstname + " "+user.lastname,  //name
                photoURL: 'https://whill.inc/pl/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
            });

            const data = {
                address: {
                    'country': 'Danmark',
                    'city': 'brønshøj',
                    'street_name': 'brønshøjvej',
                    'street_number': '154',
                    'zip': '2700'
                } ,
                name: company.name,
                admin: {
                    'uid': result.uid
                },
                cvr: company.cvr,
                emplyees: [],
                phone: company.phone
            };
    

            const docRef =  companies.doc();

            await docRef.set(data)
          

            //waiting to set the customerClaim until unique key is regenerated and company is created
            //the one created the company will always be a admin, and can later be changed or add to admin
            await app.auth().setCustomUserClaims(result.uid, {admin: true});

            await createSession(req, res, user);


            /**
             * Send Verification mail
             */
        
        }
        
        
        
    }
    catch(e){
        res.status(403).send({error: e.message || e});
        console.log(e)
    }
})
.delete('/signout', async (req, res) => {
    const sessionCookie = req.cookies.session_cookie || '';
    try{
      
        const result = await app.auth().verifySessionCookie(sessionCookie);
        await app.auth().revokeRefreshTokens(result.sub);

        res.clearCookie('session_cookie');
        res.status(201).send();

    }
    catch(e){
        console.log(e);
    }  
})


export default authRoute;