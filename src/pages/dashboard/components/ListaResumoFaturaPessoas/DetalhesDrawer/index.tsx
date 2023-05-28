import { grey } from '@ant-design/colors'
import { FormaPagamento, Pessoa } from '@models/faturaItem'
import { ResumoFatura } from '@models/resumoFaturaPessoas'
import { formatarDinheiro } from '@utils/util'
import { Avatar, Col, List, Row, Typography } from 'antd'
import React from 'react'

import {
  BankOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons'

export type DetalhesDrawerProps = {
  pessoa: Pessoa
  resumos: ResumoFatura[]
}

const DetalhesDrawer: React.FC<DetalhesDrawerProps> = ({ pessoa, resumos }) => {
  const getIcon = (formaPagamento: FormaPagamento) => {
    switch (formaPagamento.id) {
      case 7:
        return (
          <DollarCircleOutlined
            key={formaPagamento.id}
            style={{ fontSize: 18, color: 'green' }}
          />
        )
        break
      case 6:
        //carne
        return (
          <BankOutlined
            key={formaPagamento.id}
            style={{ fontSize: 18, color: 'lightgreen' }}
          />
        )
      default:
        return (
          <CreditCardOutlined
            key={formaPagamento.id}
            style={{ fontSize: 18, color: 'orange' }}
          />
        )
    }
  }
  return (
    <>
      <Row
        gutter={[16, 16]}
        style={{ paddingBottom: 16, paddingLeft: 8, paddingRight: 8 }}
      >
        <Col span={4}>
          <Avatar src={pessoa?.perfil} size={70} />
        </Col>
        <Col span={20}>
          <Row justify={'start'}>
            <Col style={{ textAlign: 'start' }}>
              <Typography.Text
                strong
                style={{ color: grey.primary, fontSize: 18 }}
              >
                {pessoa.nome.toUpperCase()} {pessoa.sobrenome.toUpperCase()}
              </Typography.Text>
            </Col>
          </Row>
          <Row justify={'start'}>
            <Col style={{ textAlign: 'start' }}>
              <Typography.Paragraph style={{ color: grey.primary }}>
                Total:{' '}
                {formatarDinheiro(
                  resumos
                    .map((res) => res.valorTotal)
                    .reduce((ac, cur) => ac + cur, 0)
                )}
              </Typography.Paragraph>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <List
            dataSource={resumos}
            renderItem={(resumo: ResumoFatura) => (
              <List.Item key={pessoa?.id}>
                <List.Item.Meta
                  avatar={getIcon(resumo?.formaPagamento)}
                  title={
                    <a href="https://ant.design">
                      {resumo?.formaPagamento?.nome}
                    </a>
                  }
                  description={`${
                    resumo?.formaPagamento?.diaVencimento
                      ? `Vence no dia ${resumo?.formaPagamento?.diaVencimento}`
                      : 'Vence todo início de mês'
                  }`}
                />
                <div>{formatarDinheiro(resumo.valorTotal)}</div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  )
}

export default DetalhesDrawer
