import { NextPage } from 'next'
import Head from '@components/Head'
import CabecalhoFatura from '@pages/faturas/components/CabecalhoFatura'

const FaturasPage: NextPage = () => {
	return (
		<>
			<Head title={'Faturas'} />
			<CabecalhoFatura />
		</>
	)
}

export default FaturasPage
