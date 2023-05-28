import Bloco from '@components/Bloco'
import { EAppRoutes } from '@routes/routes'
import { Button, Col, Result, Row } from 'antd'
import { useNavigate } from 'react-router-dom'

export const Unauthorized = () => {
  const navigate = useNavigate()

  return (
    <Bloco>
      <Row justify="center">
        <Col>
          <Result
            status="403"
            title="403"
            subTitle="Você não possui permissão para acessar esta página"
            extra={
              <Button
                type="primary"
                onClick={() => navigate(EAppRoutes.DASHBOARD)}
              >
                Voltar para o início
              </Button>
            }
          />
        </Col>
      </Row>
    </Bloco>
  )
}
