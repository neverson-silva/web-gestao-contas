import React, { useEffect, useState } from 'react'
import { ComponentParamsWithSettings } from '@contexts/modal/modal.provider'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import {
	Avatar,
	Col,
	Divider,
	notification,
	Row,
	Skeleton,
	Table,
	Tag,
	Typography,
} from 'antd'
import { api } from '@pages/api/api'
import { IPagination, Page } from '@models/pagination'
import { FaturaItem, Pessoa } from '@models/faturaItem'
import { beautyNumber, delay, formatarDinheiro, isCartao } from '@utils/util'
import moment from 'moment'
import { ColumnsType } from 'antd/lib/table'
import { grey } from '@ant-design/colors'

const { Text } = Typography

export interface DetalhesFaturaPessoaProps extends ComponentParamsWithSettings {
	idPessoa: number
	valorTotal: number
	valorMesAnterior: number
}

const DetalhesFaturaPessoa: React.FC<DetalhesFaturaPessoaProps> = ({
	idPessoa,
	valorTotal,
	valorMesAnterior,
}) => {
	const { mes, ano } = useMesAno()
	const [loading, setLoading] = useState(false)
	const [lancamentos, setLancamentos] = useState<FaturaItem[]>([])
	const [pessoa, setPessoa] = useState<Pessoa | undefined>()
	const [pager, setPager] = useState<IPagination>({
		current: 1,
		pageSize: 10,
	})
	const buscarFaturaPessoa = async (
		pIdPessoa: number,
		page?: number,
		size?: number,
	) => {
		try {
			setLoading(true)
			await delay(1000)
			const { data } = await api.get<Page<FaturaItem>>(
				'faturas/buscar-itens-fatura',
				{
					params: {
						idPessoa: pIdPessoa,
						page: page ?? pager?.current,
						linesPerPage: size ?? pager?.pageSize,
						mes: mes,
						ano: ano,
					},
				},
			)
			setLancamentos(data.content)
			if (data.totalElements) {
				setPessoa(data.content[0].pessoa)
			}
			setPager({
				current: data.number + 1,
				pageSize: data.size,
				total: data.totalElements,
			})
		} catch (e) {
			setLancamentos([])
			console.log(e)
			notification.error({
				description: 'Ocorreu um erro',
				message: 'Tente novamente mais tarde',
			})
		} finally {
			setLoading(false)
		}
	}

	const getNomeLancamento = (faturaItem: FaturaItem) => {
		if (faturaItem.parcelado) {
			return `${faturaItem.nome} - ${beautyNumber(
				faturaItem.parcela?.numero,
			)}/${beautyNumber(faturaItem.lancamento.quantidadeParcelas)}`
		}
		return faturaItem.lancamento.nome
	}

	const colunas: ColumnsType<FaturaItem> = [
		{
			title: 'Data',
			render: (text, record) =>
				moment(record.lancamento.dataCompra).format('DD/MM/YYYY'),
			dataIndex: '1',
		},
		{
			title: 'Compra',
			render: (_, record) => getNomeLancamento(record),
		},
		{
			title: 'Valor',
			render: (_, record) => formatarDinheiro(record.valorUtilizado),
		},
		{
			title: 'Forma de Pagamento',
			align: 'center',
			render: (_, { formaPagamento, pessoa }) => (
				<Tag color={'green'}>
					{pessoa.id == 8 || !isCartao(formaPagamento)
						? formaPagamento.nome
						: 'Cartão'}
				</Tag>
			),
		},
	]

	useEffect(() => {
		if (mes && ano) {
			buscarFaturaPessoa(idPessoa)
		}
	}, [mes, ano, idPessoa])

	return (
		<>
			{loading && <Skeleton loading={loading} />}
			{!loading && (
				<>
					<Row style={{}}>
						<Col
							xs={3}
							style={{
								marginRight: 0,
								display: 'flex',
								justifyContent: 'flex-start',
								alignContent: 'flex-start',
								alignItems: 'flex-start',
							}}
						>
							<Avatar src={pessoa?.perfil} size={80} />
						</Col>
						<Col
							xs={20}
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
								alignContent: 'flex-start',
								alignItems: 'flex-start',
							}}
						>
							<Row
								style={{
									marginLeft: 32,
								}}
							>
								<Col xs={24}>
									<Typography.Text
										strong
										style={{ color: 'black', fontSize: 14 }}
									>
										{pessoa?.nome.toUpperCase()}{' '}
										{pessoa?.sobrenome.toUpperCase()}
									</Typography.Text>
								</Col>
								<Col xs={24}>
									<Typography.Text strong style={{ color: 'black' }}>
										Total a pagar: {formatarDinheiro(valorTotal)}
									</Typography.Text>
								</Col>
								<Col xs={24}>
									<Typography.Text style={{ color: grey.primary }}>
										Mês anterior: {formatarDinheiro(valorMesAnterior)}
									</Typography.Text>
								</Col>
							</Row>
						</Col>
					</Row>
					<Divider
						type={'horizontal'}
						style={{
							border: '2px solid rgba(0, 0, 0, 0.06)',
						}}
					/>

					<Row>
						<Col xs={24}>
							<Table
								size={'small'}
								dataSource={lancamentos}
								pagination={{
									...pager,
									showSizeChanger: true,
									showQuickJumper: true,
								}}
								columns={colunas}
								onChange={({ pageSize, current }) =>
									buscarFaturaPessoa(idPessoa, current, pageSize)
								}
							/>
						</Col>
					</Row>
				</>
			)}
		</>
	)
}
export default DetalhesFaturaPessoa
