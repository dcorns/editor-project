import admin from 'firebase-admin'

// Replace this file with your service account key you get when setting up a firestore.
import serviceAccount from './editor-moch-firebase-adminsdk-xa1uj-7d0e34fdde.json'


admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://editor-moch-default-rtdb.firebaseio.com"
})

//export default admin.firestore()
export default admin
