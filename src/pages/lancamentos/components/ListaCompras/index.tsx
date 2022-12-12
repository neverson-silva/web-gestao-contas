import React from 'react'
import { FaturaItem } from '@models/faturaItem'
import { Button, List } from 'antd'
import ItemListaCompra from '@pages/lancamentos/components/ListaCompras/ItemListaCompra'
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
