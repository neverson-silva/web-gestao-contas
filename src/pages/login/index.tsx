import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { useAuth } from '@contexts/auth/useAuth'
import { useRouter } from 'next/router'

const LoginPage: NextPage = () => {
	const [form] = Form.useForm()
	const { login } = useAuth()
	const router = useRouter()

	const [loading, setLoading] = useState(false)

	const onLogin = async (params: any) => {
		setLoading(true)
		await login(params.email, params.senha)

		setLoading(false)
		await router.push('/')
	}

	return (
		<div
			style={{
				height: '100vh',
				backgroundImage: `url("/login-background.jpg")`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
			}}
		>
			<Row
				justify="center"
				align="middle"
				style={{ flex: 1, minHeight: '100vh' }}
			>
				<Col span={8}>
					<Card style={{ borderRadius: 8, minHeight: 310 }}>
						<Form
							name={'login'}
							form={form}
							layout="vertical"
							onFinish={onLogin}
							style={{
								marginTop: 24,
							}}
						>
							<Form.Item
								name={'email'}
								label="Email"
								rules={[
									{
										required: true,
										type: 'email',
										message: 'Email inválido',
									},
								]}
							>
								<Input placeholder="informe seu email" size="large" />
							</Form.Item>
							<Form.Item
								name={'senha'}
								label="Senha"
								rules={[
									{
										required: true,
										message: 'Informe sua senha!',
									},
								]}
							>
								<Input.Password
									size="large"
									placeholder="informe sua senha"
									iconRender={(visible) =>
										visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
									}
								/>
							</Form.Item>
							<Row justify={'end'} align={'middle'}>
								<Col>
									<Button
										type={'link'}
										size={'large'}
										style={{ marginRight: 18 }}
									>
										Esqueci minha senha{' '}
									</Button>
									<Button
										type="primary"
										size="large"
										htmlType={'submit'}
										style={{ marginTop: 20, minWidth: 110 }}
										loading={loading}
									>
										Entrar
									</Button>
								</Col>
							</Row>
						</Form>
					</Card>
				</Col>
			</Row>
		</div>
	)
}

export default LoginPage
