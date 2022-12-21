import React from 'react'
import { LancamentoContext } from '@pages/lancamentos/contexts/lancamentos/lancamentos.provider'

export function useCadastroCompra() {
	const context = React.useContext(LancamentoContext)
	return context.cadastro
}
