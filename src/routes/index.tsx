import { Unauthorized } from '@components/403'
import { NotFound } from '@components/404'
import { Head } from '@components/Head'
import { PrivateLayout } from '@components/PrivateLayout'
import { useAuth } from '@contexts/auth/useAuth'
import { LoginPage } from '@pages/login'
import {
  Navigate,
  Routes as ReactRouterDomRoutes,
  Route,
} from 'react-router-dom'
import { RouteMenuLateralItem, routes } from './routes'

export const Routes = () => {
  const { isAuthenticated, hasRole } = useAuth()

  const isSomeHowAuthenticated =
    isAuthenticated || localStorage.getItem('token')

  const isAllowed = (route: RouteMenuLateralItem) => {
    return isSomeHowAuthenticated && (!route.roles || hasRole(...route.roles))
  }

  const Component = ({ route }: { route: RouteMenuLateralItem }) => {
    return (
      <>
        {isAllowed(route) ? (
          <>
            <Head
              title={
                route.label?.toString() ?? route.title ?? 'Gestão de contas'
              }
            />
            {route.element}
          </>
        ) : (
          <Unauthorized />
        )}
      </>
    )
  }

  return (
    <>
      {isSomeHowAuthenticated ? (
        <PrivateLayout>
          <ReactRouterDomRoutes>
            {routes.map((route, index) => {
              return (
                <Route
                  {...route}
                  element={<Component route={route} key={index} />}
                />
              )
            })}
            <Route path="*" element={<NotFound />} />
          </ReactRouterDomRoutes>
        </PrivateLayout>
      ) : (
        <ReactRouterDomRoutes>
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to={'/login'} replace />} />
        </ReactRouterDomRoutes>
      )}
    </>
  )
}

/*
<PrivateLayout>
        
      <ReactRouterDomRoutes>
        {routes.map((route, index) => {
          return (
            <Route
              {...route}
              element={<Component route={route} key={index} />}
            />
          )
        })}
        <Route path="login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            isSomeHowAuthenticated ? (
              <NotFound />
            ) : (
              <Navigate to={'/login'} replace />
            )
          }
        />
      </ReactRouterDomRoutes>
    </PrivateLayout> */
