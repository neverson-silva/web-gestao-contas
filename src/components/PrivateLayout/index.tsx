import {
	DownOutlined,
	LogoutOutlined,
	UpOutlined,
	UserOutlined,
} from '@ant-design/icons'
import MenuLateral from '@components/MenuLateral'
import {
	Avatar,
	Col,
	Dropdown,
	Layout,
	Menu,
	Row,
	Space,
	Typography,
} from 'antd'
import React, { useState } from 'react'
import { useAuth } from '@contexts/auth/useAuth'
const { Header, Sider, Content } = Layout

type PrivateLayoutProps = {
	children: React.ReactNode
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false)
	const { logout, usuario } = useAuth()

	const menu = (
		<Menu
			items={[
				{
					label: 'Meu perfil',
					key: '1',
					icon: <UserOutlined />,
				},
				{
					label: 'Sair',
					key: '2',
					icon: <LogoutOutlined />,
					onClick: logout,
				},
			]}
		/>
	)
	const [dropdownVisible, setDropdownVisible] = useState<boolean | undefined>(
		undefined,
	)
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
			>
				<div className="logo" />
				<MenuLateral collapsed={collapsed} />
			</Sider>
			<Layout className="site-layout">
				<Header
					className="site-layout-background"
					style={{
						padding: 0,
						// backgroundColor: 'white',
					}}
				>
					{/* <PageHeader
						className="site-page-header"
						onBack={() => null}
						title="Title"
						subTitle="This is a subtitle"
					/> */}
					<Row justify="end">
						<Col span={5} style={{ paddingLeft: 20 }}>
							<Space wrap>
								<Dropdown
									overlay={menu}
									onOpenChange={(visible) => setDropdownVisible(!visible)}
								>
									<Space>
										<Avatar
											src="https://joeschmoe.io/api/v1/random"
											size={'large'}
											style={{ marginRight: 10, backgroundColor: 'white' }}
										/>
										<Typography.Text style={{ color: 'white' }}>
											{usuario?.pessoa?.nome} {usuario?.pessoa?.sobrenome}
										</Typography.Text>
										{dropdownVisible === true ? (
											<DownOutlined style={{ color: 'white' }} />
										) : (
											<UpOutlined style={{ color: 'white' }} />
										)}
									</Space>
								</Dropdown>
							</Space>
						</Col>
					</Row>
				</Header>
				<Content style={{ margin: '0 16px' }}>
					<div
						className="site-layout-background"
						style={{ padding: 24, minHeight: 360 }}
					>
						{children}
					</div>
				</Content>
				{/* <Footer style={{ textAlign: 'center' }}>
					Ant Design ©2018 Created by Ant UED
				</Footer> */}
			</Layout>
		</Layout>
	)
}

export default PrivateLayout
