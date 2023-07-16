import { DrawerWithProps } from '@contexts/drawer/drawer.provider'
import { useRequest } from '@hooks/useRequest'
import { TotalPessoa } from '@models/total-pessoa'
import { isValidValue } from '@utils/util'
import { Button, Col, Form, Input, Row, Typography, notification } from 'antd'
import React from 'react'
import { NumericFormat } from 'react-number-format'

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

  const { loading, mutate, errorMessage } = useRequest<any, TotalPessoaUpdate>({
    url: `/total-pessoas/:id`,
    method: 'put',
    mapper: (_form, values) => ({ ...values, mes: mes.id, ano, id }),
    form,
  })

  const handleUpdate = async () => {
    await mutate()
    if (!isValidValue(errorMessage)) {
      notification.error({
        message: 'Erro ao atualizar',
      })
    } else {
      await onGoBack()
      notification.success({
        message: 'Total Pessoa atualizado com sucesso',
      })
    }
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
