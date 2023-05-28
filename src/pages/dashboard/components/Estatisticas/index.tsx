import { grey } from '@ant-design/colors'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { formatarDinheiro } from '@utils/util'
import { Col, Row, Skeleton, Typography } from 'antd'
import React, { useMemo } from 'react'

const { Text } = Typography
export type EstatisticasProps = {
  valor?: number
  percentual?: number
  titulo?: string
  icone: any
  loading?: boolean
}
const Estatisticas: React.FC<EstatisticasProps> = ({
  valor,
  percentual,
  titulo,
  icone,
  loading,
}) => {
  const colorsMemo = useMemo(
    () => (percentual === 0 ? grey.primary : percentual! < 0 ? 'green' : 'red'),
    [percentual]
  )

  return (
    <div
      style={{
        margin: 8,
        backgroundColor: 'white',
        height: 90,
        width: 250,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Skeleton active loading={loading} paragraph={{ rows: 1 }}>
        {titulo != null ? (
          <>
            <Row style={{ margin: 3, marginBottom: 6 }}>
              <Col span={18}>
                <Text
                  strong={true}
                  style={{
                    fontSize: 16,
                    color: grey.primary,
                  }}
                >
                  {titulo}
                </Text>
              </Col>
              <Col
                span={5}
                style={{
                  textAlign: 'right',
                  margin: 0,
                  padding: 0,
                }}
              >
                {icone}
              </Col>
            </Row>
            <Row style={{ margin: 3 }}>
              <Col span={16}>
                <Text strong={true}>{formatarDinheiro(valor!)}</Text>
              </Col>
              <Col
                span={8}
                style={{
                  textAlign: 'right',
                }}
              >
                {percentual == 0 ? (
                  <></>
                ) : percentual! > 0 ? (
                  <ArrowUpOutlined
                    style={{
                      color: colorsMemo,
                    }}
                  />
                ) : (
                  <ArrowDownOutlined
                    style={{
                      color: colorsMemo,
                    }}
                  />
                )}
                <Text
                  style={{
                    color: colorsMemo,
                    textAlign: 'right',
                    marginLeft: 2,
                  }}
                  strong={true}
                >
                  {Number(percentual).toLocaleString('pt-BR')}%
                </Text>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row justify={'center'} style={{ marginBottom: 8 }}>
              <InfoCircleOutlined style={{ fontSize: 20, color: 'grey' }} />
            </Row>
            <Row justify={'center'} style={{ color: 'grey', fontSize: 14 }}>
              <Text>Não há dados</Text>
            </Row>
          </>
        )}
      </Skeleton>
    </div>
  )
}

export default Estatisticas
