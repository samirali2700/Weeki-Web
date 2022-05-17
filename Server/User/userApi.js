import "dotenv/config";
import { Router } from "express";
const userRoute = Router();


import { app, db } from "../Auth/firebase-admin.js";
import sendRequest from "../Auth/firebaseRest.js";


/**
 *  SESSION
 * The idea is, to authenticate with firebase, and signout immediately from the firebase app
 * then validate the token, in case of something, if everything is fine 
 * then assign a session cookie to the user as httpOnly, meaning only the server can see it
 * the each refresh, if the cookie is available and valid the session will continue, 
 * and the server will return a user object, what the user object contains will be things needed on the frontend
 * something like email confirmation will/can be addedd to the user object, to notify the user about it
 * 
 *  SIGNUP
 * Only the admin can/should create a user through the regular way, 
 * employees should be invited with link or a invitations link
 * because a admin and a regular will not be set up in the same way, and with invitation the company associated will be auto known
 * 
 *  DATABASE REALTIME
 * access to database will happen through the server
 */


/**
 * db.ref is creating a listener on the reference that is passed
 * the .on method is like the .on method with socket, and can be used to listen to new values
 * could work well with sockets
 * .on EVENTS 
 * .on value - everything in collection everytime there is change
 * .on child_added - only addedd child and prevKey
 * .on child_changed - updated child
 * .on child_removed - get data of removed child
 * .on child_moved
 * snap.key - return id 
 * ref.off('value');
 * orderByChild('child')
 * orderByKey() - key 
 * orderByValue()
 * 
 * passing null will remove the data
 */

const ref = db.ref('/');

// ref.child('/-N1yMbvBSsvhTCT9Aj4Q').on('value', (snap) => {
//     console.log(snap.val())
// })

// ref.orderByChild('name').equalTo('AWS').once('value', (snapshot) => {
//     const snap = snapshot.val();
//     console.log('New Child:',snap);
//   }, (errorObject) => {
//     console.log('The read failed: ' + errorObject.name);
//   });

const expiresIn = ( 24 * 60 * 60 * 1000);   // 1 days

