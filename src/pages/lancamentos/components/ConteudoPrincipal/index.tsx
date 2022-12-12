import React, { useEffect, useMemo, useState } from 'react'
import Head from '@components/Head'
import {
	Button,
	FloatButton,
	Form,
	notification,
	Row,
	Skeleton,
	Typography,
} from 'antd'
import { FaturaItem } from '@models/faturaItem'
import { api } from '@pages/api/api'
import { IPagination, Page } from '@models/pagination'
import Bloco from '@components/Bloco'
import moment from 'moment'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import Cabecalho from '@pages/lancamentos/components/Cabecalho'
import { delay } from '@utils/util'
import ListaCompras from '@pages/lancamentos/components/ListaCompras'
import { useRouter } from 'next/router'
import CadastroLancamento from '@pages/lancamentos/components/CadastroLancamento'

const { BackTop } = FloatButton

const ConteudoPrincipal: React.FC = () => {
	const router = useRouter()

	const [pager, setPager] = useState<IPagination>({
		current: 1,
		pageSize: 10,
		total: 0,
		hasNext: false,
	})
	const [lancamentos, setLancamentos] = useState<FaturaItem[]>([])
	const [loading, setLoading] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)

	const { mesAnoAtual } = useMesAno()
	const [form] = Form.useForm()
	const dataFatura = useMemo(() => {
		return moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`).format(
			'MMMM, YYYY',
		)
	}, [mesAnoAtual])

	const [openCadastro, setOpenCadastro] = useState(false)
	const handleCreateNew = () => {
		setOpenCadastro(true)
	}
	const buscarLancamentosAtual = async (params?: {
		page?: number
		size?: number
		reset?: boolean
		loadingMore?: boolean
	}) => {
		try {
			setLoading(true)
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
						searchKey: form.getFieldValue('search'),
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
			setLoading(false)
		}
	}

	const buscarProximaPagina = async () => {
		setLoadingMore(true)
		await buscarLancamentosAtual({
			page: pager.current + 1,
			size: pager.pageSize,
			loadingMore: true,
		})
		setLoadingMore(false)
	}

	const loadMore = pager.hasNext ? (
		<>
			{loadingMore && <Skeleton loading={loadingMore} />}
			{!loadingMore && (
				<div
					style={{
						textAlign: 'center',
						marginTop: 12,
						height: 32,
						lineHeight: '32px',
					}}
				>
					<Button onClick={buscarProximaPagina} type={'link'}>
						buscar mais
					</Button>
				</div>
			)}
		</>
	) : null

	useEffect(() => {
		if (mesAnoAtual.mes && mesAnoAtual.ano) {
			buscarLancamentosAtual()
		}
	}, [mesAnoAtual])

	useEffect(() => {
		if (router.query.compra) {
			form.setFieldsValue({
				search: router.query.compra,
			})
		}
	}, [router.query])

	return (
		<>
			<Head
				title={'Lançamentos'}
				description={'Compras, lançamentos no cartão, despesas'}
			/>
			<Cabecalho
				onCreateNew={handleCreateNew}
				onSearch={() =>
					buscarLancamentosAtual({
						reset: true,
					})
				}
				form={form}
				loading={loading}
			/>
			{loading && !loadingMore && (
				<Bloco>
					<Skeleton loading={loading} />
				</Bloco>
			)}
			{(!loading || loadingMore) && (
				<>
					<Row>
						<Typography.Title level={4}>{dataFatura}</Typography.Title>
					</Row>
					<Bloco>
						<Row>
							<ListaCompras compras={lancamentos} loadMore={loadMore} />
						</Row>
					</Bloco>
				</>
			)}
			<CadastroLancamento
				isOpened={openCadastro}
				close={() => setOpenCadastro(false)}
			/>
			<BackTop
				type={'primary'}
				tooltip={'Voltar ao topo'}
				style={{
					width: 50,
					height: 50,
					display: 'flex',
					alignItems: 'center',
				}}
			/>
		</>
	)
}

export default ConteudoPrincipal
