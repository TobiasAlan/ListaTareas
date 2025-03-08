import firebaseAcademia from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
const auth = getAuth(firebaseAcademia);

export const signInUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("Credenciales")
    console.log(userCredential)
    // ...
    })
    .catch((error) => {
        console.log(error)
        window.alert("Ingrese correctamente sus datos!");
    });
}

export const logoutFirebase = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("Sesion cerrada")
      }).catch((error) => {
        // An error happened.
        console.log(error)
      });
}

export const userListener = (listener) => {
    onAuthStateChanged(auth, (user) => {
        listener(user);
    })
}