import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import Bloco from '@components/Bloco'
import { Button, Col, Form, FormInstance, Input, Row } from 'antd'
import React from 'react'

export type FormBuscaValue = {
  search: string
}

type CabecalhoProps = {
  onSearch: () => void
  onCreateNew: () => void
  form: FormInstance<FormInstance>
  loading: boolean
}
const Cabecalho: React.FC<CabecalhoProps> = ({
  onSearch,
  form,
  loading,
  onCreateNew,
}) => {
  return (
    <div
      style={{
        marginBottom: 32,
      }}
    >
      <Bloco>
        <Form
          form={form}
          size={'large'}
          layout={'vertical'}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
          onFinish={onSearch}
        >
          <Row gutter={[16, 16]}>
            <Col sm={12}>
              <Form.Item name={'search'}>
                <Input
                  placeholder={'Compra, forma de pagamento ou nome da pessoa'}
                />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Button
                type={'primary'}
                htmlType={'submit'}
                icon={<SearchOutlined />}
                loading={loading}
                style={{
                  marginRight: 12,
                }}
              >
                Buscar
              </Button>
              <Button
                icon={<PlusOutlined />}
                type={'primary'}
                onClick={onCreateNew}
                disabled={loading}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Form>
      </Bloco>
    </div>
  )
}

export default Cabecalho
