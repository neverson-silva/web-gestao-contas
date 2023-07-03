import React from 'react'
import { TotalPessoa } from '@models/total-pessoa'
import { DrawerWithProps } from '@contexts/drawer/drawer.provider'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { NumericFormat } from 'react-number-format'
import { useRequest } from '@hooks/useRequest'

type TotalPessoaUpdate = {
  valorPago: number
  total: number
  diferenca: number
}
export type AtualizacaoTotalPessoaProps = TotalPessoa &
  DrawerWithProps & {
    onGoBack: () => Promise<void> | void
  }

export const AtualizacaoTotalPessoa: React.FC<AtualizacaoTotalPessoaProps> = ({
  pessoa,
  valorPago,
  total,
  diferenca,
  mes,
  ano,
  id,
  onGoBack,
}) => {
  const [form] = Form.useForm<TotalPessoaUpdate>()

  const { loading, mutate, error } = useRequest<any, TotalPessoaUpdate>({
    url: `/total-pessoa/:id`,
    method: 'put',
    mapper: (_form, values) => ({ ...values, mes: mes.id, ano, id }),
    form,
  })

  const handleUpdate = async () => {
    console.log('before', error, loading)
    await mutate()
    console.log('after', error, loading)
  }

  return (
    <div className="p-4">
      <Row justify={'space-between'} className="mb-4">
        <Col xs={16}>
          <Typography.Text className=" text-gray-800 text-xl font-semibold">
            {pessoa.nome} {pessoa.sobrenome}
          </Typography.Text>
        </Col>

        <Col>
          <Button onClick={() => onGoBack()} size="large">
            Voltar
          </Button>
          <Button
            type="primary"
            onClick={() => handleUpdate()}
            size="large"
            loading={loading}
            className="ml-3"
          >
            Atualizar
          </Button>
        </Col>
      </Row>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ valorPago, total, diferenca }}
        size="large"
        onFinish={handleUpdate}
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name={'total'} label="Valor Total">
              <NumericFormat
                disabled
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowLeadingZeros={true}
                decimalScale={2}
                placeholder="R$ 1.000.000"
                // onChange={(valor) => handleOnChangleValor(valor.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name={'diferenca'} label="Diferença">
              <NumericFormat
                disabled
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowLeadingZeros={true}
                decimalScale={2}
                placeholder="R$ 1.000.000"
                // onChange={(valor) => handleOnChangleValor(valor.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name={'valorPago'} label="Valor Pago">
              <NumericFormat
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                allowLeadingZeros={true}
                decimalScale={2}
                placeholder="R$ 1.000.000"
                // onChange={(valor) => handleOnChangleValor(valor.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
