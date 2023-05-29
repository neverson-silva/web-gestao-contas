import { api } from '@apis/api'
import Bloco from '@components/Bloco'
import Coluna from '@components/Coluna'
import Linha from '@components/Linha'
import { DatePicker } from '@components/Time/Calendars'
import { useAuth } from '@contexts/auth/useAuth'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { FormaPagamento } from '@models/faturaItem'
import { delay } from '@utils/util'
import {
  Button,
  Form,
  FormInstance,
  notification,
  Select,
  Typography,
} from 'antd'
import { Moment } from 'moment'
import moment from 'moment/moment'
import React, { useEffect, useMemo, useState } from 'react'

type CabecalhoFaturaProps = {
  onChangePage: (parametros?: {
    page?: number
    size?: number
    reset?: boolean
  }) => Promise<void>
  loadingSearching: boolean
  form: FormInstance<any>
}
const CabecalhoFatura: React.FC<CabecalhoFaturaProps> = ({
  onChangePage,
  loadingSearching,
  form,
}) => {
  const { mes, ano, buscarMesAnoAtual, toMoment, beautifyDate, alterarData } =
    useMesAno()

  const { isAdmin } = useAuth()
  const [loadingBuscandoFormasPagamentos, setLoadingBuscandoFormasPagamentos] =
    useState(false)
  const [loadingFechandoFatura, setLoadingFechandoFatura] = useState(false)

  const [formasPagamentos, setFormasPagamentos] = useState<FormaPagamento[]>([])

  const defaultValueCalendar = useMemo(() => {
    if (mes && ano) {
      return moment(`${ano}-${mes}-01`)
    }
    return moment()
  }, [mes, ano])

  const formasPagamentosOptions = formasPagamentos.map(
    (formaPagamento: FormaPagamento) => {
      return {
        value: formaPagamento.id,
        label: formaPagamento.nome,
      }
    }
  )

  const fecharFatura = async () => {
    try {
      setLoadingFechandoFatura(true)
      await api.post('faturas/fechar')
      await buscarMesAnoAtual(true)
    } catch (e) {
      notification.error({
        message: 'Ocorreu um erro',
      })
    } finally {
      setLoadingFechandoFatura(false)
      await delay(500)
      await onChangePage({
        reset: true,
      })
    }
  }
  const buscarFormasPagamentosComCompras = async (pData: Moment | Date) => {
    if (pData) {
      const dataBusca = moment(pData)

      try {
        setLoadingBuscandoFormasPagamentos(true)
        const { data } = await api.get<FormaPagamento[]>(
          'formas-pagamentos/buscar-com-compras',
          {
            params: {
              mesReferencia: dataBusca.month() + 1,
              anoReferencia: dataBusca.year(),
            },
          }
        )
        setFormasPagamentos(data ?? [])
      } catch (e) {
        setFormasPagamentos([])
        notification.error({
          message: 'Ocorreu um erro',
          description: 'Tente novamente mais tarde',
        })
      } finally {
        setLoadingBuscandoFormasPagamentos(false)
      }
    }
  }

  useEffect(() => {
    if (mes && ano) {
      buscarFormasPagamentosComCompras(toMoment()!)
    }
  }, [])

  return (
    <Bloco>
      <Linha
        gutter={[0, 0]}
        style={{
          alignItems: 'center',
        }}
      >
        <Coluna flex={1} flexBasis={'60%'}>
          <Typography.Title level={5}>{beautifyDate()}</Typography.Title>
        </Coluna>
        <Coluna flex={1} flexBasis={'40%'}>
          <Linha
            gutter={[16, 16]}
            style={{
              height: 40,
            }}
          >
            <Form
              form={form}
              layout={'horizontal'}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              onFinish={() => onChangePage({ reset: true })}
              size="large"
            >
              <Coluna flexBasis={'40%'}>
                <Form.Item
                  name={'formaPagamentoId'}
                  rules={[
                    {
                      required: true,
                      message: 'Forma de pagamento não selecionada',
                    },
                  ]}
                >
                  <Select
                    options={formasPagamentosOptions}
                    allowClear
                    placeholder={'Forma de pagamento'}
                  />
                </Form.Item>
              </Coluna>
              <Coluna flexBasis={'30%'}>
                <DatePicker
                  picker="month"
                  format={'MMMM/YYYY'}
                  allowClear={false}
                  placeholder={'Selecione um mês'}
                  defaultValue={defaultValueCalendar}
                  size="large"
                  style={{
                    width: '100%',
                  }}
                  onChange={(date) => {
                    if (date) {
                      alterarData(date.month() + 1, date.year())
                      buscarFormasPagamentosComCompras(
                        moment(`${date.year()}-${date.month() + 1}-01`)
                      )
                    }
                    return
                  }}
                />
              </Coluna>
              <Coluna flexBasis={'10%'}>
                <Button
                  htmlType={'submit'}
                  type={'primary'}
                  disabled={
                    loadingFechandoFatura || loadingBuscandoFormasPagamentos
                  }
                  loading={loadingSearching}
                >
                  Buscar
                </Button>
              </Coluna>

              {isAdmin && (
                <Coluna flexBasis={'10%'}>
                  <Button
                    loading={loadingFechandoFatura}
                    onClick={fecharFatura}
                  >
                    Fechar fatura
                  </Button>
                </Coluna>
              )}
            </Form>
          </Linha>
        </Coluna>
      </Linha>
    </Bloco>
  )
}

export default CabecalhoFatura
