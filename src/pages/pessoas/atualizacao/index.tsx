import { AvatarUpload } from '@components/AvatarUpload'
import { Button, Col, Form, Input, Row } from 'antd'
import { useLocation } from 'react-router-dom'
import { Head } from '@components/Head'
import React, { useEffect } from 'react'
import { Pessoa } from '@models/auth.ts'

export const AtualizacaoPessoaPage: React.FC = () => {
  const {
    state: { pessoa },
  } = useLocation()

  const [form] = Form.useForm<Partial<Pessoa>>()

  useEffect(() => {
    form.setFieldsValue(pessoa)
    console.log('valores do form', form.getFieldsValue(true))
  }, [pessoa])

  return (
    <Form className={'w-full'} form={form} size={'large'}>
      <Row gutter={[16, 32]}>
        <Row className={'w-full  flex justify-center'}>
          <Col xs={24} sm={24} md={12} className={' flex justify-center'}>
            <AvatarUpload
              pessoa={pessoa}
              size={140}
              //   onChange={(a) => console.log('arquivo', a)}
            />
          </Col>
        </Row>

        <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
          <Col xs={24} sm={24} md={6} className={'flex justify-center w-full'}>
            <Form.Item name={'nome'} noStyle>
              <Input placeholder={'Maria'} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} className={'flex justify-center w-full'}>
            <Form.Item name={'sobrenome'} noStyle>
              <Input placeholder={'Joana da Silva'} />
            </Form.Item>
          </Col>
        </Row>

        <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
          <Col xs={24} sm={24} md={6} className={'flex justify-center w-full'}>
            <Form.Item name={'apelido'} noStyle>
              <Input placeholder={'Joana da Silva'} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} className={'flex justify-center w-full'}>
            <Form.Item name={'dataNascimento'} noStyle>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row className={'w-full flex justify-center'} gutter={[16, 0]}>
          <Col xs={24} sm={24} md={6}></Col>
          <Col xs={24} sm={24} md={6} className={'flex justify-end'}>
            <Button type={'primary'}>Atualizar</Button>
          </Col>
        </Row>
      </Row>
    </Form>
  )
  return (
    <>
      <Head title={pessoa.nome} />
      <Form form={form} layout={'vertical'} size={'large'}>
        <Row justify={'center'} className={'mx-10'}>
          <Col xs={24} sm={24} md={6} lg={4}>
            <AvatarUpload
              pessoa={pessoa}
              size={140}
              //   onChange={(a) => console.log('arquivo', a)}
            />
          </Col>
          <Col xs={24} sm={24} md={16} lg={20}>
            <Row gutter={[20, 0]}>
              <Col xs={12}>
                <Form.Item
                  label={'Nome'}
                  name={'nome'}
                  rules={[{ required: true, message: 'Informe o nome' }]}
                >
                  <Input placeholder={'Maria Joana'} />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  label={'Sobrenome'}
                  name={'sobrenome'}
                  rules={[{ required: true, message: 'Informe o nome' }]}
                >
                  <Input placeholder={'Maria Joana'} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  )
}
