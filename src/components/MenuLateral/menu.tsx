import {
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import React from 'react'

interface MenuItem {
	key: string | number
	icone?: React.ReactNode
	name: string
	url: string
	submenus?: MenuItem[]
}

export const menus: ItemType[] = [
	{
		key: '1',
		icon: <UserOutlined />,
		label: 'Dashboard',
	},
	{
		key: '2',
		icon: <VideoCameraOutlined />,
		label: 'Lançamentos',
	},
	{
		key: '3',
		icon: <UploadOutlined />,
		label: 'Fatura',
	},
]
