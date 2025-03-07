import { Input, Row } from "antd";

//de Firestore
function addTareaAFirestore() {

}


export default function CreateTask(){


    return(
        <div>
            <Row>
            <Input size="small" placeholder="Nombre de la tarea"
            value={nombreTarea} onChange={cambiarTituloTarea}/>
            <Input size="small" placeholder="Descripcion de la tarea"
            value={descripcionTarea} onChange={cambiarDescripcionTarea}/>
            </Row>
            <Button onClick={addTareaAFirestore}>Agregar tarea</Button>
        </div>
    );
}