import { AvatarUpload } from '@components/AvatarUpload'
import { DatePicker } from '@components/Time/Calendars'
import { Pessoa } from '@models/auth.ts'
import { Button, Col, Form, Input, Row } from 'antd'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { RcFile } from 'antd/es/upload'
import { api } from '@apis/api.ts'

export const AtualizacaoPessoaPage: React.FC = () => {
  const {
    state: { pessoa },
  } = useLocation()

  const [form] = Form.useForm<Partial<Pessoa>>()
  const enviarFotoPerfil = async (
    foto: RcFile | Blob | string
  ): Promise<string> => {
    const formData = new FormData()
    formData.append('file', foto)
    const { data } = await api.patch(`pessoas/upload/${pessoa.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante definir o cabeçalho correto
      },
    })
    return data
  }
  useEffect(() => {
    form.setFieldsValue(pessoa)
  }, [pessoa])

  return (
    <div className={'flex justify-center bg-white rounded-lg mt-7 '}>
      <Form className={'w-9/12 '} form={form} size={'large'}>
        <Row
          className={'w-full pb-6 pt-6 flex justify-center'}
          gutter={[16, 32]}
        >
          <Row className={'w-full  flex justify-center'}>
            <Col xs={24} sm={24} md={16} className={' flex justify-center'}>
              <AvatarUpload
                pessoa={pessoa}
                size={140}
                onUpload={enviarFotoPerfil}
              />
            </Col>
          </Row>

          <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
            <Col
              xs={24}
              sm={24}
              md={8}
              className={'flex justify-center w-full'}
            >
              <Form.Item name={'nome'} noStyle>
                <Input placeholder={'Maria'} />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={8}
              className={'flex justify-center w-full'}
            >
              <Form.Item name={'sobrenome'} noStyle>
                <Input placeholder={'Joana da Silva'} />
              </Form.Item>
            </Col>
          </Row>
          <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
            <Col
              xs={24}
              sm={24}
              md={8}
              className={'flex justify-center w-full'}
            >
              <Form.Item name={'apelido'} noStyle>
                <Input placeholder={'Joana da Silva'} />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={8}
              className={'flex justify-center w-full'}
            >
              <Form.Item name={'dataNascimento'} noStyle>
                <DatePicker format={'DD/MM/YYYY'} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
            <Col xs={24} sm={24} md={8}></Col>
            <Col xs={24} sm={24} md={8} className={'flex justify-end'}>
              <Button type={'primary'}>Atualizar</Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </div>
  )
}
