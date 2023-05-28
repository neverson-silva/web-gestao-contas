import '@utils/extensions'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import ptBR from 'antd/lib/locale/pt_BR'
import { useEffect } from 'react'
import WebFont from 'webfontloader'
import './App.css'

import moment from 'moment'
import 'moment/locale/pt-br'
import { AppProviders } from './AppProviders'

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

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Inter:100,200,400,500,700'],
      },
    })
  }, [])
  return (
    <ConfigProvider locale={ptBR}>
      <AppProviders />
    </ConfigProvider>
  )
}

export default App
