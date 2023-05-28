import React from 'react'
import { MesAnoContext } from './mesAno.provider'

export function useMesAno() {
	const context = React.useContext(MesAnoContext)
	return context
}
