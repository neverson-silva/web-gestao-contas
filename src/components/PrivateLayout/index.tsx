import {
  DownOutlined,
  LogoutOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons'
import MenuLateral from '@components/MenuLateral'
import { useAuth } from '@contexts/auth/useAuth'
import { Avatar, Col, Dropdown, Layout, Row, Space, Typography } from 'antd'
import React, { useState } from 'react'

const { Header, Sider, Content } = Layout
type PrivateLayoutProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { logout, usuario } = useAuth()

  const [dropdownVisible, setDropdownVisible] = useState<boolean | undefined>(
    undefined
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
          }}
        >
          <Row justify="end">
            <Col
              span={5}
              style={{
                paddingLeft: 20,
                display: 'flex',
                justifyContent: 'flex-end',
                marginRight: 24,
              }}
            >
              <Space wrap>
                <Dropdown
                  menu={{
                    items: [
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
                    ],
                  }}
                  onOpenChange={(visible) => setDropdownVisible(visible)}
                >
                  <Space>
                    <Avatar
                      src={usuario?.pessoa?.perfil}
                      size={'large'}
                      style={{ marginRight: 10, backgroundColor: 'white' }}
                    />
                    <Typography.Text style={{ color: 'white' }}>
                      {usuario?.pessoa?.nome}
                    </Typography.Text>
                    {dropdownVisible === false ? (
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
      </Layout>
    </Layout>
  )
}
