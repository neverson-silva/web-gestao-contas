import { Drawer, DrawerProps } from 'antd'
import React from 'react'

export interface DrawerWithProps {
  settings?: DrawerProps
}

interface DrawerContextData<T extends DrawerWithProps> {
  render: React.ReactNode
  props?: T
  settings?: DrawerProps
}

const defaultSettings = {
  width: 600,
  title: 'Gestão de Contas',
} as unknown as DrawerProps

export const DrawerContext = React.createContext<DrawerContextData<any>>(
  {} as unknown as DrawerContextData<any>
)

const DrawerProvider: React.FC<any> = ({ children }) => {
  const [settings, setSettings] = React.useState<DrawerProps>({
    ...defaultSettings,
  })
  const [contentDrawer, setContentDrawer] =
    React.useState<React.ReactNode | null>()

  const onPresentDrawer = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ({ settingsCustom, render, componentParams }) => {
      setSettings({ ...defaultSettings, ...settingsCustom })

      const clonedElementWithMoreProps = React.cloneElement(render, {
        ...componentParams,
        key: Math.floor(Math.random() * 9999),
      })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setContentDrawer(clonedElementWithMoreProps)
    },
    []
  )

  const onHandleCancel = () => {
    setContentDrawer(null)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <DrawerContext.Provider value={{ onPresentDrawer, onHandleCancel }}>
      {children}
      <Drawer
        title={settings.title}
        open={!!contentDrawer}
        onClose={() => {
          setContentDrawer(null)
        }}
        width={settings.width}
        {...settings}
        footer={settings.footer ? settings.footer : null}
        destroyOnClose={true}
      >
        {contentDrawer}
      </Drawer>
    </DrawerContext.Provider>
  )
}

export default DrawerProvider
