// src/routes/PrivateRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactNode
  allowedRoles?: string[]
}

const PrivateRoute = ({ children, allowedRoles }: Props) => {
  const { auth } = useAuth()

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(auth.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PrivateRoute
