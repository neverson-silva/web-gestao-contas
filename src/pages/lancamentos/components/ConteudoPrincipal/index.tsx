import React, { useEffect, useMemo, useState } from 'react'
import Head from '@components/Head'
import { Button, FloatButton, Row, Skeleton, Typography } from 'antd'
import Bloco from '@components/Bloco'
import moment from 'moment'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import Cabecalho from '@pages/lancamentos/components/Cabecalho'
import ListaCompras from '@pages/lancamentos/components/ListaCompras'
import { useRouter } from 'next/router'
import CadastroLancamento from '@pages/lancamentos/components/CadastroLancamento'
import { useBuscaLancamento } from '@contexts/lancamentos/useBuscaLancamento'

const { BackTop } = FloatButton

const ConteudoPrincipal: React.FC = () => {
	const router = useRouter()

	const {
		loadingBusca,
		buscarLancamentosAtual,
		formBusca,
		pager,
		lancamentos,
	} = useBuscaLancamento()

	const [loadingMore, setLoadingMore] = useState(false)

	const { mesAnoAtual } = useMesAno()

	const dataFatura = useMemo(() => {
		return moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`).format(
			'MMMM, YYYY',
		)
	}, [mesAnoAtual])

	const [openCadastro, setOpenCadastro] = useState(false)

	const closeCadastro = async (updatePage?: boolean) => {
		setOpenCadastro(false)
		if (updatePage) {
			await buscarLancamentosAtual({
				reset: true,
			})
		}
	}

	const handleCreateNew = () => {
		setOpenCadastro(true)
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
			formBusca.setFieldsValue({
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
				form={formBusca}
				loading={loadingBusca}
			/>
			{loadingBusca && !loadingMore && (
				<Bloco>
					<Skeleton loading={loadingBusca} />
				</Bloco>
			)}
			{(!loadingBusca || loadingMore) && (
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
			<CadastroLancamento isOpened={openCadastro} close={closeCadastro} />
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
