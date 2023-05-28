import { useEffect, useState } from 'react'

import { Column } from '@ant-design/plots'
import { ColumnConfig } from '@ant-design/plots/es/components/column'
import { api } from '@apis/api'
import { useAuth } from '@contexts/auth/useAuth'
import { MesAnoContextData } from '@contexts/mesAno/mesAno.provider'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { GraficoDadosPorFormaPagamento } from '@models/graficoDadosPorFormaPagamento'
import { formatarDinheiro } from '@utils/util'
import { notification } from 'antd'

type GastosMensaisPorCartaoColunaDataset = {
  label: string
  reference: string | number
  value: number
}

const GastosMensaisPorCartaoColuna = () => {
  const [data, setData] = useState<GastosMensaisPorCartaoColunaDataset[]>([])
  const [coresCartoes, setCoresCartoes] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const mesAno = useMesAno()
  const { isAuthenticated } = useAuth()
  const buscarDadosGraficoFormaPagamento = async (
    pMesAno: MesAnoContextData
  ) => {
    try {
      setLoading(true)
      const { data } = await api.get<GraficoDadosPorFormaPagamento[]>(
        'dashboard/grafico/gastos-por-cartao',
        {
          params: {
            mesReferencia: pMesAno?.mes,
            anoReferencia: pMesAno?.ano,
          },
        }
      )
      const dataset = prepararDataSet(data)
      setData(dataset)
    } catch (e) {
      notification.error({
        description: 'Ocorreu um erro ao buscar os dados',
        message: 'Tente novamente mais tade',
      })
    } finally {
      setLoading(false)
    }
  }
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
              cores.push(total.corFormaPagamento)
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
      buscarDadosGraficoFormaPagamento(mesAno)
    }
  }, [mesAno, isAuthenticated])

  return <Column {...config} />
}

export default GastosMensaisPorCartaoColuna
