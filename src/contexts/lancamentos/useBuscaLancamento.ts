import React from 'react'
import { LancamentoContext } from './lancamentos.provider'

export function useBuscaLancamento() {
	const context = React.useContext(LancamentoContext)
	return context.busca
}
