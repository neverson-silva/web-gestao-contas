import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'
import React from 'react'

type UploadProfileWrapperProps = {
  loading: boolean
  size?: number
}
export const UploadProfileWrapper: React.FC<UploadProfileWrapperProps> = ({
  loading,
  size,
}) => {
  const wrapperSize = size ?? 140
  const iconSize = Number(wrapperSize - wrapperSize * 0.85)

  const styles = `flex justify-center items-center content-center text-center rounded-full bg-white border-dashed border-[1px] border-gray-600 hover:bg-gray-50 cursor-pointer`

  return (
    <Row className={styles} style={{ height: wrapperSize, width: wrapperSize }}>
      <Col>
        {loading ? (
          <LoadingOutlined
            style={{
              fontSize: iconSize,
            }}
          />
        ) : (
          <PlusOutlined
            style={{
              fontSize: iconSize,
            }}
          />
        )}
        <Col>
          <Typography.Text>Upload</Typography.Text>
        </Col>
      </Col>
    </Row>
  )
}
