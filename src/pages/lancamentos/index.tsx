import React from 'react'
import { NextPage } from 'next'
import CadastroCompraProvider from '@contexts/lancamentos/lancamentos.provider'
import ConteudoPrincipal from '@pages/lancamentos/components/ConteudoPrincipal'

const LancamentosPage: NextPage = () => {
	return (
		<CadastroCompraProvider>
			<ConteudoPrincipal />
		</CadastroCompraProvider>
	)
}

export default LancamentosPage
