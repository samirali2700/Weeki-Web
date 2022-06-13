import "dotenv/config";
import { Router } from "express";
const userRoute = Router();


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



// ref.child('/-N1yMbvBSsvhTCT9Aj4Q').on('value', (snap) => {
//     console.log(snap.val())
// })

// ref.orderByChild('name').equalTo('AWS').once('value', (snapshot) => {
//     const snap = snapshot.val();
//     console.log('New Child:',snap);
//   }, (errorObject) => {
//     console.log('The read failed: ' + errorObject.name);
//   });



export default userRoute;