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
            <Header>
                <div style={{color: 'white'}}>Bienvenido a la lista de tareas!</div>
            </Header>
            
            <Content>
            <div id="FilasLogin">
                <Col>
                <div style={{paddingTop:20}}/>
                <Input size="small" placeholder="Correo del usuario"
                value={userName} onChange={cambiarUserName}
                style={{textAlign:'center'}}
                />
                </Col>
                <div style={{paddingTop:20}}/>
                <Col>
                <Input.Password size="small" placeholder="Contraseña"
                value={userPass} onChange={cambiarUserPass}
                style={{textAlign:'center'}}
                />
                </Col>
            </div>
            <div style={{paddingTop:20}}/>
            <Button onClick={login}>Ingresar</Button>
            
            <div>

            <div style={{paddingTop:80}}/>
            
            <Col>
            <Input size="small" placeholder="Nombre Usuario"
            value={newUserName} onChange={cambiarNewUserName}
            style={{textAlign:'center'}}
            />
            </Col>
            <div style={{paddingTop:20}}/>
            <Col>
            <Input size="small" placeholder="Correo"
            value={newUserMail} onChange={cambiarNewUserMail}
            style={{textAlign:'center'}}
            />
            </Col>
            <div style={{paddingTop:20}}/>
            <Col>
            <Input.Password size="small" placeholder="Contraseña"
            value={newUserPass} onChange={cambiarNewUserPass}
            styles={{textAlign:'center'}}
            />
            </Col>

            <div>
            <div style={{paddingTop:20}}/>
            <Button onClick={crearCuenta}>Crear cuenta</Button>
            </div>
            </div>

            </Content>
            
            
        </Layout>
        
    );
}