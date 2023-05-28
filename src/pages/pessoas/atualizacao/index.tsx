import { AvatarUpload } from '@components/AvatarUpload'
import { Col, Row } from 'antd'
import { useLocation, useParams } from 'react-router-dom'

export const AtualizacaoPessoaPage: React.FC = () => {
  const params = useParams()
  const {
    state: { pessoa },
  } = useLocation()
  return (
    <Row>
      <Col xs={24} sm={24} md={6}>
        <AvatarUpload
          pessoa={pessoa}
          onChange={(a) => console.log('arquivo', a)}
        />
      </Col>
      <Col xs={24} sm={24} md={18} style={{ backgroundColor: 'red' }}>
        {pessoa.nome}
      </Col>
    </Row>
  )
}
