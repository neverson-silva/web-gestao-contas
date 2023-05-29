import Bloco from '@components/Bloco'
import { useBuscaLancamento } from '@contexts/lancamentos/useBuscaLancamento'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import Cabecalho from '@pages/lancamentos/components/Cabecalho'
import CadastroLancamento from '@pages/lancamentos/components/CadastroLancamento'
import ListaCompras from '@pages/lancamentos/components/ListaCompras'
import { Button, FloatButton, Row, Skeleton, Typography } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const { BackTop } = FloatButton

const ConteudoPrincipal: React.FC = () => {
  const [query] = useSearchParams()

  const {
    loadingBusca,
    buscarLancamentosAtual,
    formBusca,
    pager,
    lancamentos,
  } = useBuscaLancamento()

  const [loadingMore, setLoadingMore] = useState(false)

  const { mesAnoAtual } = useMesAno()

  const dataFatura = useMemo(() => {
    return moment(`${mesAnoAtual.ano}-${mesAnoAtual.mes}-01`).format(
      'MMMM, YYYY'
    )
  }, [mesAnoAtual])

  const [openCadastro, setOpenCadastro] = useState(false)

  const closeCadastro = async (updatePage?: boolean) => {
    setOpenCadastro(false)
    if (updatePage) {
      await buscarLancamentosAtual({
        reset: true,
      })
    }
  }

  const handleCreateNew = () => {
    setOpenCadastro(true)
  }

  const buscarProximaPagina = async () => {
    setLoadingMore(true)
    await buscarLancamentosAtual({
      page: pager.current + 1,
      size: pager.pageSize,
      loadingMore: true,
    })
    setLoadingMore(false)
  }

  const loadMore = pager.hasNext ? (
    <>
      {loadingMore && <Skeleton loading={loadingMore} />}
      {!loadingMore && lancamentos.length ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={buscarProximaPagina} type={'link'}>
            buscar mais
          </Button>
        </div>
      ) : (
        <></>
      )}
    </>
  ) : null

  useEffect(() => {
    if (mesAnoAtual.mes && mesAnoAtual.ano) {
      buscarLancamentosAtual()
    }
  }, [mesAnoAtual])

  // isso nao funcionou no vite
  useEffect(() => {
    if (query.get('compra')) {
      formBusca.setFieldsValue({
        search: query.get('compra'),
      })
    }
  }, [query, formBusca])

  return (
    <>
      <Cabecalho
        onCreateNew={handleCreateNew}
        onSearch={() =>
          buscarLancamentosAtual({
            reset: true,
          })
        }
        form={formBusca}
        loading={loadingBusca}
      />
      {loadingBusca && !loadingMore && (
        <Bloco>
          <Skeleton loading={loadingBusca} />
        </Bloco>
      )}
      {(!loadingBusca || loadingMore) && (
        <>
          <Row>
            <Typography.Title level={4}>{dataFatura}</Typography.Title>
          </Row>
          <Bloco>
            <Row>
              <ListaCompras compras={lancamentos} loadMore={loadMore} />
            </Row>
          </Bloco>
        </>
      )}
      <CadastroLancamento isOpened={openCadastro} close={closeCadastro} />
      <BackTop
        type={'primary'}
        tooltip={'Voltar ao topo'}
        style={{
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
        }}
      />
    </>
  )
}

export default ConteudoPrincipal
