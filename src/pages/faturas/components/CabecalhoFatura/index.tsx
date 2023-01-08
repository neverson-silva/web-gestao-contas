import React, { useEffect, useMemo, useState } from 'react'
import Bloco from '@components/Bloco'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { FormaPagamento } from '@models/faturaItem'
import { Button, Col, Form, notification, Row, Select, Typography } from 'antd'
import { DatePicker } from '@components/Time/Calendars'
import moment from 'moment/moment'
import Linha from '@components/Linha'
import Coluna from '@components/Coluna'
import { Moment } from 'moment'
import { api } from '@apis/api'
import { useAuth } from '@contexts/auth/useAuth'

const CabecalhoFatura: React.FC = () => {
	const { mes, ano, mesAnoAtual, toMoment, beautifyDate, alterarData } =
		useMesAno()
	const [form] = Form.useForm()

	const { isAdmin } = useAuth()
	const [loadingBuscandoFormasPagamentos, setLoadingBuscandoFormasPagamentos] =
		useState(false)
	const [loadingBuscandoItems, setLoadingBuscandoItems] = useState(false)
	const [loadingFechandoFatura, setLoadingFechandoFatura] = useState(false)
	const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] = useState<
		FormaPagamento | null | undefined
	>()
	const [formasPagamentos, setFormasPagamentos] = useState<FormaPagamento[]>([])

	const defaultValueCalendar = useMemo(() => {
		if (mes && ano) {
			return moment(`${ano}-${mes}-01`)
		}
		return moment()
	}, [mes, ano])

	const formasPagamentosOptions = formasPagamentos.map(
		(formaPagamento: FormaPagamento) => {
			return {
				value: formaPagamento.id,
				label: formaPagamento.nome,
			}
		},
	)

	const buscarFormasPagamentosComCompras = async (pData: Moment | Date) => {
		if (pData) {
			const dataBusca = moment(pData)

			try {
				setLoadingBuscandoFormasPagamentos(true)
				const { data } = await api.get<FormaPagamento[]>(
					'formas-pagamentos/buscar-com-compras',
					{
						params: {
							mesReferencia: dataBusca.month() + 1,
							anoReferencia: dataBusca.year(),
						},
					},
				)
				setFormasPagamentos(data ?? [])
			} catch (e) {
				setFormasPagamentos([])
				notification.error({
					message: 'Ocorreu um erro',
					description: 'Tente novamente mais tarde',
				})
			} finally {
				setLoadingBuscandoFormasPagamentos(false)
			}
		}
	}

	useEffect(() => {
		if (mes && ano) {
			buscarFormasPagamentosComCompras(toMoment()!)
		}
	}, [])

	return (
		<Bloco>
			<Linha gutter={[0, 0]}>
				<Coluna flex={1} flexBasis={'60%'}>
					<Typography.Title level={5}>{beautifyDate()}</Typography.Title>
				</Coluna>
				<Coluna flex={1} flexBasis={'40%'}>
					<Linha
						gutter={[16, 16]}
						style={{
							height: 40,
						}}
					>
						<Form
							form={form}
							layout={'horizontal'}
							style={{
								width: '100%',
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<Coluna flexBasis={'40%'}>
								<Form.Item
									name={'formaPagamentoId'}
									rules={[
										{
											required: true,
											message: 'Forma de pagamento não selecionada',
										},
									]}
								>
									<Select
										options={formasPagamentosOptions}
										allowClear
										placeholder={'Forma de pagamento'}
									/>
								</Form.Item>
							</Coluna>
							<Coluna flexBasis={'30%'}>
								<DatePicker
									picker="month"
									format={'MMMM/YYYY'}
									allowClear={false}
									placeholder={'Selecione um mês'}
									defaultValue={defaultValueCalendar}
									style={{
										width: '100%',
									}}
									onChange={(date) => {
										if (date) {
											alterarData(date.month() + 1, date.year())
											buscarFormasPagamentosComCompras(
												moment(`${date.year()}-${date.month() + 1}-01`),
											)
										}
										return
									}}
								/>
							</Coluna>
							<Coluna flexBasis={'10%'}>
								<Button
									htmlType={'submit'}
									type={'primary'}
									disabled={
										loadingFechandoFatura || loadingBuscandoFormasPagamentos
									}
									loading={loadingBuscandoItems}
								>
									Buscar
								</Button>
							</Coluna>

							{isAdmin && (
								<Coluna flexBasis={'10%'}>
									<Button loading={loadingFechandoFatura}>Fechar fatura</Button>
								</Coluna>
							)}
						</Form>
					</Linha>
				</Coluna>
			</Linha>
		</Bloco>
	)
	return (
		<Bloco>
			<Form form={form} layout={'vertical'}>
				<Row justify={'end'}>
					<Col
						xs={12}
						style={{
							backgroundColor: 'yellow',
						}}
					>
						<Typography.Title level={5}>{beautifyDate()}</Typography.Title>
					</Col>
					<Col
						xs={12}
						style={{
							backgroundColor: 'green',
						}}
					>
						<Row gutter={[16, 16]}>
							<Col xs={8}>
								<Form.Item name={'formaPagamentoId'}>
									<Select
										options={formasPagamentosOptions}
										allowClear
										placeholder={'Forma de pagamento'}
									/>
								</Form.Item>
							</Col>
							<Col xs={12}>
								<DatePicker
									picker="month"
									format={'MMMM/YYYY'}
									allowClear={false}
									placeholder={'Selecione um mês'}
									defaultValue={defaultValueCalendar}
									onChange={(date) => {
										if (date) {
											alterarData(date.month() + 1, date.year())
										}
										return
									}}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Bloco>
	)
}

export default CabecalhoFatura
