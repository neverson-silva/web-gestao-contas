import { LancamentosProvider } from '@contexts/lancamentos/lancamentos.provider'
import ConteudoPrincipal from '@pages/lancamentos/components/ConteudoPrincipal'
import React from 'react'

const LancamentosPage: React.FC = () => {
  return (
    <LancamentosProvider>
      <ConteudoPrincipal />
    </LancamentosProvider>
  )
}

export default LancamentosPage
