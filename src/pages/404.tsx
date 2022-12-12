import Bloco from '@components/Bloco'
import { Button, Col, Result, Row } from 'antd'
export default function FourOhFour() {
    return (
        <Bloco>
            <Row justify="center">
                <Col>
                    <Result
                        status="404"
                        title="404"
                        subTitle="Desculpe, a página solicitada não existe."
                        extra={<Button type="primary">Voltar para o início</Button>}
                    />
                </Col>
            </Row>
        </Bloco>
    )
}
