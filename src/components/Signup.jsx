import React, { useState, useEffect } from 'react';
import { Button, Col, Input, Layout, Row } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { signUpUser } from '../config/authCall';
import "../styles.css"


export default function Signup() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [newUserName, setNewUserName] = useState('');
  const [newUserMail, setNewUserMail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');

  const [warning, setWarning] = useState('');

  useEffect(() => {
    if (user) {
      setWarning(''); //Esto tal vez sea util para cuando se salga de la sesión
      navigate('/Tasklist');
    }
  }, [user]);

  const cambiarNewUserName = (ValorInput) => {
    setNewUserName(ValorInput.target.value);
  };
  const cambiarNewUserMail = (ValorInput) => {
    setNewUserMail(ValorInput.target.value);
  };
  const cambiarNewUserPass = (ValorInput) => {
    setNewUserPass(ValorInput.target.value);
  };

  const crearCuenta = () => {
    //Condicionales para crear el usuario
    if (newUserName.length < 5) {
      window.alert('Ingrese un nombre de al menos 5 caracteres!');
      return;
    }
    if (newUserMail == '') {
      window.alert('Ingrese correctamente un correo electronico!');
      return;
    }
    if (newUserPass.length < 6) {
      window.alert('Ingrese una contraseña de al menos 6 caracteres de largo');
      return;
    }

    signUpUser(newUserName, newUserMail, newUserPass);

    console.log('Cuenta creada!');
  };

  return (
    <Layout style={{ alignContent: 'end' }}>
      <Header style={{ background: '#0060A0' }}>
        <div style={{ color: 'white', borderColor: '#0060A0' }}>
          ¡BIENVENIDO A LA LISTA DE TAREAS
        </div>
      </Header>
      <Content>
        <div>
          <div style={{ paddingTop: 80 }} />

          <Col>
            <Input
              size='small'
              placeholder='Nombre Usuario'
              value={newUserName}
              onChange={cambiarNewUserName}
              style={{ borderColor: 'black', borderStyle: 'double' }}
            />
          </Col>
          <div style={{ paddingTop: 20 }} />
          <Col>
            <Input
              size='small'
              placeholder='Correo'
              value={newUserMail}
              onChange={cambiarNewUserMail}
              style={{ borderColor: 'black', borderStyle: 'double' }}
            />
          </Col>
          <div style={{ paddingTop: 20 }} />
          <Col>
            <Input.Password
              size='small'
              placeholder='Contraseña'
              value={newUserPass}
              onChange={cambiarNewUserPass}
              style={{ borderColor: 'black', borderStyle: 'double' }}
            />
          </Col>

          <div style={{ textAlign: 'end' }}>
            <div style={{ paddingTop: 20 }} />
                        <Button onClick={() => {navigate('/Login')}} style={{ background: 'green',borderColor:'black'}}>INICIAR SESSION</Button>
            <Button onClick={crearCuenta} style={{ borderColor: 'black' }}>
              CREAR CUENTA
            </Button>
          </div>
        </div>
        <div style={{ paddingBottom: 20 }} />
      </Content>
    </Layout>
  );
}
