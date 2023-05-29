import { grey } from '@ant-design/colors'
import { api } from '@apis/api'
import { FaturaItem } from '@models/faturaItem'
import { Page } from '@models/pagination'
import { formatarDinheiro } from '@utils/util'
import { Col, List, notification, Row, Tooltip, Typography } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

const { Text } = Typography

const ListaUltimasCompras: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [faturaItens, setFaturaItens] = useState<FaturaItem[]>([])

  const buscarUltimasCompras = async () => {
    try {
      setLoading(true)

      const { data } = await api.get<Page<FaturaItem>>('faturas/fatura-atual', {
        params: {
          page: 1,
          linesPerPage: 6,
          somenteAtivos: false,
        },
      })
      setFaturaItens(data.content)
    } catch (e) {
      notification.error({
        message: 'Ocorreu um erro',
        description: 'Ocorreu um erro ao buscar as ultimas compras',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    buscarUltimasCompras()
  }, [])
  return (
    <List
      style={{
        width: '100%',
        padding: 0,
        margin: 0,
      }}
      loading={loading}
      itemLayout="horizontal"
      loadMore={null}
      // size={'large'}
      dataSource={faturaItens}
      renderItem={(item: FaturaItem) => (
        <Tooltip title={item.lancamento?.descricao}>
          <div
            style={{
              padding: 4,
              paddingRight: 16,
              paddingLeft: 16,
              borderBottom: `1px solid #f0f0f0`,
            }}
          >
            <Row style={{ marginTop: 4 }}>
              <Col span={24}>
                <Row style={{ marginBottom: 2 }}>
                  <Col span={6}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: grey.primary,
                      }}
                    >
                      {moment(item.lancamento.dataCompra).format('DD/MM/YYYY')}
                    </Text>
                  </Col>
                  <Col
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      textAlign: 'right',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: grey.primary,
                      }}
                    >
                      {item.dividido && item.itensRelacionados?.length
                        ? [item, ...item.itensRelacionados]
                            .map((faturaItem) => faturaItem?.pessoa?.nome)
                            .join(', ')
                        : item.pessoa.nome}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <Text
                      strong={true}
                      style={{
                        fontSize: 13,
                      }}
                    >
                      {item.nome}
                    </Text>
                  </Col>

                  <Col
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      textAlign: 'right',
                    }}
                  >
                    <Text
                      strong={true}
                      style={{
                        fontSize: 13,
                        marginLeft: '27%',
                      }}
                    >
                      {formatarDinheiro(item.valorUtilizado)}
                    </Text>
                  </Col>
                </Row>
                <Row>
                  <Col span={19}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: grey.primary,
                      }}
                    >
                      {item.formaPagamento?.nome}
                    </Text>
                  </Col>
                  <Col
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      textAlign: 'right',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: grey.primary,
                      }}
                    >
                      {item.parcelado
                        ? `em ${item.lancamento.quantidadeParcelas} vezes`
                        : 'à vista'}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Tooltip>
      )}
    />
  )
}
export default ListaUltimasCompras
