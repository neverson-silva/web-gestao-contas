import { InfoCircleTwoTone } from '@ant-design/icons'
import { DatePicker } from '@components/Time/Calendars'
import { useAuth } from '@contexts/auth/useAuth'
import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import { useCadastroCompra } from '@contexts/lancamentos/useCadastroCompra'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { converterDinheiroEmFloat, formatarDinheiro } from '@utils/util'
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
} from 'antd'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useDebouncedCallback } from 'use-debounce'

type CadastroLancamentoPrincipalProps = {
  abrirDivisaoDiferente: () => void
}
const CadastroLancamentoPrincipal: React.FC<
  CadastroLancamentoPrincipalProps
> = ({ abrirDivisaoDiferente }) => {
  const { meses, mesAnoAtual } = useMesAno()
  const { usuario } = useAuth()
  const { pessoas, formasPagamentos } = useDadosComuns()
  const {
    form,
    parcelado,
    setParcelado,
    isDivididoDiferente,
    setIsDivididoDiferente,
  } = useCadastroCompra()

  const [desabilitarDiferente, setDesabilitaDiferente] = useState(true)

  const handleOnChangeParcelado = (pParcelado: boolean) => {
    setParcelado(pParcelado)

    form.setFieldsValue({
      parcelado: pParcelado,
    })
    if (!parcelado) {
      form.setFieldsValue({
        quantidadeParcelas: undefined,
        valorPorParcela: '',
      })
    }
  }

  const handleDivididoDiverente = (dividido: boolean) => {
    setIsDivididoDiferente(dividido)
    if (dividido) {
      abrirDivisaoDiferente()
    }
  }

  const handleOnChangleValor = useDebouncedCallback((valor: string) => {
    const quantidadeParcelas = form.getFieldValue('quantidadeParcelas')

    if (!quantidadeParcelas) {
      return
    }

    const valorParcelado = parseFloat(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (converterDinheiroEmFloat(valor) / quantidadeParcelas)?.toFixed(2)
    )
    form.setFieldsValue({
      valorPorParcela: `${formatarDinheiro(
        valorParcelado
      )} em ${quantidadeParcelas}x`,
    })
  }, 1000)

  const handleOnChangeQuantidadeParcela = useDebouncedCallback(
    (quantidadeParcelas: number) => {
      const valor = converterDinheiroEmFloat(form.getFieldValue('valor'))

      if (!valor || quantidadeParcelas == undefined) {
        form.setFieldsValue({
          valorPorParcela: '',
        })
        return
      }

      let valorParcelado = 0

      if (quantidadeParcelas < 0) {
        const valorTotal = parseFloat(
          (valor * Math.abs(quantidadeParcelas)).toFixed(2)
        )

        form.setFieldsValue({
          valor: valorTotal,
          valorPorParcela: `${formatarDinheiro(valor)} em ${Math.abs(
            quantidadeParcelas
          )}x`,
          quantidadeParcelas: Math.abs(quantidadeParcelas),
        })
      } else {
        valorParcelado = parseFloat((valor / quantidadeParcelas).toFixed(2))

        form.setFieldsValue({
          valorPorParcela: `${formatarDinheiro(
            valorParcelado
          )} em ${quantidadeParcelas}x`,
          quantidadeParcelas: quantidadeParcelas,
        })
      }
    },
    1000
  )

  const decidirSePermiteDivisaoDiferente = () => {
    const totalPessoas = form.getFieldValue('idPessoa')

    if (
      totalPessoas &&
      (Array.from(totalPessoas).length > 1 ||
        Array.from(totalPessoas).length === 0)
    ) {
      setDesabilitaDiferente(true)
    } else {
      setIsDivididoDiferente(false)
      setDesabilitaDiferente(false)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      idPessoa: [usuario!.pessoa!.id],
      idMes: mesAnoAtual?.mes,
    })
    decidirSePermiteDivisaoDiferente()
  }, [usuario])

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name={'nome'}
            label={'Compra'}
            required
            rules={[
              { required: true, message: 'Nome da compra é obrigatório' },
            ]}
          >
            <Input placeholder={'Mercado Livre'} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'valor'}
            label={'Valor'}
            required
            rules={[{ required: true, message: 'Valor não informado' }]}
            style={{
              width: '100%',
            }}
          >
            <NumericFormat
              customInput={Input}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              allowLeadingZeros={true}
              decimalScale={2}
              placeholder="R$ 1.000.000"
              onChange={(valor) => handleOnChangleValor(valor.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            name={'formaPagamento'}
            required
            label={'Forma de Pagamento'}
            rules={[
              { required: true, message: 'Forma de pagamento é obrigatório' },
            ]}
          >
            <Select
              allowClear={false}
              showArrow
              placeholder={'Selecione uma forma de pagamento'}
              showSearch={true}
              filterOption={(inputValue, option) => {
                return (option?.label?.toLowerCase() ?? '').includes(
                  inputValue?.toLowerCase()?.trim()
                )
              }}
              options={formasPagamentos.map((formaPagamento) => ({
                value: formaPagamento.id,
                label: formaPagamento.nome,
              }))}
            ></Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name={'idPessoa'}
            required
            label={'Pessoa'}
            rules={[
              { required: true, message: 'Dono da compra é obrigatório' },
            ]}
          >
            <Select
              allowClear={false}
              showArrow
              mode={'multiple'}
              placeholder={'Selecione uma pessoa'}
              // defaultValue={usuario?.pessoa?.id}
              showSearch={true}
              filterOption={(inputValue, option) => {
                return (option?.label?.toLowerCase() ?? '').includes(
                  inputValue?.toLowerCase()?.trim()
                )
              }}
              onDeselect={() => decidirSePermiteDivisaoDiferente()}
              onSelect={() => {
                decidirSePermiteDivisaoDiferente()
              }}
              options={pessoas.map((pessoa) => ({
                value: pessoa.id,
                label: pessoa.nome,
              }))}
            ></Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name={'dataCompra'} required label={'Data da compra'}>
            <DatePicker
              format={'DD/MM/YYYY'}
              size={'large'}
              allowClear={false}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'idMes'}
            label={
              <div>
                <span style={{ marginRight: 8 }}>Mês de referência</span>
                <Tooltip
                  title={
                    'Campo opcional para que você possa indicar qual o mês de referencia desta compra, ou seja qual o mês da fatura. Caso não seja informado o mês da fatura será calculado a partir da data da compra'
                  }
                >
                  <InfoCircleTwoTone />
                </Tooltip>
              </div>
            }
          >
            <Select
              allowClear={true}
              showArrow
              placeholder={'Selecione uma mês'}
              showSearch={true}
              options={meses.map((mes) => ({
                value: mes.id,
                label: mes.nome,
              }))}
            ></Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name={'descricao'} label={'Descrição'}>
            <Input.TextArea />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={14}>
          <Checkbox
            checked={parcelado}
            onChange={(event) => handleOnChangeParcelado(event.target.checked)}
          >
            Parcelado
          </Checkbox>

          <Checkbox
            checked={isDivididoDiferente && !desabilitarDiferente}
            disabled={desabilitarDiferente}
            onChange={(event) => handleDivididoDiverente(event.target.checked)}
          >
            Dividir partes diferentes
          </Checkbox>
        </Col>
        <Col
          span={10}
          style={{
            display: 'flex',
            textAlign: 'right',
            alignItems: 'flex-end',
            alignContent: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          {isDivididoDiferente && (
            <Button
              type={'link'}
              onClick={abrirDivisaoDiferente}
              size={'small'}
            >
              Alterar divisão
            </Button>
          )}
        </Col>
      </Row>
      {parcelado && (
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name={'quantidadeParcelas'}
              required={parcelado}
              label={'Quantidade de Parcelas'}
              rules={[
                {
                  required: true,
                  message:
                    'Para uma compra parcelada é obrigatório informar a quantidade de parcelas',
                },
              ]}
            >
              <InputNumber
                style={{
                  width: '100%',
                }}
                onChange={(value) =>
                  handleOnChangeQuantidadeParcela(value as number)
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name={'valorPorParcela'}
              label={<span style={{ color: 'white' }}>Valor</span>}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
      )}
      <br />
    </>
  )
}

export default CadastroLancamentoPrincipal
