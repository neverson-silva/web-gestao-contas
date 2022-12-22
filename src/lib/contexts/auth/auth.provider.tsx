import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { Usuario } from '@models/auth'
import { api } from '@apis/api'
import jwtDecode from 'jwt-decode'
import { useRouter } from 'next/router'

type IAuthProviderProps = PropsWithChildren

export type AuthContextData = {
	usuario?: Usuario
	isAuthenticated: boolean
	isAdmin: boolean
	login(email: string, senha: string): Promise<boolean>
	logout(): Promise<boolean>
	hasRole(...roles: string[]): boolean
}

export const AuthContext = createContext<AuthContextData>(
	{} as unknown as AuthContextData,
)

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
	const router = useRouter()
	useEffect(() => {
		const token = localStorage.getItem('token')

		if (token) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const parsed = jwtDecode(token)?.usuario as unknown as Usuario
			setUsuario(parsed)
		}
	}, [])

	const [usuario, setUsuario] = useState<Usuario | undefined>(undefined)

	const login = useCallback(
		async (email: string, senha: string): Promise<boolean> => {
			const response = await api.login(email, senha)
			response.roles = response.roles.map((role: any) => role.authority)
			setUsuario(response)
			return true
		},
		[usuario],
	)

	const hasRole = (...roles: string[]): boolean => {
		if (roles == undefined || roles.length == 0) {
			return false
		}
		return usuario?.roles.some((role) => roles.includes(role)) ?? false
	}
	const isAdmin = useMemo(() => hasRole('ROLE_ADMIN'), [usuario])

	const logout = useCallback(async (): Promise<boolean> => {
		setUsuario(undefined)
		api.logout()
		router.push('/login')
		return true
	}, [usuario])

	return (
		<AuthContext.Provider
			value={{
				usuario,
				login,
				logout,
				isAuthenticated: !!usuario,
				hasRole,
				isAdmin,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
export default AuthProvider
