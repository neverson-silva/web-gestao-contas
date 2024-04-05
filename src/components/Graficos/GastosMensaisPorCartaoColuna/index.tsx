import { Column } from '@ant-design/plots'
import { ColumnConfig } from '@ant-design/plots/es/components/column'
import { useAuth } from '@contexts/auth/useAuth'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { useRequest } from '@hooks/useRequest'
import { GraficoDadosPorFormaPagamento } from '@models/graficoDadosPorFormaPagamento'
import { formatarDinheiro } from '@utils/util'
import { notification } from 'antd'
import { useEffect, useState } from 'react'

type GastosMensaisPorCartaoColunaDataset = {
  label: string
  reference: string | number
  value: number
}

const GastosMensaisPorCartaoColuna = () => {
  const [data, setData] = useState<GastosMensaisPorCartaoColunaDataset[]>([])
  const [coresCartoes, setCoresCartoes] = useState<string[]>([])

  const mesAno = useMesAno()
  const { isAuthenticated } = useAuth()

  const { loading, error, fetch } = useRequest<GraficoDadosPorFormaPagamento[]>(
    {
      url: 'dashboard/grafico/gastos-por-cartao',
      method: 'get',
      onFetchFinished: (dados) => {
                const dataset = prepararDataSet(dados)
        setData(dataset)
      },
    }
  )

  const config: ColumnConfig = {
    data,
    loading,
    xField: 'reference',
    yField: 'value',
    seriesField: 'label',
    autoFit: true,
    // padding: 80,
    padding: [90, 60, 70, 80],
    color: coresCartoes,
    isGroup: true,
    meta: {
      value: {
        formatter: (value: any) => formatarDinheiro(value),
      },
    },
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
  } as ColumnConfig

  const prepararDataSet = (
    dados: GraficoDadosPorFormaPagamento[]
  ): GastosMensaisPorCartaoColunaDataset[] => {
          const cores: string[] = []
      const dataset = dados
        .map((dado) => {
          return [
            ...dado.totaisFormaPagamento.map((total) => {
              if (!cores.includes(total.corFormaPagamento)) {
                cores.push(total.corFormaPagamento ?? 'black')
              }
  
              return {
                reference: `${dado.nome}/${dado.anoFechamento}`,
                label: total.nomeFormaPagamento,
                value: total.valorTotal,
              } as GastosMensaisPorCartaoColunaDataset
            }),
          ]
        })
        .flat()
              setCoresCartoes(cores)
      return dataset
      }

  useEffect(() => {
    if (mesAno?.mes && mesAno?.ano && isAuthenticated) {
      fetch({
        mesReferencia: mesAno?.mes,
        anoReferencia: mesAno?.ano,
      })
    }
  }, [mesAno, isAuthenticated])

  useEffect(() => {
    if (error) {
      notification.error({
        description: 'Ocorreu um erro ao buscar os dados',
        message: 'Tente novamente mais tade',
      })
    }
  }, [error])

  return <Column {...config} />
}

export default GastosMensaisPorCartaoColuna
