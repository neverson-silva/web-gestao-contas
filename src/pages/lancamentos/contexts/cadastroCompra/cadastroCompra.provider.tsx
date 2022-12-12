import { FormaPagamento, Pessoa } from '@models/faturaItem'
import { Moment } from 'moment/moment'
import { Form, FormInstance, notification } from 'antd'
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import { converterDinheiroEmFloat } from '@utils/util'

export type PessoaDivisaoDiferenteForm = {
	id: number
	nome: string
	valor: number
}

export type CadastroFormValues = {
	nome: string
	valor: string | number
	formaPagamento: FormaPagamento
	idPessoa: number[]
	pessoasDivididoIgualmente?: Pessoa[]
	pessoasDivididoDiferente?: PessoaDivisaoDiferenteForm[]
	dataCompra: Moment | Date
	idMes: number
	descricao?: string
	parcelado?: boolean
	quantidadeParcelas?: number
	valorPorParcela?: string
}

export type CadastroCompraContextData = {
	form: FormInstance<CadastroFormValues>
	formDivisaoDiferente: FormInstance<any>
	parcelado: boolean
	isDivididoDiferente: boolean

	setParcelado: React.Dispatch<React.SetStateAction<boolean>>
	setIsDivididoDiferente: React.Dispatch<React.SetStateAction<boolean>>

	adicionarPessoa: (idPessoa: number, valor?: number) => void
	alterarValorPessoa: (idPessoa: number, valor: number) => void
	pessoasDiferente: PessoaDivisaoDiferenteForm[]
	setPessoasDiferentes: React.Dispatch<
		React.SetStateAction<PessoaDivisaoDiferenteForm[]>
	>

	limparPessoasDiferente: () => void
	limparTudo: () => void
	limparFormularios: () => void

	reinicializarPessoasDiferente: () => void
}

export const CadastroCompraContext = createContext<CadastroCompraContextData>(
	{} as unknown as CadastroCompraContextData,
)

const CadastroCompraProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [pessoasDivididoDiferente, setPessoasDivididoDiferente] = useState<
		PessoaDivisaoDiferenteForm[]
	>([])
	const [form] = Form.useForm<CadastroFormValues>()
	const [formDivisaoDiferente] = Form.useForm()

	const { pessoas } = useDadosComuns()
	const [parcelado, setParcelado] = useState(false)
	const [isDivididoDiferente, setIsDivididoDiferente] = useState(false)

	const adicionarPessoa = (idPessoa: number, valor?: number) => {
		const pessoa = pessoas.find((pessoa) => pessoa.id === idPessoa)!

		setPessoasDivididoDiferente([
			...pessoasDivididoDiferente,
			{ id: pessoa.id, valor: valor ?? 0, nome: pessoa.nome },
		])
	}

	const alterarValorPessoa = (idPessoa: number, valor: number) => {
		const indexOfPessoa = pessoasDivididoDiferente.findIndex(
			(pessoaDif) => pessoaDif.id === idPessoa,
		)
		if (indexOfPessoa >= 0) {
			const valorTotalAteAgora = pessoasDivididoDiferente.reduce(
				(acc, pess) => acc + pess.valor,
				0,
			)

			if (
				valorTotalAteAgora + valor >
				converterDinheiroEmFloat(form.getFieldValue('valor'))
			) {
				notification.error({
					message: 'Maluco passou',
					description: 'Presta atenção nos valores',
				})
			}

			const newPessoas = [...pessoasDivididoDiferente]
			newPessoas[indexOfPessoa].valor = valor
			setPessoasDivididoDiferente(newPessoas)
		} else {
			adicionarPessoa(idPessoa, valor)
		}
	}
	const limparPessoasDiferente = () => {
		setPessoasDivididoDiferente([])
	}

	const limparFormularios = () => {
		form.resetFields()
		formDivisaoDiferente.resetFields()
	}

	const reinicializarPessoasDiferente = () => {
		formDivisaoDiferente.resetFields()
		limparPessoasDiferente()
		form.setFieldsValue({
			pessoasDivididoDiferente: [],
		})
		setIsDivididoDiferente(false)
	}

	const limparTudo = () => {
		limparFormularios()
		setParcelado(false)
		reinicializarPessoasDiferente()
	}

	const contextData = useMemo(
		() => ({
			formDivisaoDiferente,
			form,
			alterarValorPessoa,
			adicionarPessoa,
			parcelado,
			setParcelado,
			isDivididoDiferente,
			setIsDivididoDiferente,
			limparPessoasDiferente,
			limparFormularios,
			limparTudo,
			pessoasDiferente: pessoasDivididoDiferente,
			setPessoasDiferentes: setPessoasDivididoDiferente,
			reinicializarPessoasDiferente,
		}),
		[
			form,
			formDivisaoDiferente,
			adicionarPessoa,
			alterarValorPessoa,
			parcelado,
			setParcelado,
			isDivididoDiferente,
			setIsDivididoDiferente,
			limparPessoasDiferente,
			limparFormularios,
			limparTudo,
			pessoasDivididoDiferente,
			setPessoasDivididoDiferente,
			reinicializarPessoasDiferente,
		],
	)

	useEffect(() => {
		if (!isDivididoDiferente) {
			reinicializarPessoasDiferente()
		}
	}, [isDivididoDiferente])
	return (
		<CadastroCompraContext.Provider value={contextData}>
			{children}
		</CadastroCompraContext.Provider>
	)
}

export default React.memo(CadastroCompraProvider)
