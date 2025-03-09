import firebaseAcademia from "./firebaseConfig";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { agregarUsuarioCreado } from "./firestoreCalls";
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
    });
}

export const signUpUser = async (name, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            await agregarUsuarioCreado(email, name);
        })
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