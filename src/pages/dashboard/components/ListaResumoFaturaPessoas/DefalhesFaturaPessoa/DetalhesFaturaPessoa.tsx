import { grey } from '@ant-design/colors'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { ComponentParamsWithSettings } from '@contexts/modal/modal.provider'
import { usePagination } from '@hooks/usePagination'
import { BuscarItensFatura, FaturaItem } from '@models/faturaItem'
import { beautyNumber, formatarDinheiro, isCartao } from '@utils/util'
import {
  Avatar,
  Col,
  Divider,
  Row,
  Skeleton,
  Table,
  Tag,
  Typography,
  notification,
} from 'antd'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo } from 'react'

export interface DetalhesFaturaPessoaProps extends ComponentParamsWithSettings {
  idPessoa: number
  valorTotal: number
  valorMesAnterior: number
}

const DetalhesFaturaPessoa: React.FC<DetalhesFaturaPessoaProps> = ({
  idPessoa,
  valorTotal,
  valorMesAnterior,
}) => {
  const { mes, ano } = useMesAno()

  const {
    loading,
    data,
    error,
    pager,
    setPage: fetchData,
  } = usePagination<BuscarItensFatura>({
    url: 'faturas/buscar-itens-fatura',
    pageSize: 10,
  })

  const pessoa = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return data?.itens?.content?.[0]?.pessoa
  }, [data])

  const buscarFaturaPessoa = useCallback(
    async (pIdPessoa: number, page?: number, size?: number) => {
      await fetchData({
        page: page ?? 1,
        itemsPerPage: size ?? pager.pageSize,
        params: {
          idPessoa: pIdPessoa,
          mes,
          ano,
        },
      })
    },
    []
  )

  const getNomeLancamento = (faturaItem: FaturaItem) => {
    if (faturaItem.parcelado) {
      return `${faturaItem.nome} - ${beautyNumber(
        faturaItem.parcela?.numero
      )}/${beautyNumber(faturaItem.lancamento.quantidadeParcelas)}`
    }
    return faturaItem.lancamento.nome
  }

  const colunas: ColumnsType<FaturaItem> = [
    {
      title: 'Data',
      render: (_, record) =>
        moment(record.lancamento.dataCompra).format('DD/MM/YYYY'),
      dataIndex: '1',
    },
    {
      title: 'Compra',
      render: (_, record) => getNomeLancamento(record),
    },
    {
      title: 'Valor',
      render: (_, record) => formatarDinheiro(record.valorUtilizado),
    },
    {
      title: 'Forma de Pagamento',
      align: 'center',
      render: (_, { formaPagamento, pessoa }) => (
        <Tag color={'green'}>
          {pessoa.id == 8 || !isCartao(formaPagamento)
            ? formaPagamento.nome
            : 'Cartão'}
        </Tag>
      ),
    },
  ]

  useEffect(() => {
    if (mes && ano) {
      buscarFaturaPessoa(idPessoa)
    }
  }, [mes, ano, idPessoa, buscarFaturaPessoa])

  useEffect(() => {
    if (error) {
      notification.error({
        description: 'Ocorreu um erro',
        message: 'Tente novamente mais tarde',
      })
      return
    }
  }, [error])

  return (
    <>
      {loading && <Skeleton loading={loading} />}
      {!loading && (
        <>
          <Row style={{}}>
            <Col
              xs={3}
              style={{
                marginRight: 0,
                display: 'flex',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Avatar src={pessoa?.perfil} size={80} />
            </Col>
            <Col
              xs={20}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <Row
                style={{
                  marginLeft: 32,
                }}
              >
                <Col xs={24}>
                  <Typography.Text
                    strong
                    style={{ color: 'black', fontSize: 14 }}
                  >
                    {pessoa?.nome.toUpperCase()}{' '}
                    {pessoa?.sobrenome.toUpperCase()}
                  </Typography.Text>
                </Col>
                <Col xs={24}>
                  <Typography.Text strong style={{ color: 'black' }}>
                    Total a pagar: {formatarDinheiro(valorTotal)}
                  </Typography.Text>
                </Col>
                <Col xs={24}>
                  <Typography.Text style={{ color: grey.primary }}>
                    Pago mês anterior: {formatarDinheiro(valorMesAnterior)}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider
            type={'horizontal'}
            style={{
              border: '2px solid rgba(0, 0, 0, 0.06)',
            }}
          />

          <Row>
            <Col xs={24}>
              <Table
                size={'small'}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                dataSource={data?.itens?.content}
                pagination={{
                  ...pager,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                columns={colunas}
                onChange={({ pageSize, current }) =>
                  buscarFaturaPessoa(idPessoa, current, pageSize)
                }
              />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}
export default DetalhesFaturaPessoa