async function signin(req, res){
    /**
     * What to do if signed in?
     * cookie : session
     * since this project is of course not going to be used by many if any 
     * the need to prefer a method over the other is not neccessary
     * but because the site is designed to be for workplaces,
     * and in theory should be used by alot of employees, and could be used by alot at the same time
     * the session method, would not be a good solutions if the session data gets too big
     * and in case of scaling the server, the session would not be able to work together across servers
     * so the best solution in my opinion falls on cookies, no load on the server memory
     * and is very flexisable, and scaling would not effect the already implemented solution 
     */

    /**
     * Do expiration a day?
     * or 15min, 1 hour?
     * in auth check for expiration, if near expiration reassign a session cookie
     */

    const user = req.body;
    try{
        const response = await sendRequest('SIGNIN', user);
        const verified = await app.auth().verifyIdToken(response.idToken, true);

        //new Date(verified.iat*1000).toString()
        const now = new Date().getTime()

        if((now - verified.iat*1000) < (5 * 60 * 1000)){  // as long as request to server happens before 5 min runs out

             /**
             * Fireabse admin SDK
             * createSessionCookie() method from the admin sdk will create a token that user info can be extracted from
             * expiration interval 5 minutes to 2 weeks.
             */
            const sessionCookie = await app.auth().createSessionCookie(response.idToken, { expiresIn /** A Day */});
            res.cookie('session_cookie', sessionCookie,  {httpOnly: true, secure: true, sameSite: 'strict', maxAge: expiresIn});
            
            const returnObject = {
                email: verified.email,
                uid: verified.uid,
                admin: verified.admin,
                emailVerified: verified.email_verified
            };
          
            res.status(201).send(returnObject);
        }
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


                                                                                    //  AUTH
userRoute.get('/api/auth', async (req,res) => {

    const sessionCookie = req.cookies.session_cookie || undefined;
 

    if(sessionCookie !== undefined){

        try{
            // arg2, check state, is account deleted? disabled? accessRevoked?
            const result = await app.auth().verifySessionCookie(sessionCookie, true);
      

            //Do something with issuedAt, and expiration
//            const iat = new Date(decoded.iat*1000);
//            const exp = new Date(decoded.exp*1000);
            console.log('Verfied session: ',result);

            const returnObject = {
                email: result.email,
                uid: result.uid,
                admin: result.admin,
                emailVerified: result.email_verified
            }

            res.status(201).send(returnObject);



        }catch(e){
            console.log(e);
            res.clearCookie('session_cookie');
            res.status(403).send({error: 'UNAUTHORIZED ACCESS'})
        }
    }
    else{
        res.status(403).send({error: 'UNAUTHORIZED ACCESS'})
    }
});
                                                                                    //  SIGN IN
userRoute.post('/api/signin', signin);

                                                                                    //  SIGN UP
userRoute.post('/api/signup', async (req,res) => {
    const user = req.body;
  

    /**
     * The user cannot or should not be created before the db is checked for the company
     * if the company exist, then a new user should not be created until the correct company is input
     * cases this can happen, if the company name was input wrong (very little chance)
     * the other is if it is an employee trying to signup the wrong way, to prevent an employee from being created as admin
     * the db should always be checked for if the company exists, this way a foolish screw up in the stcrutur will not happen
     */

    try{
        const ref = db.ref('/');
        const name = user.company;
        let companyExists = false;   // flag for existing company, default false 

        /**
         * to use equalTo() we would need a orderBy, and the thing we are looking for is the company name
         * whether to allow the use of the same company name more than once, was a bit difficult of a choice
         * name has no impact on anything, becuase the collections are stored with a unique key
         * but since the unique is not something a regular person would remember 
         * and is also only meant for the logic and to make it more complex to get access to the db unless you know the unique key
         * every member of each collection/company will have a customClaim with a unique key associated with theire company
         * also a admin key, to distinguish between admin and a employee 
         * and know access to the db would be allowed, expected the requested data is in accordance with the customerClaim unique key
         */

        await ref.orderByChild('name').equalTo(name).once('value', (snapshot) => {companyExists = snapshot.exists()})

        //if companyExist
        if(companyExists){
            res.status(403).send({error: 'Virksomheden existerer allerede'})
        }
        else{

            /**
             * The user is created with admin privileges
             * and customClaims can be defined for the newly created user
             * the pro of using the admin sdk, is that there are no limits to what can be done
             * anything can be done by the admin, in this way the server gets full control over the db and authentication
             * extra: a rule can be addedd to only allow disallow any write, since the admin bypasses any rules
             */

            const result = await app.auth().createUser({
                email: user.email,
                emailVerified: false,
                phoneNumber:  user.phone,
                password: user.password,
                displayName: user.firstname + " "+user.lastname,  //name
                photoURL: 'https://whill.inc/pl/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png',
                disabled: false,
            });

            

            const newCompanyRef = ref.push();       //get a unique key

            /**
             * the structur of the data is flex
             * meaning later on, can be changed to suit another solution
             */
            await newCompanyRef.set({
                //name is set on root level to sort and get by name
                "name": user.company,
                "details": {
                   // "phone": "+45"+user.comPhone,
                    "cvr": user.cvr
                },
                "administrators":{
                    "admin1": {
                        "email": result.email,
                        "uid": result.uid
                    }
                }
            })

            //waiting to set the customerClaim until unique key is regenerated and company is created
            //the one created the company will always be a admin, and can later be changed or add to admin
            await app.auth().setCustomUserClaims(result.uid, {admin: true, companyId: newCompanyRef.key});
            console.log(result);

            await signin(req, res);


            /**
             * Send Verification mail
             */
        }
        
        
    }
    catch(e){
        res.status(403).send({error: e.message || e});
        console.log(e)
    }
});
                                                                                    //  SIGN OUT
userRoute.delete('/api/signout', async (req, res) => {
    const sessionCookie = req.cookies.session_cookie || '';

    try{
        const result = await app.auth().verifySessionCookie(sessionCookie);
        await app.auth().revokeRefreshTokens(result.sub);
        res.clearCookie('session_cookie');
        res.status(201).send({error: 'Testing'});
    }
    catch(e){
        console.log(e);
        res.status(403).send({error: e.message || e})
    }   
})


userRoute.delete('/api/deleteuser', (req,res) => {
    const uid = req.body.uid; // or query

    app.auth()
    .deleteUser(uid)
    .then(() => {
      console.log('Successfully deleted user');
    })
    .catch((error) => {
      console.log('Error deleting user:', error);
    });
})

export default userRoute;