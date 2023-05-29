import { grey } from '@ant-design/colors'
import { api } from '@apis/api'
import IconMenuKebab from '@components/Icons/IconMenuKebab'
import { useBuscaLancamento } from '@contexts/lancamentos/useBuscaLancamento'
import { FaturaItem } from '@models/faturaItem'
import CadastroLancamento from '@pages/lancamentos/components/CadastroLancamento'
import { beautyNumber, formatarDinheiro } from '@utils/util'
import {
  Avatar,
  Col,
  Dropdown,
  notification,
  Popconfirm,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import { AxiosError } from 'axios'
import moment from 'moment/moment'
import React, { useMemo, useState } from 'react'

const { Text } = Typography

type ItemListaCompra = {
  compra: FaturaItem
  currentIndex: number
}
const ItemListaCompra: React.FC<ItemListaCompra> = ({
  compra,
  currentIndex,
}) => {
  const [loadingExcluindo, setLoadingExcluindo] = useState(false)
  const [openAtualizacao, setOpenAtualizacao] = useState(false)
  const { buscarLancamentosAtual } = useBuscaLancamento()

  const valorCompraMemo = useMemo(() => {
    if (compra.dividido && compra.divisaoId != 1) {
      const lancamentos = [compra, ...compra.itensRelacionados]
      return lancamentos
        .map((lancamento) => formatarDinheiro(lancamento.valorUtilizado))
        .join(' / ')
    }

    return formatarDinheiro(compra.valorUtilizado)
  }, [compra])

  const handleEditarClick = () => {
    setOpenAtualizacao(true)
  }

  const handleExcluirClick = async (pCompra: FaturaItem) => {
    try {
      setLoadingExcluindo(true)
      await api.delete(`lancamentos/${pCompra.lancamento.id}`)
      await buscarLancamentosAtual({ reset: true })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
    } catch (e: AxiosError) {
      console.log('error', e)
      notification.error({
        message: 'Ocorreu um erro ao excluir',
        description:
          e?.response?.data?.message ??
          'Ocorreu um erro ao excluir, tente novamente mais tarde',
      })
    } finally {
      setLoadingExcluindo(false)
    }
  }

  const handleClonarClick = (pCompra: FaturaItem) => {
    return pCompra
  }

  const handleVerParcelasClick = (pCompra: FaturaItem) => {
    return pCompra
  }

  const items = [
    {
      key: '1',
      label: <a onClick={handleEditarClick}>Editar</a>,
    },
    {
      key: '2',
      label: <a onClick={() => handleVerParcelasClick(compra)}>Ver parcelas</a>,
    },

    {
      key: '3',
      label: <a onClick={() => handleClonarClick(compra)}>Clonar</a>,
    },
    {
      key: '4',
      // label: <a onClick={() => handleExcluirClick(compra)}>Excluir</a>,
      label: (
        <Popconfirm
          title={`Tem certeza que deseja excluir ${compra.nome}?`}
          onConfirm={() => handleExcluirClick(compra)}
          okText="Sim"
          cancelText="Não"
          okButtonProps={{
            size: 'large',
            loading: loadingExcluindo,
            disabled: loadingExcluindo,
          }}
          cancelButtonProps={{
            size: 'large',
          }}
        >
          <a href="#">Excluir</a>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div
      key={currentIndex}
      style={{
        padding: 4,
        backgroundColor: currentIndex % 2 === 0 ? '#F0F0F0' : 'white',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {openAtualizacao && (
        <CadastroLancamento
          isOpened={openAtualizacao}
          close={async (updatePage?: boolean) => {
            setOpenAtualizacao(false)
            if (updatePage) {
              await buscarLancamentosAtual({ reset: true })
            }
          }}
          compra={compra}
        />
      )}

      <Row>
        <Col
          xs={2}
          sm={2}
          md={2}
          xl={1}
          xxl={1}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Tooltip title={compra?.pessoa?.nome}>
            <Avatar
              src={compra?.pessoa?.perfil}
              size={45}
              alt={compra?.pessoa?.nome}
            />
          </Tooltip>
        </Col>
        <Col
          xs={16}
          sm={16}
          md={16}
          xl={16}
          xxl={16}
          style={{ paddingLeft: 8 }}
        >
          <Row>
            <Text
              style={{
                fontSize: 12,
                color: grey.primary,
              }}
            >
              {moment(compra.lancamento.dataCompra).format('DD/MM/YYYY')}
            </Text>
          </Row>
          <Row>
            <span
              style={{
                fontSize: 16,
                fontWeight: '600',
                wordBreak: 'break-all',
              }}
            >
              {compra.dividido
                ? `${compra.nome} - Total ${formatarDinheiro(
                    compra.parcelado
                      ? Number(compra.lancamento.valor) /
                          Number(compra.lancamento.quantidadeParcelas)
                      : compra.lancamento.valor
                  )}`
                : compra.nome}
            </span>
          </Row>
          <Row>
            <Text
              style={{
                fontSize: 12,
                color: grey.primary,
              }}
            >
              {compra.parcelado
                ? `parcela ${beautyNumber(
                    compra.parcela?.numero
                  )} de ${beautyNumber(compra.lancamento.quantidadeParcelas)}`
                : 'à vista'}
            </Text>
          </Row>
        </Col>
        <Col
          xs={6}
          sm={6}
          md={6}
          xl={6}
          xxl={6}
          style={{
            marginRight: 0,
            marginLeft: 0,
          }}
        >
          <Row
            style={{
              display: 'flex',
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: grey.primary,
              }}
            >
              {compra.dividido && compra.itensRelacionados?.length
                ? [compra, ...compra.itensRelacionados]
                    .map((faturaItem) => faturaItem?.pessoa?.nome)
                    .join(' / ')
                : compra.pessoa.nome}
            </Text>
          </Row>
          <Row
            style={{
              display: 'flex',
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: '600',
                wordBreak: 'break-all',
              }}
            >
              {valorCompraMemo}
            </span>
          </Row>
          <Row
            style={{
              display: 'flex',
              alignContent: 'flex-end',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
            }}
          >
            <Text
              strong
              style={{
                fontSize: 12,
                color: grey.primary,
              }}
            >
              {compra.formaPagamento?.nome}
            </Text>
          </Row>
        </Col>
        <Col
          xs={1}
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: 16,
          }}
        >
          <Dropdown menu={{ items }} trigger={['click']}>
            <IconMenuKebab size={24} onClick={(e) => e.preventDefault()} />
          </Dropdown>
        </Col>
      </Row>
    </div>
  )
}

export default ItemListaCompra
