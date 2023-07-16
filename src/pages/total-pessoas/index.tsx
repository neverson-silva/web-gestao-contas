import { CheckOutlined, RightOutlined } from '@ant-design/icons'
import { useDrawer } from '@contexts/drawer/useDrawer.ts'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { useRequest } from '@hooks/useRequest'
import { TotalPessoa } from '@models/total-pessoa'
import {
  AtualizacaoTotalPessoa,
  AtualizacaoTotalPessoaProps,
} from '@pages/total-pessoas/components/AtualizacaoTotalPessoa'
import { classNames, formatarDinheiro, isValidValue } from '@utils/util'
import { Avatar, Col, Row, Skeleton } from 'antd'
import React from 'react'
import { TotalPessoaCabecalho } from './components/TotalPessoaCabecalho'

export const TotalPessoasPage: React.FC = () => {
  const { mes, ano } = useMesAno()

  const [openDrawer, closeDrawer] = useDrawer<AtualizacaoTotalPessoaProps>({
    //@ts-ignore
    render: <AtualizacaoTotalPessoa />,
    settings: {
      placement: 'bottom',
      maskClosable: false,
      closable: false,
      title: null,
      bodyStyle: {
        padding: 0,
        margin: 0,
      },
    },
  })
  const { data, loading } = useRequest<TotalPessoa[]>({
    url: 'total-pessoas',
    method: 'get',
    onMount: {
      callable: (fetch) => fetch({ mesReferencia: mes, anoReferencia: ano }),
      dependencies: [mes, ano],
    },
  })

  const jaFoiPago = (totalPessoa: TotalPessoa): boolean => {
    return !(
      isValidValue(totalPessoa.valorPago) &&
      totalPessoa.valorPago >= totalPessoa.total
    )
  }

  return (
    <>
      <TotalPessoaCabecalho />

      {/* <Bloco> */}
      {loading && <Skeleton active={true} />}
      {!loading && (
        <>
          {data?.chunk(2)?.map((totais: TotalPessoa[], index) => {
            return (
              <Row gutter={[16, 16]} key={index}>
                {totais.map((totalPessoa) => {
                  return (
                    <Col xs={12} key={totalPessoa.id}>
                      <div
                        className={classNames(
                          'w-full bg-white p-4 mb-3 rounded-lg border-[0.1px] border-solid border-gray-200 shadow-sm',
                          {
                            'cursor-pointer hover:bg-zinc-100':
                              !jaFoiPago(totalPessoa),
                          }
                        )}
                        onClick={() =>
                          !jaFoiPago(totalPessoa)
                            ? openDrawer({
                                ...totalPessoa,
                                onGoBack: closeDrawer,
                              })
                            : null
                        }
                      >
                        <Row>
                          <Col xs={4} className="flex items-center">
                            <Avatar
                              size={70}
                              src={totalPessoa.pessoa?.perfil}
                            />
                          </Col>
                          <Col xs={16}>
                            <span className="text-sm font-semibold">
                              {totalPessoa?.pessoa?.nome}{' '}
                              {totalPessoa?.pessoa?.sobrenome}
                            </span>
                            <p className="p-0 m-0 text-sm font-light">
                              total {formatarDinheiro(totalPessoa?.total)}
                            </p>
                            <p className="p-0 m-0 text-sm font-light">
                              diferença{' '}
                              {formatarDinheiro(totalPessoa?.diferenca)}
                            </p>
                            <p className="p-0 m-0 text-sm font-light">
                              pago {formatarDinheiro(totalPessoa?.valorPago)}
                            </p>
                          </Col>
                          <Col xs={4} className="flex justify-end items-center">
                            <span className="text-gray-700 text-sm font-semibold">
                              {jaFoiPago(totalPessoa) ? (
                                <CheckOutlined style={{ color: 'green' }} />
                              ) : (
                                <RightOutlined />
                              )}
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            )
          })}
        </>
      )}
      {/* </Bloco> */}
    </>
  )
}
