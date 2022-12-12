import React from 'react'
import { CadastroCompraContext } from '@pages/lancamentos/contexts/cadastroCompra/cadastroCompra.provider'

export function useCadastroCompra() {
	const context = React.useContext(CadastroCompraContext)
	return context
}
