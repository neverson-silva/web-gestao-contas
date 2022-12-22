import { ModalProps } from 'antd'
import { ComponentParamsWithSettings, ModalContext } from './modal.provider'
import React from 'react'

export function useModal<T extends ComponentParamsWithSettings>({
	settings,
	render,
}: {
	settings: ModalProps
	render: any
}): [(componentParams: T) => void, () => void] {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { onPresentModal, onHandleCancel } = React.useContext(ModalContext)

	const onInitializeModal = React.useCallback(
		(componentParams: T) => {
			const customSettings = { ...settings, ...componentParams.settings }
			delete componentParams.settings
			onPresentModal({
				settingsCustom: customSettings,
				render,
				componentParams,
			})
		},
		[onPresentModal, render, settings],
	)

	return [onInitializeModal, onHandleCancel]
}
