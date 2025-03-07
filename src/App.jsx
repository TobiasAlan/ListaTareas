import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Tasklist from './components/Tasklist'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './components/Login'


function App() {
  const [count, setCount] = useState(0)

  const datos = []
  for(let i = 0; i < 10; i++){
    const nuevoDato = {title:"",description:""};
    nuevoDato.title = "Tarea " + String(i)
    nuevoDato.description = "Descripcion de la tarea " + String(i)
    datos.push(nuevoDato)
  }

  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route index element={<Login/>} />
        
        <Route
          path='/Login'
          element={<Login/>}
        />

        <Route
        path='/Tasklist'
        element={<ProtectedRoute> <Tasklist/> </ProtectedRoute>}
        />
        
      </Routes>
      </AuthProvider>
      
      </BrowserRouter>
    </div>
  );
}

export default App
