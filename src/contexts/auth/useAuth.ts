import { useContext } from 'react'
import { AuthContext, AuthContextData } from './auth.provider'

export const useAuth = (): AuthContextData => {
  const authContext = useContext(AuthContext)
  return authContext
}
