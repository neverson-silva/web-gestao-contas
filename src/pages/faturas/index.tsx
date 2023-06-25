import Bloco from '@components/Bloco'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { PaginationWithValue, usePagination } from '@hooks/usePagination'
import { FaturaItem } from '@models/faturaItem'
import CabecalhoFatura from '@pages/faturas/components/CabecalhoFatura'
import { beautyNumber, formatarDinheiro } from '@utils/util'
import { Form, Row, Table, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import moment from 'moment/moment'
import React, { useMemo } from 'react'

export const FaturasPage: React.FC = () => {
  const { mes, ano } = useMesAno()
  const [form] = Form.useForm()

  const {
    loading: loadingSearching,
    data,
    setPage: fetchData,
    pager,
  } = usePagination<FaturaItem>({
    url: 'faturas/buscar-itens-fatura',
  })

  const valorTotal = useMemo(() => {
    return (data as PaginationWithValue<FaturaItem>)?.valorTotal ?? 0
  }, [data])

  const itensFatura = useMemo(() => {
    return (data as PaginationWithValue<FaturaItem>)?.itens?.content
  }, [data])

  const buscarDadosFatura = async (parametros?: {
    page?: number
    size?: number
    reset?: boolean
  }) => {
    const { page, size, reset } = parametros as any

    await fetchData({
      page,
      itemsPerPage: size,
      reset,
      params: {
        mes,
        ano,
        idFormaPagamento: form.getFieldValue('formaPagamentoId'),
      },
    })
  }

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
      title: 'Tipo',
      render: (_, record) =>
        record.parcelado
          ? `Em ${record.lancamento.quantidadeParcelas} vezes`
          : 'À vista',
      width: 110,
    },
    {
      title: 'Forma de Pagamento',
      align: 'center',
      render: (_, { formaPagamento }) => (
        <Tag color={'blue'}>{formaPagamento.nome}</Tag>
      ),
    },
  ]

  return (
    <>
      <CabecalhoFatura
        loadingSearching={loadingSearching}
        onChangePage={buscarDadosFatura}
        form={form}
      />
      <Row style={{ marginTop: 32 }}>
        <Typography.Title level={3}>
          Total Fatura {formatarDinheiro(valorTotal)}
        </Typography.Title>
      </Row>
      <Bloco>
        <Table
          dataSource={itensFatura}
          pagination={{
            ...pager,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={loadingSearching}
          columns={colunas}
          onChange={({ pageSize, current }) =>
            buscarDadosFatura({ page: current, size: pageSize })
          }
        />
      </Bloco>
    </>
  )
}
