import React, { createContext, useCallback, useState } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  avatar_url: string
  name: string
  email: string
}

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
  updateUser(user: User): void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function signOut() {
  localStorage.removeItem('@GoBarber:token')
  localStorage.removeItem('@GoBarber:user')

  location.href = '/'
}

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')

    if (token && user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.defaults.headers.Authorization = `Bearer ${token}`
      return { token, user: JSON.parse(user) }
    }

    return {} as AuthState
  })

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('auth/login', { email, password })

    const { token } = response.data

    localStorage.setItem('@GoBarber:token', token)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.defaults.headers.Authorization = `Bearer ${token}`

    const responseProfile = await api.get('profile')

    const user = responseProfile.data

    localStorage.setItem('@GoBarber:user', JSON.stringify(user))

    setData({ token, user })
  }, [])

  const signOut = useCallback(async () => {
    await api.delete('auth/revoke')
    // localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user))

      setData({
        token: data.token,
        user,
      })
    },
    [setData, data.token]
  )

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
