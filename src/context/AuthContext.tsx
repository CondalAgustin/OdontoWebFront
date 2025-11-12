import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext<any>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{
    token: string
    nombre: string
    rol: string
    email: string
  } | null>(null)

  useEffect(() => {
    const authData = localStorage.getItem('auth')
    if (authData) setAuth(JSON.parse(authData))
  }, [])

  const login = (data: any) => {
    const authData = {
      token: data.token,
      id: data.id,
      nombre: data.nombre,
      rol: data.rol,
      email: data.email,
    }
    localStorage.setItem('auth', JSON.stringify(authData))
    console.log("auth", authData)
    setAuth(authData)
  }

  const logout = () => {
    localStorage.removeItem('auth');   // Si guardás otros datos del usuario
    localStorage.removeItem('token');  // Elimina el JWT
    setAuth(null);                     // Limpia el contexto
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
