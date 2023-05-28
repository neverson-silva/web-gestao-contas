import React from 'react'
import { Modal, ModalProps } from 'antd'

export interface ComponentParamsWithSettings {
	settings?: ModalProps
}

interface ModalContextData<T extends ComponentParamsWithSettings> {
	render: React.ReactNode
	props?: T
	settings?: ModalProps
}
const defaultSettings = {
	width: 600,
	title: 'Gestão de Contas',
} as unknown as ModalProps

export const ModalContext = React.createContext<ModalContextData<any>>(
	{} as unknown as ModalContextData<any>,
)

const ModalProvider: React.FC<any> = ({ children }) => {
	const [settings, setSettings] = React.useState<ModalProps>({
		...defaultSettings,
	})
	const [contentModal, setContentModal] =
		React.useState<React.ReactNode | null>()

	const onPresentModal = React.useCallback(
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
			setContentModal(clonedElementWithMoreProps)
		},
		[],
	)

	const onHandleCancel = () => {
		setContentModal(null)
	}

	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<ModalContext.Provider value={{ onPresentModal, onHandleCancel }}>
			{children}
			<Modal
				title={settings.title}
				open={!!contentModal}
				onCancel={() => {
					setContentModal(null)
				}}
				width={settings.width}
				{...settings}
				footer={!!settings.footer ? settings.footer : null}
			>
				{contentModal}
			</Modal>
		</ModalContext.Provider>
	)
}

export default ModalProvider
