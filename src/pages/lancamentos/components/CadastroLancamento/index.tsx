import React, { useEffect, useState } from 'react'
import { Button, Col, Drawer, Form, notification, Row } from 'antd'
import CadastroLancamentoPrincipal from '@pages/lancamentos/components/CadastroLancamento/components/CadastroLancamentoPrincipal'
import CadastroLancamentoDivisaoDiferente from '@pages/lancamentos/components/CadastroLancamento/components/CadastroLancamentoDivisaoDiferente'
import moment from 'moment'
import { converterDinheiroEmFloat, delay } from '@utils/util'
import { CadastroFormValues } from '@pages/lancamentos/contexts/cadastroCompra/cadastroCompra.provider'
import { useCadastroCompra } from '@pages/lancamentos/contexts/cadastroCompra/useCadastroCompra'
import { api } from '@pages/api/api'

export type CadastroLancamentoProps = {
	isOpened: boolean
	close: () => void
}

const CadastroLancamento: React.FC<CadastroLancamentoProps> = ({
	isOpened,
	close,
}) => {
	const [abrirDivisaoDiferente, setAbrirDivisaoDiferente] = useState(false)
	const [loading, setLoading] = useState(false)
	const { form, limparTudo, reinicializarPessoasDiferente } =
		useCadastroCompra()

	const handleOpenDivisaoDiferente = () => {
		setAbrirDivisaoDiferente(true)
	}
	const handleCloseDivisaoDiferente = () => {
		setAbrirDivisaoDiferente(false)
	}

	const handleOnClose = () => {
		limparTudo()
		close()
	}

	const submitForm = async () => {
		await form.validateFields()

		try {
			setLoading(true)

			const formulario: CadastroFormValues = form.getFieldsValue(true)
			const igualmente = Array.from(formulario.idPessoa).length > 1
			const diferente =
				Array.from(formulario?.pessoasDivididoDiferente ?? []).length > 0
			const idPessoa = Array.from(formulario.idPessoa)[0]
			const payload = {
				descricao: formulario.descricao,
				nome: formulario.nome,
				valor: converterDinheiroEmFloat(formulario.valor as string),
				mesReferencia: formulario.idMes,
				formaPagamentoId: formulario.formaPagamento,
				idPessoa,
				divisao: {
					igualmente,
					diferente,
					pessoas: igualmente
						? formulario.idPessoa.map((id) => ({ id: id, valor: 0 }))
						: (formulario?.pessoasDivididoDiferente?.filter(
								(pess) => pess.id !== idPessoa,
						  ) as any[]),
				},
				parcelado: formulario.parcelado ?? false,
				quantidadeParcelas: formulario.quantidadeParcelas,
				dataCompra: moment(formulario.dataCompra).format('YYYY-MM-DD'),
			}
			await delay(200)
			const { data } = await api.post('lancamentos', payload)
			console.log('payload', payload)
		} catch (e) {
			console.log(e)
			notification.error({
				message: 'Ocorreu um erro tente novamente mais tarde',
				description: 'Error tota',
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		form.resetFields()
	}, [])

	return (
		<Drawer
			visible={isOpened}
			onClose={handleOnClose}
			placement={'left'}
			title={'Informações da Compra'}
			width={700}
			destroyOnClose={true}
			maskClosable={loading}
			footer={
				<Row
					justify={'end'}
					gutter={[16, 16]}
					style={{
						marginBottom: 8,
					}}
				>
					<Col span={4}>
						<Button
							type={'ghost'}
							style={{
								width: '100%',
							}}
							onClick={handleOnClose}
							size={'large'}
						>
							Cancelar
						</Button>
					</Col>
					<Col span={4}>
						<Button
							type={'primary'}
							size={'large'}
							style={{
								width: '100%',
							}}
							loading={loading}
							onClick={submitForm}
						>
							Salvar
						</Button>
					</Col>
				</Row>
			}
		>
			<Form
				form={form}
				layout={'vertical'}
				size={'large'}
				onFinish={submitForm}
			>
				<CadastroLancamentoPrincipal
					abrirDivisaoDiferente={handleOpenDivisaoDiferente}
				/>
				<Drawer
					visible={abrirDivisaoDiferente}
					onClose={handleCloseDivisaoDiferente}
					destroyOnClose={true}
					placement={'left'}
					footer={
						<Row justify={'end'} gutter={[16, 16]}>
							<Col span={12}>
								<Button
									style={{
										width: '100%',
									}}
									onClick={() => {
										reinicializarPessoasDiferente()
										handleCloseDivisaoDiferente()
									}}
								>
									Cancelar
								</Button>
							</Col>
							<Col span={12}>
								<Button
									style={{
										width: '100%',
									}}
									onClick={handleCloseDivisaoDiferente}
									type={'primary'}
								>
									Adicionar
								</Button>
							</Col>
						</Row>
					}
				>
					<CadastroLancamentoDivisaoDiferente />
				</Drawer>
			</Form>
		</Drawer>
	)
}

export default CadastroLancamento
