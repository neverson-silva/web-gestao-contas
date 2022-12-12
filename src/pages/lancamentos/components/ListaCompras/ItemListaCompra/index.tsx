import { FaturaItem } from '@models/faturaItem'
import React from 'react'
import { Col, Row, Tooltip, Typography } from 'antd'
import { grey } from '@ant-design/colors'
import moment from 'moment/moment'
import { formatarDinheiro } from '@utils/util'

const { Text } = Typography

type ItemListaCompra = {
	compra: FaturaItem
	currentIndex: number
}
const ItemListaCompra: React.FC<ItemListaCompra> = ({
	compra,
	currentIndex,
}) => {
	return (
		<div
			key={currentIndex}
			style={{
				padding: 4,
				paddingRight: 16,
				paddingLeft: 16,
				borderBottom: `1px solid #f0f0f0`,
				backgroundColor: currentIndex % 2 === 0 ? '#F0F0F0' : 'white',
				marginTop: 4,
			}}
		>
			<Row justify={'space-between'}>
				<Col
					xs={18}
					sm={18}
					md={18}
					xl={18}
					xxl={18}
					style={{
						display: 'flex',
						alignContent: 'flex-start',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}
				>
					<Text
						style={{
							fontSize: 12,
							color: grey.primary,
						}}
					>
						{moment(compra.lancamento.dataCompra).format('DD/MM/YYYY')}
					</Text>
				</Col>
				<Col
					xs={6}
					sm={6}
					md={6}
					xl={6}
					xxl={6}
					style={{
						display: 'flex',
						alignContent: 'flex-end',
						justifyContent: 'flex-end',
						alignItems: 'flex-end',
					}}
				>
					<Text
						style={{
							fontSize: 12,
							color: grey.primary,
						}}
					>
						{compra.dividido && compra.itensRelacionados?.length
							? [compra, ...compra.itensRelacionados]
									.map((faturaItem) => faturaItem?.pessoa?.nome)
									.join(', ')
							: compra.pessoa.nome}
					</Text>
				</Col>
			</Row>
			<Row
				justify={'space-between'}
				style={{
					marginTop: 2,
					marginBottom: 2,
				}}
			>
				<Col
					xs={18}
					sm={18}
					md={18}
					xl={18}
					xxl={18}
					style={{
						display: 'flex',
						alignContent: 'flex-start',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}
				>
					<span
						style={{
							fontSize: 16,
							fontWeight: '600',
							wordBreak: 'break-all',
						}}
					>
						{compra.nome}
					</span>
				</Col>
				<Col
					xs={6}
					sm={6}
					md={6}
					xl={6}
					xxl={6}
					style={{
						display: 'flex',
						alignContent: 'flex-end',
						justifyContent: 'flex-end',
						alignItems: 'flex-end',
					}}
				>
					<span
						style={{
							fontSize: 16,
							fontWeight: '600',
							wordBreak: 'break-all',
						}}
					>
						{formatarDinheiro(compra.valorUtilizado)}
					</span>
				</Col>
			</Row>
			<Row
				style={{
					display: 'flex',
				}}
			>
				<Col
					xs={12}
					sm={12}
					md={12}
					xl={12}
					xxl={12}
					style={{
						display: 'flex',
						alignContent: 'flex-start',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}
				>
					<Text
						strong
						style={{
							fontSize: 12,
							color: grey.primary,
						}}
					>
						{compra.formaPagamento?.nome}
					</Text>
				</Col>
				<Col
					xs={12}
					sm={12}
					md={12}
					xl={12}
					xxl={12}
					style={{
						display: 'flex',
						alignContent: 'flex-end',
						justifyContent: 'flex-end',
						alignItems: 'flex-end',
					}}
				>
					<Text
						style={{
							fontSize: 12,
							color: grey.primary,
						}}
					>
						{compra.parcelado
							? `em ${compra.lancamento.quantidadeParcelas} vezes`
							: 'à vista'}
					</Text>
				</Col>
			</Row>
			{/*<Row style={{}}>*/}
			{/*	<Col sm={24}>*/}
			{/*<Row style={{ marginBottom: 2 }}>*/}
			{/*	<Col span={6}>*/}
			{/*		<Text*/}
			{/*			style={{*/}
			{/*				fontSize: 12,*/}
			{/*				color: grey.primary,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{moment(compra.lancamento.dataCompra).format('DD/MM/YYYY')}*/}
			{/*		</Text>*/}
			{/*	</Col>*/}
			{/*	<Col*/}
			{/*		style={{*/}
			{/*			flex: 1,*/}
			{/*			alignItems: 'flex-end',*/}
			{/*			justifyContent: 'flex-end',*/}
			{/*			flexDirection: 'row',*/}
			{/*			textAlign: 'right',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<Text*/}
			{/*			style={{*/}
			{/*				fontSize: 12,*/}
			{/*				color: grey.primary,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{compra.dividido && compra.itensRelacionados?.length*/}
			{/*				? [compra, ...compra.itensRelacionados]*/}
			{/*						.map((faturaItem) => faturaItem?.pessoa?.nome)*/}
			{/*						.join(', ')*/}
			{/*				: compra.pessoa.nome}*/}
			{/*		</Text>*/}
			{/*	</Col>*/}
			{/*</Row>*/}
			{/*<Row>*/}
			{/*	<Col span={16}>*/}
			{/*		<Typography.Title*/}
			{/*			style={{*/}
			{/*				fontWeight: '600',*/}
			{/*				fontSize: 16,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{compra.nome}*/}
			{/*		</Typography.Title>*/}
			{/*	</Col>*/}

			{/*	<Col*/}
			{/*		style={{*/}
			{/*			flex: 1,*/}
			{/*			alignItems: 'flex-end',*/}
			{/*			justifyContent: 'flex-end',*/}
			{/*			flexDirection: 'row',*/}
			{/*			textAlign: 'right',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<Typography.Title*/}
			{/*			style={{*/}
			{/*				fontSize: 16,*/}
			{/*				marginLeft: '27%',*/}
			{/*				fontWeight: '600',*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{formatarDinheiro(compra.valorUtilizado)}*/}
			{/*		</Typography.Title>*/}
			{/*	</Col>*/}
			{/*</Row>*/}
			{/*<Row>*/}
			{/*	<Col span={19}>*/}
			{/*		<Text*/}
			{/*			strong*/}
			{/*			style={{*/}
			{/*				fontSize: 12,*/}
			{/*				color: grey.primary,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{compra.formaPagamento?.nome}*/}
			{/*		</Text>*/}
			{/*	</Col>*/}
			{/*	<Col*/}
			{/*		style={{*/}
			{/*			flex: 1,*/}
			{/*			alignItems: 'flex-end',*/}
			{/*			justifyContent: 'flex-end',*/}
			{/*			flexDirection: 'row',*/}
			{/*			textAlign: 'right',*/}
			{/*		}}*/}
			{/*	>*/}
			{/*		<Text*/}
			{/*			style={{*/}
			{/*				fontSize: 12,*/}
			{/*				color: grey.primary,*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			{compra.parcelado*/}
			{/*				? `em ${compra.lancamento.quantidadeParcelas} vezes`*/}
			{/*				: 'à vista'}*/}
			{/*		</Text>*/}
			{/*	</Col>*/}
			{/*</Row>*/}
			{/*	</Col>*/}
			{/*</Row>*/}
		</div>
	)
}

export default ItemListaCompra
