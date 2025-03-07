import { Button, Col, Input, Row } from "antd";
import React, { useEffect, useState} from 'react'
import { signInUser } from "../config/authCall";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from 'react-router-dom';

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
        } else {
            setWarning('Ingrese correctamente sus datos!');
        }
    }, [user]);

    const cambiarUserName = (ValorInput) => {
        setUserName(ValorInput.target.value);
    }
    const cambiarUserPass = (ValorInput) => {
        setUserPass(ValorInput.target.value);
    }
    const login = () => {
        signInUser(userName, userPass);
    }

    return (
        <div>
            <>¡Bienvenido a la lista de Tareas</>
            <div id="advertenciaLogin">{warning}</div>
            <div id="FilasLogin"
            style={{display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',}}>
            <Row>
                <Col>
                <Input size="small" placeholder="Correo del usuario"
                value={userName} onChange={cambiarUserName}/>
                </Col>
                <Col>
                <Input.Password size="small" placeholder="Contraseña"
                value={userPass} onChange={cambiarUserPass}/>
                </Col>
            </Row>
            </div>
            
            <Button onClick={login}>Ingresar</Button>
        </div>
    );
}