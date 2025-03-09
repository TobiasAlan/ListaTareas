import { Button, Col, Input, Layout, Row } from "antd";
import React, { useEffect, useState} from 'react'
import { signInUser, signUpUser } from "../config/authCall";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from 'react-router-dom';
import "../styles.css"
import { Content, Header } from "antd/es/layout/layout";

export default function Login () {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userPass, setUserPass] = useState('');

    const [newUserName, setNewUserName] = useState('');
    const [newUserMail, setNewUserMail] = useState('');
    const [newUserPass, setNewUserPass] = useState('');

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

    const cambiarNewUserName = (ValorInput) => {
        setNewUserName(ValorInput.target.value);
    } 
    const cambiarNewUserMail = (ValorInput) => {
        setNewUserMail(ValorInput.target.value);
    }
    const cambiarNewUserPass = (ValorInput) => {
        setNewUserPass(ValorInput.target.value);
    }

    const crearCuenta = () => {
        //Condicionales para crear el usuario
        if(newUserName.length < 5){
            window.alert("Ingrese un nombre de al menos 5 caracteres!");
            return;
        }
        if(newUserMail == "") {
            window.alert("Ingrese correctamente un correo electronico!");
            return;
        }
        if(newUserPass.length < 6) {
            window.alert("Ingrese una contraseña de al menos 6 caracteres de largo");
            return;
        }

        signUpUser(newUserName, newUserMail, newUserPass);

        console.log("Cuenta creada!");
        

    }

    return (
        <Layout>
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
            <div style={{paddingTop:20}}/>
            <Button onClick={login} style={{borderColor:'black'}}>Ingresar</Button>
            
            <div>

            <div style={{paddingTop:80}}/>
            
            <Col>
            <Input size="small" placeholder="Nombre Usuario"
            value={newUserName} onChange={cambiarNewUserName}
            style={{borderColor:'black', borderStyle:"double"}}
            />
            </Col>
            <div style={{paddingTop:20}}/>
            <Col>
            <Input size="small" placeholder="Correo"
            value={newUserMail} onChange={cambiarNewUserMail}
            style={{borderColor:'black', borderStyle:"double"}}
            />
            </Col>
            <div style={{paddingTop:20}}/>
            <Col>
            <Input.Password size="small" placeholder="Contraseña"
            value={newUserPass} onChange={cambiarNewUserPass}
            style={{ borderColor:'black', borderStyle:"double"}}
            />
            </Col>

            <div>
            <div style={{paddingTop:20}}/>
            <Button onClick={crearCuenta} style={{borderColor:'black'}}>Crear cuenta</Button>
            </div>
            </div>
            <div style={{paddingBottom:20}}/>

            </Content>
            
            
        </Layout>
        
    );
}