import AuthProvider from '@contexts/auth/auth.provider'
import { DadosComunsProvider } from '@contexts/dadosComuns/dadosComuns.provider'
import DrawerProvider from '@contexts/drawer/drawer.provider'
import { MesAnoProvider } from '@contexts/mesAno/mesAno.provider'
import ModalProvider from '@contexts/modal/modal.provider'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'

export const AppProviders = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MesAnoProvider>
          <DrawerProvider>
            <ModalProvider>
              <DadosComunsProvider>
                <Routes />
              </DadosComunsProvider>
            </ModalProvider>
          </DrawerProvider>
        </MesAnoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
