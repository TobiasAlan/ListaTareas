import { Button, Col, Divider, Layout, Menu, Row,} from "antd";
import { memo, useEffect, useState } from "react";
import { agregarTareaAFirestore, borrarTareaDeFirestore, obtenerTareas, readDataFirestore } from "../config/firestoreCalls";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Header } from "antd/es/layout/layout";
import TextArea from "antd/es/input/TextArea";


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
                description: (descripcion_1 + " " +descripcion_2)
            }
            console.log("Obteniendo lista Preparada")
            console.log(listaPreparada)
            listaPreparada.push(objetoTareaPreparada);
        }

        setBarraMenuSuperior(listaNumeros.map((key) => ({
            key, label: 'Tarea ' + key 
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

    const BotonParaAgregarTarea = ( {puedeEscribir = false}) => {
        return (puedeEscribir ? 
            <Button onClick={agregarTarea} style={{paddingInline:'45%'}}> <PlusOutlined/></Button> :
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
            <div style={{textAlign:'end'}}>
            <Button onClick={borrarTareaSeleccionada} 
            style={{background:'red'}}
            size="small">
                <DeleteFilled style={{background:'red', color:'white'}}/>
            </Button>
            
            </div>
            :
            <></>
        )
    }

    return (
        <div>

            
            <Row style={{borderBlockStyle:'dashed'}}>
                <Col flex={5}>
                <h3>LISTA DE TAREAS</h3>
                <Divider orientation="center"></Divider>
                
                <div id="contenedorAgregarTarea"
                style={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20}}>
                <Row>
                <div style={{textAlign:'center'}}>Agregar una nueva tarea</div>
                    <TextArea size="small" placeholder="Nombre de la nueva tarea"
                    value={nombreNuevaTarea} onChange={cambiarNombreTarea} />
                    <TextArea size="auto" placeholder="Descripcion de la nueva tarea"
                    
                    value={descripcionNuevaTarea} onChange={cambiarDescripcionTarea} />
                    
                    <BotonParaAgregarTarea 
                        puedeEscribir = {localUser == null ? false : localUser.puedeEscribir}/>
                </Row>
                </div>
                <Button onClick={logout} style={{marginTop:20}}> Salir </Button>
                </Col>
                
                <div class='vl' style={{
                    border:"6px",
                    height:"500px"
                }}/>

                <Col flex={10}>
                    <Layout>
                    <Layout>
                    <Header style={{textAlign:"start", marginRight:"10", background:'#0060A0',
                        borderBlockStyle:'dashed',
                        textAlign:'justify'
                    }}>
                    <Menu 
                        mode="horizontal"
                        theme="#0060A0"
                        items={barraMenuSuperior}
                        selectedKeys={[tareaSeleccionada]}
                        onClick={seleccionarUnaTarea}
                        style={{
                            color:"white"
                        }}
                        />
                    </Header>
                    
                    </Layout>
                <div style={{background:"white"}}>

                <Col style={{alignItems:"center"}}>
                <BotonParaBorrarTareaSeleccionada
                puedeBorrar = {localUser == null ? false : localUser.puedeBorrar}/>
                <h3>
                {localTareas[tareaSeleccionada] != undefined  || localTareas[tareaSeleccionada] == [] ?
                localTareas[tareaSeleccionada].title :
                ""}
                
                
                </h3>

                
                </Col>
                
                <div style={{margin:20}}>
                Descripcion:<br/>
                {localTareas[tareaSeleccionada] != undefined  || localTareas[tareaSeleccionada] == [] ?
                localTareas[tareaSeleccionada].description :
                ""}
                </div>

                <div style={{paddingBottom:20}} /> 
                </div>

                

                </Layout>
                    </Col>

            </Row>
        </div>
        
    );
    
}