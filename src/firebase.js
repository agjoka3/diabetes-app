import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app"

// TODO Get info from env
const firebaseConfig = {
  apiKey: "AIzaSyAG6ya5bUjdvFoFFd-g9drbbDl9NGvBGYs",
  authDomain: "diabetes-health-e2059.firebaseapp.com",
  databaseURL: "https://diabetes-health-e2059-default-rtdb.firebaseio.com",
  projectId: "diabetes-health-e2059",
  storageBucket: "diabetes-health-e2059.appspot.com",
  messagingSenderId:  "668834622345",
  appId: "1:668834622345:web:b7c30d301d9f2d6d130f58"
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;