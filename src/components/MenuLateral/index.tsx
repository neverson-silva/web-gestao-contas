import { useAuth } from '@contexts/auth/useAuth'
import { EAppRoutes, MenuLateralItem, menus } from '@routes/routes'
import { Layout, Menu, MenuProps } from 'antd'
import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const { Sider } = Layout

export interface MenuLateralProps extends Omit<MenuProps, 'items'> {
  items?: MenuLateralItem[]
  hasRole: (...roles: string[]) => boolean
}

const MenuAppLateral: React.FC<MenuLateralProps> = ({
  items,
  hasRole,
  ...rest
}) => {
  return (
    <Menu
      {...rest}
      items={items?.filter(
        (item: MenuLateralItem) =>
          !item?.roles || (hasRole && hasRole(...item.roles))
      )}
    />
  )
}

const MenuLateral: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { hasRole } = useAuth()

  const path = useMemo(() => location?.pathname ?? '/', [location])

  const [selectedMenu, setSelectedMenu] = useState(
    path.split('/')?.[1] ?? EAppRoutes.INDEX
  )

  const handleClickMenu = (menu: EAppRoutes) => {
    setSelectedMenu(menu)
    navigate(`/${menu}`)
  }

  const menusRender = menus(handleClickMenu)

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="logo" />
      <MenuAppLateral
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenu]}
        style={{ height: '100%' }}
        hasRole={hasRole}
        items={menusRender as any}
      />
    </Sider>
  )
}

export default MenuLateral
