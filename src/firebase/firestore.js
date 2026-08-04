import { getFirestore } from "firebase/firestore";
import app from "./config";

console.log("APP:", app);

const db = getFirestore(app);

console.log("DB:", db);

export default db;
