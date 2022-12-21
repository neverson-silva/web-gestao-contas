import React from 'react'
import { LancamentoContext } from '@pages/lancamentos/contexts/lancamentos/lancamentos.provider'

export function useAtualizacaoCompra() {
	const context = React.useContext(LancamentoContext)
	return context.atualizacao
}
