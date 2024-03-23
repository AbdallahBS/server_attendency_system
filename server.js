const express = require('express');
const admin = require('firebase-admin');
const cors  = require("cors");
const app = express();
require('dotenv').config(); // Load environment variables from .env file


app.use(cors());
 
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
  "client_x509_cert_url": process.env.CLIENT_X509,
  "universe_domain": process.env.UNIVERSE_DOMAIN
};
console.log(serviceAccount);
// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://faceattendacerealtime-3ce76-default-rtdb.firebaseio.com"
});


const db = admin.database();
const studentsRef = db.ref("Students");

app.get("/getAllStudents", (req, res) => {
    // Retrieve all students from the database
    studentsRef.once("value", (snapshot) => {
      const students = snapshot.val();
      if (students) {
        // Send the student data as a JSON response
        res.json(students);
      } else {
        res.status(404).json({ message: "No students found in the database." });
      }
    }).catch((error) => {
      console.error("Error retrieving student data:", error);
      res.status(500).json({ message: "An error occurred while retrieving student data." });
    });
  });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
