import { api } from '@apis/api'
import { CadastroFormValues } from '@contexts//lancamentos/lancamentos.provider'
import { useCadastroCompra } from '@contexts//lancamentos/useCadastroCompra'
import { useBuscaLancamento } from '@contexts/lancamentos/useBuscaLancamento.ts'

import {
  EDivisaoLancamentoTipo,
  FaturaItem,
  Lancamento,
} from '@models/faturaItem'
import CadastroLancamentoDivisaoDiferente from '@pages/lancamentos/components/CadastroLancamento/components/CadastroLancamentoDivisaoDiferente'
import CadastroLancamentoPrincipal from '@pages/lancamentos/components/CadastroLancamento/components/CadastroLancamentoPrincipal'
import { converterDinheiroEmFloat, formatarDinheiro } from '@utils/util'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Row,
  Typography,
  notification,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

export type CadastroLancamentoProps = {
  isOpened: boolean
  close: (updatePage?: boolean) => void

  compra?: FaturaItem
}

const CadastroLancamento: React.FC<CadastroLancamentoProps> = ({
  isOpened,
  close,
  compra,
}) => {
  const [abrirDivisaoDiferente, setAbrirDivisaoDiferente] = useState(false)
  const [loading, setLoading] = useState(false)
  const {
    form,
    limparTudo,
    reinicializarPessoasDiferente,
    setParcelado,
    setIsDivididoDiferente,
    setPessoasDiferentes,
    pessoasDiferente,
    isDivididoDiferente,
    formDivisaoDiferente,
  } = useCadastroCompra()

  const { addStart } = useBuscaLancamento()

  const handleOpenDivisaoDiferente = () => {
    setAbrirDivisaoDiferente(true)
  }
  const handleCloseDivisaoDiferente = () => {
    setAbrirDivisaoDiferente(false)
  }

  const handleOnClose = (updatePage?: boolean) => {
    limparTudo()
    close(updatePage)
  }

  const submitForm = async () => {
    await form.validateFields()

    try {
      setLoading(true)

      const formulario: CadastroFormValues = form.getFieldsValue(true)

      const igualmente = Array.from(formulario.idPessoa).length > 1

      const tempDiff = formDivisaoDiferente?.getFieldsValue(true)?.tempDiff

      const diferente =
        Array.from(tempDiff ?? formulario?.pessoasDivididoDiferente ?? [])
          .length > 0

      const idPessoa = Array.from(formulario.idPessoa)[0]
      const valor = converterDinheiroEmFloat(formulario.valor as string)
      const payload = {
        descricao: formulario.descricao,
        nome: formulario.nome,
        valor,
        mesReferencia: formulario.idMes,
        formaPagamentoId: formulario.formaPagamento,
        idPessoa,
        divisao: {
          igualmente,
          diferente,
          pessoas: igualmente
            ? [
                ...new Set(
                  formulario.idPessoa.filter((idPess) => idPess !== idPessoa)
                ),
              ].map((id) => ({
                id: id,
                valor: 0,
              }))
            : ((pessoasDiferente?.length > 0
                ? pessoasDiferente
                : formulario?.pessoasDivididoDiferente
              )?.filter((pess: any) => pess.id !== idPessoa) as any[]),
        },
        parcelado: formulario.parcelado ?? false,
        quantidadeParcelas: formulario.quantidadeParcelas,
        dataCompra: moment(formulario.dataCompra).format('YYYY-MM-DD'),
      }

      if (compra) {
        await api.put(`lancamentos/${compra.lancamento.id}`, payload)
        handleOnClose(true)
      } else {
        const { data: lancamento } = await api.post<Lancamento>(
          'lancamentos',
          payload
        )
        const faturaItem: FaturaItem = {
          lancamento,
          pessoa: lancamento.pessoa,
          ano: lancamento.ano,
          fechamento: lancamento.mes,
          id: lancamento.id * 2,
          itensRelacionados: lancamento,
        } as unknown as FaturaItem
        addStart(faturaItem)

        console.log('todos os dados que retornou', lancamento)
        handleOnClose()
      }
      notification.success({
        message: 'Sucesso',
        description: 'Lançamento cadastrado com sucesso!',
      })
    } catch (e) {
      notification.error({
        description:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          e?.response?.data?.message ??
          'Ocorreu um erro tente novamente mais tarde',
        message: 'Ocorreu um erro ao salvar',
      })
    } finally {
      setLoading(false)
    }
  }

  const inicializarFormulario = () => {
    const idsPessoas = [compra?.pessoa.id ?? 0]

    if (compra?.dividido && Array.isArray(compra.itensRelacionados)) {
      if (compra.divisaoId === EDivisaoLancamentoTipo.IGUALMENTE) {
        idsPessoas.push(
          ...compra.itensRelacionados.map((item) => item.pessoa.id)
        )
      } else {
        setIsDivididoDiferente(true)
        const pessoasAdicionar: number[] = []
        setPessoasDiferentes(
          compra?.itensRelacionados?.map((item) => {
            pessoasAdicionar.push(item.pessoa.id)
            return {
              id: item.pessoa.id,
              valor: item.valorUtilizado,
              nome: item.pessoa.nome,
            }
          })
        )

        formDivisaoDiferente.setFieldsValue({
          tempDiff: pessoasAdicionar,
        })
      }
    }

    form.setFieldsValue({
      formaPagamento: compra!.formaPagamento.id!,
      idPessoa: [...new Set(idsPessoas)],
      idMes: compra?.lancamento?.mes?.id,
      descricao: compra?.lancamento.descricao,
      valor: compra?.lancamento.valor,
      nome: compra?.nome,
      parcelado: compra?.parcelado,
      quantidadeParcelas: compra?.lancamento?.quantidadeParcelas,
      valorPorParcela: compra?.parcelado
        ? formatarDinheiro(compra?.lancamento?.valorPorParcela)
        : undefined,
      dataCompra: moment(compra?.lancamento.dataCompra),
    })
    setParcelado(compra?.parcelado ?? false)
  }

  useEffect(() => {
    if (compra) {
      inicializarFormulario()
    } else {
      limparTudo()
    }
  }, [compra])

  return (
    <Drawer
      visible={isOpened}
      onClose={() => handleOnClose()}
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
              onClick={() => handleOnClose()}
              disabled={loading}
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
              {compra ? 'Atualizar' : 'Salvar'}
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
                    if (!compra) {
                      reinicializarPessoasDiferente()
                    }
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
      {isDivididoDiferente && Array.from(pessoasDiferente).length && (
        <>
          <Divider />
          <Typography.Title level={4}>Dados Divisão</Typography.Title>
          {Array.from(pessoasDiferente)
            .chunk(2)
            .map((twoPerson, index) => {
              return (
                <Row gutter={[16, 0]} key={index}>
                  {twoPerson.map((pessoaDiff) => {
                    return (
                      <Col xs={12} key={pessoaDiff.id}>
                        <span>
                          {pessoaDiff.nome}:{' '}
                          {formatarDinheiro(pessoaDiff.valor)}
                        </span>
                      </Col>
                    )
                  })}
                </Row>
              )
            })}
        </>
      )}
    </Drawer>
  )
}

export default CadastroLancamento
