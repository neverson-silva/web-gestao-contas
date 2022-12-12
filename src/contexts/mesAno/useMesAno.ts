import React from 'react'
import { MesAnoContext } from '@contexts/mesAno/mesAno.provider'

export function useMesAno() {
	const context = React.useContext(MesAnoContext)
	return context
}
