import React, { useEffect, useState } from 'react'

import { Line } from '@ant-design/plots'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { MesAnoContextData } from '@contexts/mesAno/mesAno.provider'
import { notification } from 'antd'
import { api } from '@apis/api'
import { DadosGraficoPorPessoa } from '@models/graficoDadosPorPessoa'
import { formatarDinheiro } from '@utils/util'
import { LineConfig } from '@ant-design/plots/es/components/line'

type GastosMensaisPorPessoaLinhaDataset = {
	label: string
	reference: string | number
	value: number
}
const GastosMensaisPorPessoaLinha = ({}) => {
	const [data, setData] = useState<GastosMensaisPorPessoaLinhaDataset[]>([])
	const [coresPessoas, setCoresPessoas] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	const mesAno = useMesAno()

	useEffect(() => {
		if (mesAno?.mes && mesAno?.ano) {
			buscarDadosGrafico(mesAno)
		}
	}, [mesAno])

	const prepararDataSet = (
		dados: DadosGraficoPorPessoa[],
	): GastosMensaisPorPessoaLinhaDataset[] => {
		const cores: string[] = []
		const dataset = dados
			.map((dado) => {
				return [
					...dado.totaisPessoa.map((total) => {
						if (!cores.includes(total.corBackgroud)) {
							cores.push(total.corBackgroud)
						}
						return {
							reference: `${dado.nome}/${dado.anoFechamento}`,
							label: total.nome,
							value: total.total,
						} as GastosMensaisPorPessoaLinhaDataset
					}),
				]
			})
			.flat()
		setCoresPessoas(cores)
		return dataset
	}

	const buscarDadosGrafico = async (pMesAno: MesAnoContextData) => {
		try {
			setLoading(true)
			const { data } = await api.get<DadosGraficoPorPessoa[]>(
				'dashboard/grafico/gastos-por-pessoa',
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
	// const asyncFetch = () => {
	// 	fetch(
	// 		'https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json',
	// 	)
	// 		.then((response) => response.json())
	// 		.then((json) => {
	// 			console.log(json)
	// 			setData(json)
	// 		})
	// 		.catch((error) => {
	// 			console.log('fetch data failed', error)
	// 		})
	// }

	const config: LineConfig = {
		data,
		loading,

		xField: 'reference',
		yField: 'value',
		seriesField: 'label',
		autoFit: true,
		padding: [90, 60, 70, 80],
		color: coresPessoas,
		meta: {
			value: {
				formatter: (value) => formatarDinheiro(value),
			},
		},
		yAxis: {
			label: {
				formatter: (v: any) => {
					return v
				},
			},
		},

		legend: {
			position: 'top',
			maxRow: 3,
			slidable: false,
			itemMarginBottom: 18,
		},
		smooth: true,
		animation: {
			appear: {
				animation: 'path-in',
				duration: 5000,
			},
		},
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return <Line {...config} />
}

export default GastosMensaisPorPessoaLinha
