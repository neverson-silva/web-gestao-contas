import { DrawerProps } from 'antd'

import React, { ReactNode } from 'react'
import { DrawerContext, DrawerWithProps } from './drawer.provider'

export function useDrawer<T extends DrawerWithProps>({
  settings,
  render,
}: {
  settings: DrawerProps
  render: ReactNode
}): [(componentParams: T) => void, () => void] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { onPresentDrawer, onHandleCancel } = React.useContext(DrawerContext)

  const onInitializeDrawer = React.useCallback(
    (componentParams: T) => {
      const customSettings = { ...settings, ...componentParams.settings }
      delete componentParams.settings
      onPresentDrawer({
        settingsCustom: customSettings,
        render,
        componentParams,
      })
    },
    [onPresentDrawer, render, settings]
  )

  return [onInitializeDrawer, onHandleCancel]
}
