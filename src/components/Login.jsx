import { Button, Col, Input, Layout, Row } from "antd";
import React, { useEffect, useState} from 'react'
import { signInUser } from "../config/authCall";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import "../styles.css"
import { Content, Header } from "antd/es/layout/layout";

export default function Login () {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userPass, setUserPass] = useState('');

    //Tal vez sea mejor crear un State para cuando se ingrese mal
    //la contraseña o el correo?
    const [warning, setWarning] = useState('');
    
    useEffect(() => {
        if(user){
            setWarning(''); //Esto tal vez sea util para cuando se salga de la sesión
            navigate('/Tasklist')
        }
    }, [user]);

    const cambiarUserName = (ValorInput) => {
        setUserName(ValorInput.target.value);
    }
    const cambiarUserPass = (ValorInput) => {
        setUserPass(ValorInput.target.value);
    }
    const login = () => {
        if(userName == "" || userPass == "") {
            window.alert("Ingrese correctamente sus datos!")
            return
        }
        signInUser(userName, userPass);
        
    }


    return (
        <Layout style={{alignContent:'end'}}>
            <Header style={{background:"#0060A0"}}>
                <div style={{color: 'white', borderColor:"#0060A0"}}>¡BIENVENIDO A LA LISTA DE TAREAS</div>
            </Header>
            
            <Content style={{background:"#fffded"}}>
            <div id="FilasLogin">
                <Col>
                <div style={{paddingTop:20}}/>
                <Input size="small" placeholder="Correo del usuario"
                value={userName} onChange={cambiarUserName}
                style={{borderColor:'black', borderStyle:"double"}}
                />
                </Col>
                <div style={{paddingTop:20}}/>
                <Col>
                <Input.Password size="small" placeholder="Contraseña"
                value={userPass} onChange={cambiarUserPass}
                style={{borderColor:'black', borderStyle:"double"}}
                />
                </Col>
            </div>
            <div style={{paddingTop:20
            }}/>

            <div style={{textAlign:'end'}}>
            <Button onClick={() => {navigate('/Signup')}} style={{ background: 'green',borderColor:'black'}}>CREAR USUARIO</Button>
            <Button onClick={login} style={{borderColor:'black'}}>INGRESAR</Button>
            </div>

            </Content>
            
            
        </Layout>
        
    );
}