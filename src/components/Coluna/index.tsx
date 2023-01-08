import React, { PropsWithChildren } from 'react'
import { Col, ColProps } from 'antd'
import { Property } from 'csstype'
import Display = Property.Display
import FlexDirection = Property.FlexDirection
import Flex = Property.Flex
import FlexBasis = Property.FlexBasis

type ColunaProps = {
	display?: Display
	flexDirection?: FlexDirection
	flex?: Flex
	flexBasis?: FlexBasis
} & ColProps
const Coluna: React.FC<PropsWithChildren<ColunaProps>> = ({
	display,
	flexDirection,
	flex,
	flexBasis,
	children,
	...props
}) => {
	const style = {
		display: display ?? 'flex',
		flexDirection: flexDirection ?? 'column',
		flex: flex ?? 1,
		flexBasis: flexBasis ?? '100%',
		...(props.style ?? {}),
	}
	delete props.style
	return (
		<Col style={style} {...props}>
			{children}
		</Col>
	)
}

export default Coluna
