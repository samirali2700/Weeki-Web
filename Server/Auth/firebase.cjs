//firebase auth and data
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const { getDatabase } = require('firebase-admin/database')

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://myapp-567d6-default-rtdb.europe-west1.firebasedatabase.app"
});


const db = getDatabase(adminApp)


module.exports = db;
module.exports= adminApp