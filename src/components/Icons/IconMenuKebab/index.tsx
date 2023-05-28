import Icon from '@ant-design/icons'
import { Image } from 'antd'
import React from 'react'

type IconMenuKebabProps = {
  size?: number
  color?: string
  style?: React.CSSProperties
  onClick?: (event?: any) => void
}
const IconMenuKebab: React.FC<IconMenuKebabProps> = ({
  size,
  style,
  onClick,
}) => {
  return (
    <Icon
      onClick={onClick}
      style={{
        cursor: 'pointer',
        ...style,
      }}
      component={() => (
        <Image
          src={'/menu-kebab.svg'}
          alt={'Menu'}
          width={size ?? 16}
          height={size ?? 16}
        />
      )}
    />
  )
}

export default IconMenuKebab
