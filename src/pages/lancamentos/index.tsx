import { LancamentosProvider } from '@contexts/lancamentos/lancamentos.provider'
import ConteudoPrincipal from '@pages/lancamentos/components/ConteudoPrincipal'
import React from 'react'

export const LancamentosPage: React.FC = () => {
  return (
    <LancamentosProvider>
      <ConteudoPrincipal />
    </LancamentosProvider>
  )
}
