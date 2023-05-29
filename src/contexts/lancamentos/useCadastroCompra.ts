import React from 'react'
import { LancamentoContext } from './lancamentos.provider'

export function useCadastroCompra() {
  const context = React.useContext(LancamentoContext)
  return context.cadastro
}
