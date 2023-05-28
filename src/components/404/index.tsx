import Bloco from '@components/Bloco'
import { EAppRoutes } from '@routes/routes'
import { Button, Col, Result, Row } from 'antd'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Bloco>
      <Row justify="center">
        <Col>
          <Result
            status="404"
            title="404"
            subTitle="Desculpe, a página solicitada não existe."
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
