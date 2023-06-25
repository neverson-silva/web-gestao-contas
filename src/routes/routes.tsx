import {
  DotChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { DashboardPage } from '@pages/dashboard'
import { FaturasPage } from '@pages/faturas'
import { LancamentosPage } from '@pages/lancamentos'
import { PessoasPage } from '@pages/pessoas'
import { AtualizacaoPessoaPage } from '@pages/pessoas/atualizacao'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import { RouteProps } from 'react-router-dom'

export enum EAppRoutes {
  LOGIN = 'login',
  INDEX = '',
  DASHBOARD = '',
  LANCAMENTOS = 'lancamentos',
  FATURAS = 'faturas',
  PESSOAS = 'pessoas',
  PESSOAS_ATUALIZACAO = 'pessoas/:id',
}

export type MenuLateralItem = MenuItemType & {
  roles?: string[]
}

export type RouteMenuLateralItem = MenuLateralItem & RouteProps

export const routes: RouteMenuLateralItem[] = [
  {
    label: 'Dashboard',
    path: '',
    element: <DashboardPage />,
    icon: <DotChartOutlined />,
    key: EAppRoutes.DASHBOARD,
    roles: ['ROLE_ADMIN', 'ROLE_USUARIO'],
  },
  {
    label: 'Lançamentos',
    path: EAppRoutes.LANCAMENTOS,
    element: <LancamentosPage />,
    key: EAppRoutes.LANCAMENTOS,
    roles: ['ROLE_ADMIN', 'ROLE_USUARIO'],
    icon: <VideoCameraOutlined />,
  },
  {
    key: EAppRoutes.PESSOAS,
    path: EAppRoutes.PESSOAS,
    icon: <UserOutlined />,
    label: 'Pessoas',
    element: <PessoasPage />,
    roles: ['ROLE_ADMIN'],
  },
  {
    key: EAppRoutes.PESSOAS_ATUALIZACAO,
    path: EAppRoutes.PESSOAS_ATUALIZACAO,
    label: 'Atualizar Pessoa',
    element: <AtualizacaoPessoaPage />,
    roles: ['ROLE_ADMIN'],
  },
  {
    key: EAppRoutes.FATURAS,
    icon: <UploadOutlined />,
    path: EAppRoutes.FATURAS,
    label: 'Faturas',
    element: <FaturasPage />,
    roles: ['ROLE_ADMIN'],
  },
]

export const menus = (handleClickMenu: (rota: EAppRoutes) => void) =>
  routes
    .filter((route) => route?.label && route?.icon)
    ?.map((route) => ({
      ...route,
      onClick: () => handleClickMenu(route.path as unknown as EAppRoutes),
    }))
