import { useDrawer } from '@contexts/drawer/useDrawer'
import { useModal } from '@contexts/modal/useModal'
import { Pessoa } from '@models/faturaItem'
import { ResumoFatura, ResumoFaturaPessoas } from '@models/resumoFaturaPessoas'
import DetalhesFaturaPessoa, {
  DetalhesFaturaPessoaProps,
} from '@pages/dashboard/components/ListaResumoFaturaPessoas/DefalhesFaturaPessoa/DetalhesFaturaPessoa'
import DetalhesDrawer, {
  DetalhesDrawerProps,
} from '@pages/dashboard/components/ListaResumoFaturaPessoas/DetalhesDrawer'
import { formatarDinheiro } from '@utils/util'
import { Avatar, Button, DrawerProps, List, Skeleton } from 'antd'
import React from 'react'

type DetalheResumosPessoaPagamentoDrawerProps = {
  settings?: DrawerProps
} & DetalhesDrawerProps

type ListaResumoFaturaPessoasProps = {
  resumos: ResumoFaturaPessoas[]
  initLoading: boolean
}

const ListaResumoFaturaPessoas: React.FC<ListaResumoFaturaPessoasProps> = ({
  resumos,
  initLoading,
}) => {
  const [openDrawerDetalhes] =
    useDrawer<DetalheResumosPessoaPagamentoDrawerProps>({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      render: <DetalhesDrawer />,
      settings: {
        title: null,
        closable: false,
        destroyOnClose: true,
        placement: 'right',
        width: 550,
      },
    })
  const [openModalDetalhesFaturaPessoa] = useModal<DetalhesFaturaPessoaProps>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    render: <DetalhesFaturaPessoa />,
    settings: {
      width: 720,
      title: null,
      destroyOnClose: true,
      closable: false,
      bodyStyle: {
        padding: 0,
        paddingTop: 16,
      },
    },
  })

  const verDetalhesPessoa = async (pessoa: Pessoa, resumos: ResumoFatura[]) => {
    openDrawerDetalhes({
      pessoa,
      resumos,
    })
  }

  const verFaturaPessoa = async (
    idPessoa: number,
    valorTotal: number,
    valorMesAnterior: number
  ) => {
    openModalDetalhesFaturaPessoa({
      idPessoa,
      valorTotal,
      valorMesAnterior,
    })
  }

  return (
    <List
      style={{
        width: '100%',
        padding: 8,
        marginTop: 6,
      }}
      loading={initLoading}
      itemLayout="horizontal"
      loadMore={null}
      // size={'large'}
      dataSource={resumos}
      pagination={{
        onChange: (page) => {
          console.log(page)
        },
        pageSize: 6,
      }}
      renderItem={(item: ResumoFaturaPessoas) => (
        <List.Item
          actions={[
            <Button
              type="link"
              key="list-loadmore-edit"
              onClick={() => verDetalhesPessoa(item?.pessoa, item.resumos)}
            >
              ver detalhes
            </Button>,
            <Button
              type="link"
              key="list-loadmore-more"
              onClick={() =>
                verFaturaPessoa(
                  item?.pessoa?.id,
                  item?.valorMesAtual,
                  item?.valorMesAnterior
                )
              }
            >
              ver fatura
            </Button>,
          ]}
        >
          <Skeleton avatar title={false} loading={initLoading} active>
            <List.Item.Meta
              avatar={<Avatar src={item?.pessoa?.perfil} />}
              title={`${item?.pessoa?.nome} ${item?.pessoa?.sobrenome}`}
              description={`Gastos de ${formatarDinheiro(
                item?.valorMesAnterior
              )} no mês anterior`}
            />
            <div>{formatarDinheiro(item?.valorMesAtual)}</div>
          </Skeleton>
        </List.Item>
      )}
    />
  )
}
export default ListaResumoFaturaPessoas
