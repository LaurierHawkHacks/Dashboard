// To run this script:
// npm install -g typescript
// tsc <file_name>.ts

const admin = require("firebase-admin");
// Download this from Firebase Console: Project settings > Service Accounts > Generate new private key
// This json file should be stored in your local environment and should NEVER be uploaded to a public repository.
const serviceAccount = require("../hawkhacks-dashboard-firebase-adminsdk-d8rpk-70489601fc.json"); // Download this from Firebase Console

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Replace with the UID of your admin account: Firebase console > Authentication > Copy user ID
const uid = "4BLffN0uVia1W279wUwj4PII3kt2";
const customClaims = {
    admin: true,
};

admin
    .auth()
    .setCustomUserClaims(uid, customClaims)
    .then(() => console.log("Custom claims added for admin"))
    .catch((error) => console.error("Error adding custom claims:", error));
