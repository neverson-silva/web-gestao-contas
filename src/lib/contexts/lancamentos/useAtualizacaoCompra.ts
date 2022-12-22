import React from 'react'
import { LancamentoContext } from './lancamentos.provider'

export function useAtualizacaoCompra() {
	const context = React.useContext(LancamentoContext)
	return context.atualizacao
}
