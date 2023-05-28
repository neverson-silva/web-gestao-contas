import { PlusOutlined } from '@ant-design/icons'
import { Button, Row } from 'antd'
import { useNavigate } from 'react-router-dom'

export const CabecalhoPessoas = () => {
  const navigate = useNavigate()
  return (
    <>
      <Row justify="start">
        <Button
          size="large"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('pessoas/cadastro')}
        >
          Novo
        </Button>
      </Row>
    </>
  )
}
