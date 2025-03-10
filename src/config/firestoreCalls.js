import firebaseAcademia from "./firebaseConfig";
import {collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    where
    } from 'firebase/firestore'


function generadorValoresAleatorios() {
    const lista = new Uint32Array(15);
    return crypto.getRandomValues(lista);
}

const db = getFirestore(firebaseAcademia);
export const readDataFirestore = async (path, child, value) => {
    const q = query(collection(db, path), where(child, "==", value))
    const querySnapshot = await getDocs(q)
    return querySnapshot
}

/*Retornara una lista de tareas bajo la misma clase que se presento
con anterioridad
*/
export const obtenerTareas = async () => {
    const q = query(collection(db, "tareas"));
    const querySnapshot = await getDocs(q);


    const tareasGeneradas = []
    for(let i = 0; i < querySnapshot.size; i++) {
        const camposTarea = querySnapshot.docs[i]._document.data.value.mapValue.fields
        tareasGeneradas.push(camposTarea);
    }

    console.log("Generando queries tareas");
    console.log(tareasGeneradas);
    return tareasGeneradas
}

//Por default los usuarios generados solo pueden ver las tareas
export const agregarUsuarioCreado = async (email, Nombre)=> {
    await setDoc(doc(db, "users", Nombre), {
        Correo: email,
        Nombre: Nombre,
        puedeBorrar: false,
        puedeEscribir: false,
        puedeVer: true
    });
}

export const agregarTareaAFirestore = async (titulo, descripcion, fecha, creador) => {
    await setDoc(doc(db, "tareas", titulo), {
        Creador: creador,
        Descripcion: descripcion,
        Fecha: fecha,
        Nombre: titulo
    });
    console.log("Tarea escrita correctamente!");
}

//Espero que exista una forma de poder borrar documentos enteros
//de la Firestore porque esto no es seguro
export const borrarTareaDeFirestore = async (titulo) => {
    await deleteDoc(doc(db, "tareas", titulo));
}





























