import React from 'react'
import { NextPage } from 'next'
import CadastroCompraProvider from '@pages/lancamentos/contexts/cadastroCompra/cadastroCompra.provider'
import ConteudoPrincipal from '@pages/lancamentos/components/ConteudoPrincipal'

const LancamentosPage: NextPage = () => {
	return (
		<CadastroCompraProvider>
			<ConteudoPrincipal />
		</CadastroCompraProvider>
	)
}

export default LancamentosPage
