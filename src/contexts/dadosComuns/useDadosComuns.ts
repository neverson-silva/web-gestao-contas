import React from 'react'
import { DadosComunsContext } from './dadosComuns.provider'

export function useDadosComuns() {
	const context = React.useContext(DadosComunsContext)
	return context
}
