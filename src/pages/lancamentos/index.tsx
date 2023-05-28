import CadastroCompraProvider from '@contexts/lancamentos/lancamentos.provider'
import ConteudoPrincipal from '@pages/lancamentos/components/ConteudoPrincipal'
import React from 'react'

const LancamentosPage: React.FC = () => {
  return (
    <CadastroCompraProvider>
      <ConteudoPrincipal />
    </CadastroCompraProvider>
  )
}

export default LancamentosPage
