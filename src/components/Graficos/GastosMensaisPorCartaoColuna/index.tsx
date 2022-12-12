import React, { useEffect, useState } from 'react'

import { Column } from '@ant-design/plots'
import { MesAnoContextData } from '@contexts/mesAno/mesAno.provider'
import { delay, formatarDinheiro } from '@utils/util'
import { api } from '@pages/api/api'
import { notification } from 'antd'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { GraficoDadosPorFormaPagamento } from '@models/graficoDadosPorFormaPagamento'
import { ColumnConfig } from '@ant-design/plots/es/components/column'

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

	const buscarDadosGraficoFormaPagamento = async (
		pMesAno: MesAnoContextData,
	) => {
		try {
			setLoading(true)
			await delay(400)
			const { data } = await api.get<GraficoDadosPorFormaPagamento[]>(
				'dashboard/grafico/gastos-por-cartao',
				{
					params: {
						mesReferencia: pMesAno?.mes,
						anoReferencia: pMesAno?.ano,
					},
				},
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
		dados: GraficoDadosPorFormaPagamento[],
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
		if (mesAno?.mes && mesAno?.ano) {
			buscarDadosGraficoFormaPagamento(mesAno)
		}
	}, [mesAno])

	return <Column {...config} />
}

export default GastosMensaisPorCartaoColuna
