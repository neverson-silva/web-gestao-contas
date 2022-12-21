import React from 'react'
import { LancamentoContext } from '@pages/lancamentos/contexts/lancamentos/lancamentos.provider'

export function useBuscaLancamento() {
	const context = React.useContext(LancamentoContext)
	return context.busca
}
