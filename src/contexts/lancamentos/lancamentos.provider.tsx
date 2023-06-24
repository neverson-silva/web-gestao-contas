/* eslint-disable react-hooks/exhaustive-deps */
import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { usePagination } from '@hooks/usePagination'
import { FaturaItem, Pessoa } from '@models/faturaItem'
import { IPagination } from '@models/pagination'
import { converterDinheiroEmFloat } from '@utils/util'
import { Form, FormInstance, notification } from 'antd'
import { Moment } from 'moment/moment'
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'

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
  lancamentos: FaturaItem[]
  formBusca: FormInstance<any>
  loadingBusca: boolean
  addStart: (faturaItem: FaturaItem) => void
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
  {} as unknown as LancamentosContextData
)

export const LancamentosProvider: React.FC<PropsWithChildren> = React.memo(
  ({ children }) => {
    const [pessoasDivididoDiferente, setPessoasDivididoDiferente] = useState<
      PessoaDivisaoDiferenteForm[]
    >([])
    const [form] = Form.useForm<CadastroFormValues>()
    const [formDivisaoDiferente] = Form.useForm()

    const { pessoas } = useDadosComuns()
    const [parcelado, setParcelado] = useState(false)
    const [isDivididoDiferente, setIsDivididoDiferente] = useState(false)

    const {
      loading: loadingBusca,
      pager,
      setPage: fetchData,
      errorMessage,
      data,
      error,
      addToStart: addStart,
    } = usePagination({
      url: 'faturas/buscar-itens-fatura',
    })

    const adicionarPessoa = (idPessoa: number, valor?: number) => {
      const pessoa = pessoas.find((pessoa) => pessoa.id === idPessoa)!

      setPessoasDivididoDiferente([
        ...pessoasDivididoDiferente,
        { id: pessoa.id, valor: valor ?? 0, nome: pessoa.nome },
      ])
    }

    const alterarValorPessoa = (idPessoa: number, valor: number) => {
      const indexOfPessoa = pessoasDivididoDiferente.findIndex(
        (pessoaDif) => pessoaDif.id === idPessoa
      )
      if (indexOfPessoa >= 0) {
        const valorTotalAteAgora = pessoasDivididoDiferente.reduce(
          (acc, pess) => acc + pess.valor,
          0
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

    const { mesAnoAtual } = useMesAno()

    const lancamentos = useMemo(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      () => data?.itens?.content ?? data?.content,
      [data]
    )

    const [formBusca] = Form.useForm()
    const buscarLancamentosAtual = async (params?: {
      page?: number
      size?: number
      reset?: boolean
      loadingMore?: boolean
    }) => {
      const search = formBusca.getFieldsValue(true)?.search

      await fetchData({
        page: params?.page ?? pager.current,
        reset: params?.reset,
        itemsPerPage: params?.size ?? pager.pageSize,
        isInfinite: params?.loadingMore,
        params: {
          mes: mesAnoAtual.mes,
          ano: mesAnoAtual.ano,
          searchKey: search,
        },
        defaultErrorMessage:
          'Não foi possível buscar os lançamentos neste momento',
      })
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
      ]
    )
    const buscaData = useMemo(
      () => ({
        pager,
        lancamentos,
        loadingBusca,
        buscarLancamentosAtual,
        formBusca,
        addStart,
      }),
      [pager, loadingBusca, buscarLancamentosAtual, formBusca]
    )

    useEffect(() => {
      if (!isDivididoDiferente) {
        reinicializarPessoasDiferente()
      }
    }, [isDivididoDiferente])

    useEffect(() => {
      if (error) {
        notification.error({
          message: 'Oops Ocorreu um erro',
          description: errorMessage,
        })
      }
    }, [errorMessage, error])

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
)
