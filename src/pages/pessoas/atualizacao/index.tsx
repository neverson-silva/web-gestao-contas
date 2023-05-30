import { AvatarUpload } from '@components/AvatarUpload'
import { Col, Form, Input, Row } from 'antd'
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
    <div className={'flex bg-amber-500 justify-center p-4'}>
      <Form
        form={form}
        layout={'vertical'}
        size={'large'}
        className={'w-[50%] flex justify-center flex-col items-center'}
      >
        <Head title={pessoa.nome} />

        <div>
          <AvatarUpload
            pessoa={pessoa}
            size={140}
            //   onChange={(a) => console.log('arquivo', a)}
          />
        </div>
        <div className={'w-[80%]'}>
          <Form.Item
            label={'Nome'}
            name={'nome'}
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input placeholder={'Maria Joana'} />
          </Form.Item>
          <Form.Item
            label={'Sobrenome'}
            name={'sobrenome'}
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input placeholder={'Maria Joana'} />
          </Form.Item>
        </div>
      </Form>
    </div>
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
          <Col xs={24} sm={24} md={18} lg={20}>
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
