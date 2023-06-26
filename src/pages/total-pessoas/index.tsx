import React from 'react'
import { TotalPessoaCabecalho } from './components/TotalPessoaCabecalho'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { useRequest } from '@hooks/useRequest'
import { Avatar, Col, Row, Skeleton } from 'antd'
import { TotalPessoa } from '@models/total-pessoa'
import { RightOutlined } from '@ant-design/icons'
import { formatarDinheiro } from '@utils/util'

export const TotalPessoasPage: React.FC = () => {
  const { mes, ano } = useMesAno()

  const { data, loading } = useRequest<TotalPessoa[]>({
    url: 'total-pessoas',
    method: 'get',
    onMount: {
      callable: (fetch) => fetch({ mesReferencia: mes, anoReferencia: ano }),
      dependencies: [mes, ano],
    },
  })

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
                        className="w-full bg-white p-4 mb-3 rounded-lg cursor-pointer border-[0.1px] border-solid border-gray-200 shadow-sm hover:bg-zinc-100"
                        onClick={() => alert(totalPessoa.pessoa.nome)}
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
                              diferenca{' '}
                              {formatarDinheiro(totalPessoa?.diferenca)}
                            </p>
                            <p className="p-0 m-0 text-sm font-light">
                              pago {formatarDinheiro(totalPessoa?.valorPago)}
                            </p>
                          </Col>
                          <Col xs={4} className="flex justify-end items-center">
                            <span className="text-gray-700 text-sm font-semibold">
                              <RightOutlined />
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
