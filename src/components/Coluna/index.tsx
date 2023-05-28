import { Col, ColProps } from 'antd'
import React, { PropsWithChildren } from 'react'

type ColunaProps = {
  display?: any
  flexDirection?: any
  flex?: any
  flexBasis?: any
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
