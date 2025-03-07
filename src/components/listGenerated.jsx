



export default listGenerated = ({puedeVisualizar = false}) => {
    const borrarTarea = async (tituloTarea) => {
        console.log("Titulo de tarea a borrar")
        console.log(tituloTarea)
        await borrarTareaDeFirestore(tituloTarea);

        setTareas(localTareas);
    }


    if(puedeVisualizar){
        console.log("Puede ver!")
        return (
        <List
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
        )}/>);
        }
    return (<List
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
    />);
}