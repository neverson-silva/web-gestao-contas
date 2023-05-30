import { api } from '@apis/api'
import { FormaPagamento, Pessoa } from '@models/faturaItem'
import { notification, Spin } from 'antd'
import { AxiosError } from 'axios'
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MyComponent from 'react-fullpage-custom-loader'

export type DadosComunsContextData = {
  pessoas: Pessoa[]
  formasPagamentos: FormaPagamento[]
  buscarPessoas: () => Promise<void>
}

export const DadosComunsContext = createContext<DadosComunsContextData>(
  {} as unknown as DadosComunsContextData
)

const sentencas = [
  'O conhecimento serve para encantar as pessoas, não para humilhá-las. \n- Mario Sergio Cortella',
  `“O mundo te respeitará na exata proporção que você não tiver medo dele. Por que tudo é só uma relação de forças…” \n- Clóvis de Barros Filho`,
  `"É um fraco que teme aquele que não é igual e se sente ameaçado por ele." \n- Mario Sergio Cortella`,
  `"Não espere por uma crise para descobrir o que é importante em sua vida." \n- Platão`,
]
const DadosComunsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [formasPagamentos, setFormasPagamentos] = useState<FormaPagamento[]>([])
  const [loading, setLoading] = useState(false)

  const buscarPessoas = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('pessoas')
      setPessoas(data)
    } catch (e) {
      if (e instanceof AxiosError) {
        notification.error({
          message: 'Oops ocorreu um erro',
          description:
            e?.response?.data?.message ??
            'Ocorreu um erro ao buscar as pessoas',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const buscarFormasPagamentos = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('formas-pagamentos')
      setFormasPagamentos(data)
    } catch (e) {
      if (e instanceof AxiosError) {
        notification.error({
          message: 'Oops ocorreu um erro',
          description:
            e?.response?.data?.message ??
            'Ocorreu um erro ao buscar as pessoas',
        })
      }
    } finally {
      setLoading(false)
    }
  }
  const contextData = useMemo(
    () => ({
      pessoas,
      formasPagamentos,
      buscarPessoas,
    }),
    [formasPagamentos, pessoas, buscarPessoas]
  )

  useEffect(() => {
    buscarPessoas().then(() => buscarFormasPagamentos())
  }, [])

  return (
    <DadosComunsContext.Provider value={contextData}>
      {loading && (
        <MyComponent
          customLoader={<Spin size={'large'} tip={'Aguarde...'} />}
          sentences={sentencas}
          style={{
            backgroundColor: '#001529',
          }}
        />
      )}
      {!loading && children}
    </DadosComunsContext.Provider>
  )
}

export default React.memo(DadosComunsProvider)
