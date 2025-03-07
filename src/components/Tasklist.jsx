import { Button, Col, Divider, Input, List, Row, Typography } from "antd";
import { memo, useEffect, useState } from "react";
import { agregarTareaAFirestore, borrarTareaDeFirestore, obtenerTareas, readDataFirestore } from "../config/firestoreCalls";
import { LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
/*
El que esté la creación de nuevas tareas es provisional debido a que
se planea que se encuentre en otro componente
*/


//Funciones propias
function prepararListaTareas(listaTareas) {
    if(typeof(listaTareas) != typeof([])) return []
    console.log("Imprimiendo la lista de tareas previamente")
    console.log(listaTareas)
    console.log("Entrando en la preparacion")
    const listaPreparada = [];

    for(let i = 0; i < listaTareas.length; i++) {
        const tareaEnMano = listaTareas[i];
        console.log("Tarea en mano " + i)
        console.log(tareaEnMano)
        const titulo = tareaEnMano.Nombre.stringValue;
        const descripcion_1 = tareaEnMano.Descripcion.stringValue;
        const descripcion_2 = "(" + tareaEnMano.Creador.stringValue + ", " + tareaEnMano.Fecha.stringValue + ")."
        const objetoTareaPreparada = {
            title: titulo,
            description: descripcion_1 + " " +descripcion_2
        }
        console.log("Obteniendo lista Preparada")
        console.log(listaPreparada)
        listaPreparada.push(objetoTareaPreparada);
    }

    console.log(listaPreparada)
    return listaPreparada;
}

export default function Tasklist() {
    //AAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHHHH
    const { logout, user } = useAuth();

    const [localUser, setLocalUser] = useState(null);
    const [tareas, setTareas] = useState([])
    const [localTareas, setLocalTareas] = useState([])

    const [nombreNuevaTarea, setNombreNuevaTarea] = useState("");
    const [descripcionNuevaTarea, setDescripcionNuevaTarea] = useState("");

    useEffect(() => {
        readUser();
    }, [user]);

    useEffect(() => {
        listaTareasNoPreparada();
    }, [tareas])

    const readUser = async () => {
        //console.log(user)
        const lUser = await readDataFirestore("users", "Correo", user.email);
        //console.log(lUser.docs[0]);
        if(!lUser.empty){
            //El usuario local va a ser el nombre de usuario ingresado
            //en Firestore
            setLocalUser(lUser.docs[0].data())
            console.log(localUser);
        }
    };
    
    //¿Por qué?
    const listaTareasNoPreparada = async () => {
        const listaTareasSinPreparar = await obtenerTareas();
        const listaTareasOrdenada = prepararListaTareas(listaTareasSinPreparar);
        console.log(listaTareasOrdenada);
        if(!localTareas.empty) setLocalTareas(listaTareasOrdenada);
    };

    //Funciones para OnChange
    const cambiarNombreTarea = (ValorInput) => {
        setNombreNuevaTarea(ValorInput.target.value);
    }

    const cambiarDescripcionTarea = (ValorInput) => {
        setDescripcionNuevaTarea(ValorInput.target.value);
    }

    //Funcion para onClick
    const agregarTarea = () => {
        if(localUser == null) {
            console.log("No hay usuario local!");
            return;
        }

        const fechaDeCreacion = new Date().toUTCString();
        console.log(fechaDeCreacion)

        //Evitar que se agreguen tareas sin contenido
        if(nombreNuevaTarea == "" || descripcionNuevaTarea == ""){
            console.log("No hay contenido en la nueva tarea!")
            return;
        }

        agregarTareaAFirestore(
            nombreNuevaTarea,
            descripcionNuevaTarea,
            fechaDeCreacion,
            localUser.Nombre
        );
        setTareas(localTareas);
    }

    const borrarTarea = async (tituloTarea) => {
        console.log("Titulo de tarea a borrar")
        console.log(tituloTarea)
        await borrarTareaDeFirestore(tituloTarea);

        setTareas(localTareas);
    }

    const ListaConBorrado = memo(( {puedeBorrar, puedeVer}) => {
        if(puedeBorrar) {
            return <List
            itemLayout="horizontal"
            header={<div>Lista de tareas</div>}
            footer={<div>Fin de la Lista de Tareas</div>}
            bordered
            dataSource={localTareas}
            renderItem={(tarea, index) => (
                <List.Item
                actions={[<Button onClick={() => {borrarTarea(tarea.title+localUser.Nombre)}}>Borrar</Button>]}>
                    <List.Item.Meta
                        title={<>{tarea.title}</>}
                        description={<>{tarea.description}</>}
                    />
                </List.Item>
            )}
        />
        }

        if(puedeVer){
            return <List
                itemLayout="horizontal"
                header={<div>Lista de tareas</div>}
                footer={<div>Fin de la Lista de Tareas</div>}
                bordered
                dataSource={localTareas}
                renderItem={(tarea, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<>{tarea.title}</>}
                            description={<>{tarea.description}</>}
                        />
                    </List.Item>
                )}
            />
        }

        return ""
    });

    const CamposParaAgregarTareas = memo(( {puedeEscribir = false}) => {
        if(puedeEscribir) {
            return <div id="contenedorAgregarTarea"
            style={{display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20}}>
            <Row>
            <>Agregar una nueva tarea</>
                <Input size="small" placeholder="Nombre de la nueva tarea"
                value={nombreNuevaTarea} onChange={cambiarNombreTarea} />
                <Input size="small" placeholder="Descripcion de la nueva tarea"
                value={descripcionNuevaTarea} onChange={cambiarDescripcionTarea} />
                
                <Button onClick={agregarTarea}> <PlusOutlined /></Button> 
            </Row>
            </div>   
        }
        return ""
    });

    const BotonParaAgregarTarea = ( {puedeEscribir = false}) => {
        return (puedeEscribir ? 
            <Button onClick={agregarTarea}> <PlusOutlined/></Button> :
            ""
        )
    }

    return (
        <div>
            <LogoutOutlined onClick={logout}/>
            <Divider orientation="center">Lista Tareas</Divider>
            <ListaConBorrado
                        puedeBorrar={localUser == null ? false : localUser.puedeBorrar}
                        puedeVer = {localUser == null ? false : localUser.puedeVer} />
            <div id="contenedorAgregarTarea"
            style={{display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20}}>
            <Row>
            <>Agregar una nueva tarea</>
                <Input size="small" placeholder="Nombre de la nueva tarea"
                value={nombreNuevaTarea} onChange={cambiarNombreTarea} />
                <Input size="small" placeholder="Descripcion de la nueva tarea"
                value={descripcionNuevaTarea} onChange={cambiarDescripcionTarea} />
                
                <BotonParaAgregarTarea 
                    puedeEscribir = {localUser == null ? false : localUser.puedeEscribir}/>
            </Row>
            </div>
        </div>
        
    );
    
}