import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import PrivateLayout from '@components/PrivateLayout'
import RouteGuard from '@components/RouteGuard'
import AuthProvider from '@contexts/auth/auth.provider'
import ModalProvider from '@contexts/modal/modal.provider'
import ptBR from 'antd/lib/locale/pt_BR'
import { Inter } from '@next/font/google'

import '@utils/extensions'

import moment from 'moment'
import 'moment/locale/pt-br'
import MesAnoProvider from '@contexts/mesAno/mesAno.provider'
import DrawerProvider from '@contexts/drawer/drawer.provider'
import DadosComunsProvider from '@contexts/dadosComuns/dadosComuns.provider'

moment.locale('pt-br', {
	months: [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro',
	],
})

const inter = Inter({ subsets: ['latin'] })

function App({ Component, pageProps, router }: AppProps) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const isLoginPage = router?.state?.pathname === '/login'
	return (
		<ConfigProvider locale={ptBR}>
			<AuthProvider>
				<MesAnoProvider>
					<DrawerProvider>
						<ModalProvider>
							<DadosComunsProvider>
								<RouteGuard>
									<div className={inter.className}>
										{isLoginPage ? (
											<Component {...pageProps} />
										) : (
											<PrivateLayout>
												<Component {...pageProps} />
											</PrivateLayout>
										)}
									</div>
								</RouteGuard>
							</DadosComunsProvider>
						</ModalProvider>
					</DrawerProvider>
				</MesAnoProvider>
			</AuthProvider>
		</ConfigProvider>
	)
}

export default App
