import { FaturaItem } from '@models/faturaItem'
import ItemListaCompra from '@pages/lancamentos/components/ListaCompras/ItemListaCompra'
import { List } from 'antd'
import React from 'react'

type ListaComprasProps = {
  compras: FaturaItem[]
  loadMore?: React.ReactNode
}
const ListaCompras: React.FC<ListaComprasProps> = ({ compras, loadMore }) => {
  return (
    <>
      <List
        style={{
          width: '100%',
          padding: 0,
          margin: 0,
        }}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={compras}
        renderItem={(compra, index) => (
          <ItemListaCompra compra={compra} currentIndex={index} />
        )}
      />
    </>
  )
}

export default ListaCompras
