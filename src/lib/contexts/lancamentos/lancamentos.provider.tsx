import { FaturaItem, Pessoa } from '@models/faturaItem'
import { Moment } from 'moment/moment'
import { Form, FormInstance, notification } from 'antd'
import React, {
	createContext,
	PropsWithChildren,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import { converterDinheiroEmFloat, delay } from '@utils/util'
import { IPagination, Page } from '@models/pagination'
import { api } from '@apis/api'
import { useMesAno } from '@contexts/mesAno/useMesAno'

export type PessoaDivisaoDiferenteForm = {
	id: number
	nome: string
	valor: number
}

export type CadastroFormValues = {
	nome: string
	valor: string | number
	formaPagamento: number
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

export type AtualizacaoCompraContextData = CadastroCompraContextData
export type BuscaLancamentosContextData = {
	pager: IPagination
	setPager: React.Dispatch<React.SetStateAction<IPagination>>
	lancamentos: FaturaItem[]
	formBusca: FormInstance<any>
	loadingBusca: boolean
	buscarLancamentosAtual: (params?: {
		page?: number
		size?: number
		reset?: boolean
		loadingMore?: boolean
	}) => Promise<void>
}
export type LancamentosContextData = {
	cadastro: CadastroCompraContextData
	busca: BuscaLancamentosContextData
	atualizacao: AtualizacaoCompraContextData
}
export const LancamentoContext = createContext<LancamentosContextData>(
	{} as unknown as LancamentosContextData,
)

const LancamentosProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
					message: 'Limite para divisão atingido',
					description:
						'Valor dividido é superior ao valor total da compra verifique!',
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

	/// search

	const [loadingBusca, setLoadingBusca] = useState(false)
	const { mesAnoAtual } = useMesAno()
	const [pager, setPager] = useState<IPagination>({
		current: 1,
		pageSize: 10,
		total: 0,
		hasNext: false,
	})
	const [lancamentos, setLancamentos] = useState<FaturaItem[]>([])
	const [formBusca] = Form.useForm()
	const buscarLancamentosAtual = async (params?: {
		page?: number
		size?: number
		reset?: boolean
		loadingMore?: boolean
	}) => {
		try {
			setLoadingBusca(true)
			await delay(200)
			const page = params?.reset ? 1 : params?.page ?? pager.current
			const size = params?.size ?? pager.pageSize

			const { data } = await api.get<Page<FaturaItem>>(
				'faturas/buscar-itens-fatura',
				{
					params: {
						page: page,
						linesPerPage: size,
						mes: mesAnoAtual.mes,
						ano: mesAnoAtual.ano,
						searchKey: formBusca.getFieldValue('search'),
					},
				},
			)
			if (params?.loadingMore) {
				setLancamentos((old) => [...old, ...data.content])
			} else {
				setLancamentos(data.content)
			}

			setPager({
				current: data.number + 1,
				pageSize: data.size,
				total: data.totalElements,
				hasNext: !data.last,
			})
		} catch (err) {
			notification.error({
				message: 'Oops Ocorreu um erro',
				description:
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					err?.response?.data?.message ??
					'Não foi possível buscar os lançamentos neste momento',
			})
		} finally {
			setLoadingBusca(false)
		}
	}

	const cadastroData = useMemo(
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
	const buscaData = useMemo(
		() => ({
			pager,
			setPager,
			lancamentos,
			loadingBusca,
			buscarLancamentosAtual,
			formBusca,
		}),
		[
			pager,
			setPager,
			lancamentos,
			loadingBusca,
			buscarLancamentosAtual,
			formBusca,
		],
	)

	useEffect(() => {
		if (!isDivididoDiferente) {
			reinicializarPessoasDiferente()
		}
	}, [isDivididoDiferente])

	return (
		<LancamentoContext.Provider
			value={{
				cadastro: cadastroData,
				atualizacao: cadastroData,
				busca: buscaData,
			}}
		>
			{children}
		</LancamentoContext.Provider>
	)
}

export default React.memo(LancamentosProvider)
