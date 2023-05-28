import { Row, RowProps } from 'antd'
import React, { PropsWithChildren } from 'react'

type LinhaProps = {
  display?: any
  flexDirection?: any
  flexWrap?: any
} & RowProps

const Linha: React.FC<PropsWithChildren<LinhaProps>> = ({
  children,
  display,
  flexDirection,
  flexWrap,
  ...props
}) => {
  const style = {
    display: display ?? 'flex',
    flexDirection: flexDirection ?? 'row',
    flexWrap: flexWrap ?? 'wrap',
    ...(props.style ?? {}),
  }
  delete props.style
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Row style={style} {...props}>
      {children}
    </Row>
  )
}

export default Linha
