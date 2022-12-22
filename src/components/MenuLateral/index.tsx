import React, { useMemo } from 'react'
import { Layout, Menu } from 'antd'
import {
	UploadOutlined,
	UserOutlined,
	VideoCameraOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/router'

const { Sider } = Layout

const MenuLateral: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
	const router = useRouter()
	const mapEvents = {
		['/dashboard']: '1',
		['/lancamentos']: '2',
		['/faturas']: '3',
	}
	const selectedKey = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return mapEvents[router.pathname] ?? '1'
	}, [router.events])

	return (
		<Sider trigger={null} collapsible collapsed={collapsed}>
			<div className="logo" />
			<Menu
				theme="dark"
				mode="inline"
				selectedKeys={[selectedKey]}
				style={{ height: '100%' }}
				items={[
					{
						key: '1',
						icon: <UserOutlined />,
						label: 'Dashboard',
						onClick: () => router.replace('/dashboard'),
					},
					{
						key: '2',
						icon: <VideoCameraOutlined />,
						label: 'Lançamentos',
						onClick: () => router.replace('/lancamentos'),
					},
					{
						key: '3',
						icon: <UploadOutlined />,
						label: 'Fatura',
						onClick: () => router.replace('/faturas'),
					},
				]}
			/>
		</Sider>
	)
}

export default MenuLateral
