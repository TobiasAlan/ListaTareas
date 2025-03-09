import { Button, Col, Divider, Input, Layout, List, Menu, Row, Typography } from "antd";
import { memo, useEffect, useState } from "react";
import { agregarTareaAFirestore, borrarTareaDeFirestore, obtenerTareas, readDataFirestore } from "../config/firestoreCalls";
import { DeleteColumnOutlined, DeleteFilled, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Content, Footer, Header } from "antd/es/layout/layout";


export default function Tasklist() {
    const { logout, user } = useAuth();

    const [localUser, setLocalUser] = useState(null);
    const [tareas, setTareas] = useState([])
    const [localTareas, setLocalTareas] = useState([])

    const [nombreNuevaTarea, setNombreNuevaTarea] = useState("");
    const [descripcionNuevaTarea, setDescripcionNuevaTarea] = useState("");

    const [barraMenuSuperior, setBarraMenuSuperior] = useState([]);

    const [tareaSeleccionada, setTareaSeleccionada] = useState(0);

    //Funciones propias
    function prepararListaTareas(listaTareas) {
        if(typeof(listaTareas) != typeof([])) return []
        console.log("Imprimiendo la lista de tareas previamente")
        console.log(listaTareas)
        console.log("Entrando en la preparacion")
        const listaPreparada = [];
        const listaNumeros = []

        for(let i = 0; i < listaTareas.length; i++) {
            listaNumeros.push((i+1));
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

        setBarraMenuSuperior(listaNumeros.map((key) => ({
            key, label: 'Tarea' + key
        })))
        console.log(listaPreparada)
        return listaPreparada;
    }

    useEffect(() => {
        readUser();
    }, [user]);

    useEffect(() => {
        listaTareasNoPreparada();
    }, [tareas])

    const readUser = async () => {
        const lUser = await readDataFirestore("users", "Correo", user.email);
        if(!lUser.empty){
            //El usuario local va a ser el nombre de usuario ingresado
            //en Firestore
            setLocalUser(lUser.docs[0].data())
        }
    };
    
    //¿Por qué?
    const listaTareasNoPreparada = async () => {
        const listaTareasSinPreparar = await obtenerTareas();
        const listaTareasOrdenada = prepararListaTareas(listaTareasSinPreparar);
        console.log(listaTareasOrdenada);
        if(!localTareas.empty){
            setLocalTareas(listaTareasOrdenada);
        }
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
            window.alert("No hay contenido en la nueva tarea!")
            return;
        }

        agregarTareaAFirestore(
            nombreNuevaTarea,
            descripcionNuevaTarea,
            fechaDeCreacion,
            localUser.Nombre
        );
        setNombreNuevaTarea('');
        setDescripcionNuevaTarea('');
        setTareas(localTareas);
        
    }

    const borrarTarea = async (tituloTarea) => {
        if(tituloTarea == null){
            return
        }
        console.log("Titulo de tarea a borrar")
        console.log(tituloTarea)
        await borrarTareaDeFirestore(tituloTarea);

        setTareas(localTareas);
        window.alert("Tarea borrada correctamente!");
    }

    /*
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
                actions={[<Button onClick={() => {borrarTarea(tarea.title)}}>Borrar</Button>]}>
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
    */

    const BotonParaAgregarTarea = ( {puedeEscribir = false}) => {
        return (puedeEscribir ? 
            <Button onClick={agregarTarea}> <PlusOutlined/></Button> :
            ""
        )
    }

    function seleccionarUnaTarea(e) {
        //Por default, los keys de los Menus inician desde 1
        const numeroIDParaLista = Number(e.key) - 1;
        setTareaSeleccionada(Number(e.key) - 1);
    }

    const borrarTareaSeleccionada = async () => {
        const localTareaSeleccionada = localTareas[tareaSeleccionada]
        console.log(localTareaSeleccionada)
        if(localTareaSeleccionada == [] || localTareaSeleccionada == undefined){
            console.log("No hay tarea seleccionada!")
            window.alert("No hay tarea seleccionada!")
            return
        }

        console.log("Titulo de tarea a borrar")
        console.log(localTareaSeleccionada.title)
        await borrarTareaDeFirestore(localTareaSeleccionada.title);

        setTareas(localTareas);
        window.alert("Tarea borrada correctamente!");
    }

    const BotonParaBorrarTareaSeleccionada = ( {puedeBorrar = false }) => {
        return (puedeBorrar ?
            <Button onClick={borrarTareaSeleccionada} ><DeleteFilled/></Button>
            :
            <></>
        )
    }

    return (
        <div>
            <Button onClick={logout} color="white"> Salir </Button>
            <Divider orientation="center">Lista Tareas</Divider>
            
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

            <Layout>
                <Layout>
                <Header style={{textAlign:"start", marginRight:"10"}}>
                <Menu 
                    mode="horizontal"
                    theme="dark"
                    items={barraMenuSuperior}
                    selectedKeys={[tareaSeleccionada]}
                    onClick={seleccionarUnaTarea}
                    style={{
                        fontPalette:"light",
                    }}
                    />
                </Header>
                
                </Layout>
            <Content></Content>
            <div style={{background:"white"}}>

            <Col style={{alignItems:"center"}}>
            <h3>
            {localTareas[tareaSeleccionada] != undefined  || localTareas[tareaSeleccionada] == [] ?
            localTareas[tareaSeleccionada].title :
            ""}
            
            <BotonParaBorrarTareaSeleccionada
            puedeBorrar = {localUser == null ? false : localUser.puedeBorrar}
            style={{padding:20}} />
            </h3>

            
            </Col>
           
            Descripcion:<br/>
            {localTareas[tareaSeleccionada] != undefined  || localTareas[tareaSeleccionada] == [] ?
            localTareas[tareaSeleccionada].description :
            ""}


            </div>

            

            </Layout>
        </div>
        
    );
    
}