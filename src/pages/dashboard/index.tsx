import { geekblue, gold, green, orange } from '@ant-design/colors'
import {
  BankOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons'
import { api } from '@apis/api'
import Bloco from '@components/Bloco'
import GastosMensaisPorCartaoColuna from '@components/Graficos/GastosMensaisPorCartaoColuna'
import GastosMensaisPorPessoaLinha from '@components/Graficos/GastosMensaisPorPessoaLinha'

import { DatePicker } from '@components/Time/Calendars'
import { useAuth } from '@contexts/auth/useAuth'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { ResumoFaturaPessoas } from '@models/resumoFaturaPessoas'
import { ResumoFormaPagamentosDTO } from '@models/resumoFormasPagamentos'
import Estatisticas from '@pages/dashboard/components/Estatisticas'
import ListaResumoFaturaPessoas from '@pages/dashboard/components/ListaResumoFaturaPessoas'
import ListaUltimasCompras from '@pages/dashboard/components/ListaUltimasCompras'
import { Card, Col, notification, Row, Typography } from 'antd'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

export const DashboardPage: React.FC = () => {
  const { mes, ano, toMoment, beautifyDate, alterarData } = useMesAno()
  const { usuario } = useAuth()
  const [loadingEstatisticas, setLoadingEstatisticas] = useState(false)
  const [resumoFormasPagamentos, setResumoFormasPagamentos] = useState<
    undefined | ResumoFormaPagamentosDTO
  >()

  const [initLoading, setInitLoading] = useState(false)
  const [resumos, setResumos] = useState<ResumoFaturaPessoas[]>([])

  const defaultValueCalendar = useMemo(() => {
    if (mes && ano) {
      return moment(`${ano}-${mes}-01`)
    }
    return moment()
  }, [mes, ano])

  const buscarGastosMesAtual = async () => {
    try {
      const dataSelecionada = toMoment()

      setLoadingEstatisticas(true)
      const { data } = await api.get<ResumoFormaPagamentosDTO>(
        `dashboard/resumo-pagamentos/${usuario?.pessoa.id}`,
        {
          params: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mesReferencia: dataSelecionada?.month() + 1,
            anoReferencia: dataSelecionada?.year(),
          },
        }
      )
      setResumoFormasPagamentos(data)
    } finally {
      setLoadingEstatisticas(false)
    }
  }

  const buscarResumosPessoasPorPeriodo = async () => {
    try {
      const dataSelecionada = toMoment()
      if (!dataSelecionada) {
        return
      }

      setInitLoading(true)
      const { data } = await api.get('dashboard/resumo-fatura-pessoas', {
        params: {
          mesReferencia: dataSelecionada.month() + 1,
          anoReferencia: dataSelecionada.year(),
        },
      })
      setResumos(data)
    } catch (e) {
      setResumos([])
      notification.error({
        description: 'Erro ao buscar dados',
        message: 'Tente novamente mais tarde',
      })
    } finally {
      setInitLoading(false)
    }
  }

  useEffect(() => {
    if (mes && ano) {
      buscarResumosPessoasPorPeriodo()
      buscarGastosMesAtual()
    }
  }, [mes, ano])

  return (
    <>
      <Row justify={'center'}>
        <Col>
          <Estatisticas
            titulo={resumoFormasPagamentos?.cartao?.titulo}
            valor={resumoFormasPagamentos?.cartao?.valor}
            percentual={resumoFormasPagamentos?.cartao?.porcentagem}
            loading={loadingEstatisticas}
            icone={
              <CreditCardOutlined
                style={{ fontSize: 22, color: green.primary }}
              />
            }
          />
        </Col>
        <Col>
          <Estatisticas
            titulo={resumoFormasPagamentos?.dinheiro?.titulo}
            valor={resumoFormasPagamentos?.dinheiro?.valor}
            percentual={resumoFormasPagamentos?.dinheiro?.porcentagem}
            loading={loadingEstatisticas}
            icone={
              <DollarCircleOutlined
                style={{ fontSize: 22, color: orange.primary }}
              />
            }
          />
        </Col>
        <Col>
          <Estatisticas
            titulo={resumoFormasPagamentos?.parcelado?.titulo}
            valor={resumoFormasPagamentos?.parcelado?.valor}
            percentual={resumoFormasPagamentos?.parcelado?.porcentagem}
            loading={loadingEstatisticas}
            icone={
              <BankOutlined style={{ fontSize: 22, color: geekblue.primary }} />
            }
          />
        </Col>
        <Col>
          <Estatisticas
            loading={loadingEstatisticas}
            titulo={resumoFormasPagamentos?.total?.titulo}
            valor={resumoFormasPagamentos?.total?.valor}
            percentual={resumoFormasPagamentos?.total?.porcentagem}
            icone={
              <BarChartOutlined style={{ fontSize: 22, color: gold.primary }} />
            }
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={[10, 8]}>
        <Col span={15}>
          <Bloco>
            <GastosMensaisPorPessoaLinha />
          </Bloco>
        </Col>

        <Col span={9}>
          <Bloco>
            <GastosMensaisPorCartaoColuna />
          </Bloco>
        </Col>
      </Row>
      <Row gutter={8} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card style={{ minHeight: 598 }}>
            <Row
              gutter={8}
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Col
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  flexBasis: '65%',
                }}
              >
                <Typography.Title level={5}>{beautifyDate()}</Typography.Title>
              </Col>
              <Col
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  flexBasis: '10%',
                }}
              >
                <DatePicker
                  picker="month"
                  format={'MMMM/YYYY'}
                  allowClear={false}
                  placeholder={'Selecione um mês'}
                  defaultValue={defaultValueCalendar}
                  onChange={(date) => {
                    if (date) {
                      alterarData(date.month() + 1, date.year())
                    }
                    return
                  }}
                />
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <ListaResumoFaturaPessoas
                initLoading={initLoading}
                resumos={resumos}
              />
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ minHeight: 598 }}>
            <Row>
              <Col span={18}>
                <Typography.Title level={5}>Últimas compras</Typography.Title>
              </Col>
            </Row>
            <Row>
              <ListaUltimasCompras />
            </Row>
          </Card>
        </Col>
        {/*<Col span={4}>*/}
        {/*	<Card style={{ minHeight: 400 }}>*/}
        {/*		<Row>*/}
        {/*			<Col span={18}>*/}
        {/*				<Typography.Title level={5}>Despesas</Typography.Title>*/}
        {/*			</Col>*/}
        {/*		</Row>*/}
        {/*	</Card>*/}
        {/*</Col>*/}
      </Row>
    </>
  )
}
