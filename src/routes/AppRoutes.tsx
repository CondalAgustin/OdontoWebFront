import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Turnos from '../pages/Turnos'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Paciente from '../pages/Paciente'
import PrivateRoute from './PrivateRoute'
import UsuarioCrearAdmin from '../pages/Admin/UsuarioCrearAdmin'
import UsuarioRegistro from '../pages/UsuarioRegistro'
import Perfil from '../pages/Perfil'
import MisTurnos from '../pages/MisTurnos'
import Trivia from '../pages/Trivia/Trivia'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/turnos" element={<Turnos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/UsuarioRegistro" element={<UsuarioRegistro />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/misTurnos" element={<MisTurnos />} />

      <Route
        path="/trivia"
        element={
          <Trivia />
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['admin', 'gerente']}>
            <Admin />
          </PrivateRoute>
        }
      />

      <Route
        path="/paciente"
        element={
          <PrivateRoute allowedRoles={['Paciente']}>
            <Paciente />
          </PrivateRoute>
        }
      />
      <Route path="/admin/UsuarioCrearAdmin" element={<UsuarioCrearAdmin />} />

    </Routes>
  )
}

export default AppRoutes
