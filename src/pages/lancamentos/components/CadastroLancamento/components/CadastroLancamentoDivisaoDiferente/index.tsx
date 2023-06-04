import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import { useCadastroCompra } from '@contexts/lancamentos/useCadastroCompra'
import { converterDinheiroEmFloat } from '@utils/util'
import { Col, Form, Input, Row, Select } from 'antd'
import React, { useCallback, useEffect, useMemo } from 'react'
import { NumericFormat } from 'react-number-format'
import { useDebouncedCallback } from 'use-debounce'

export const CadastroLancamentoDivisaoDiferente: React.FC = () => {
  const { pessoas } = useDadosComuns();
  const {
    form,
    formDivisaoDiferente,
    adicionarPessoa,
    alterarValorPessoa,
    pessoasDiferente,
    setPessoasDiferentes,
  } = useCadastroCompra()

  const handleOnSelect = (idPessoa: number) => {
    adicionarPessoa(idPessoa)
  }
  const handleDeselect = (idPessoa: number) => {
    const pessoas = pessoasDiferente.filter((pessoa) => pessoa.id !== idPessoa)
    setPessoasDiferentes(pessoas)
  }

  const handleChangeValorPessoaDiferente = useDebouncedCallback(
    (idPessoa: number, valor: string) => {
      alterarValorPessoa(idPessoa, converterDinheiroEmFloat(valor ?? '0'))
    },
    300
  )

  useEffect(() => {
    form.setFieldsValue({ pessoasDivididoDiferente: pessoasDiferente })
  }, [pessoasDiferente])

  const renderInputPessoas = useCallback(() => {
    return Array.from(pessoasDiferente)
      .chunk(2)
      .map((twoPersons, index) => {
        return (
          <Row gutter={[16, 16]} key={index}>
            {twoPersons.map((pessoaDiferente) => {
              return (
                <Col span={12} key={pessoaDiferente.id}>
                  <Form.Item
                    label={pessoaDiferente.nome.split(' ')[0]}
                    key={pessoaDiferente.id}
                  >
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowLeadingZeros={true}
                      decimalScale={2}
                      placeholder="R$ 1.000.000"
                      value={pessoaDiferente.valor ?? null}
                      onChange={(event) =>
                        handleChangeValorPessoaDiferente(
                          pessoaDiferente.id,
                          event.target.value
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              )
            })}
          </Row>
        )
      })
  }, [pessoasDiferente])

  const currentPerson = useMemo(() => {
    const pessoa = form.getFieldValue('idPessoa')
    return Array.isArray(pessoa) ? pessoa[0] : pessoa
  }, [form])
  return (
    <Form layout={'vertical'} size={'large'} form={formDivisaoDiferente}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item label={'Selecione uma pessoa'} name={'tempDiff'}>
            <Select
              mode={'tags'}
              allowClear={false}
              showArrow
              placeholder={'Selecione uma pessoa'}
              showSearch={true}
              onDeselect={(value) => handleDeselect(value as number)}
              onSelect={(value) => handleOnSelect(value as number)}
              options={pessoas
                .filter((pess) => {
                  return pess.id !== currentPerson
                })
                .map((pessoa) => ({
                  value: pessoa.id,
                  label: pessoa.nome,
                }))}
            />
          </Form.Item>
        </Col>
      </Row>
      {renderInputPessoas()}
    </Form>
  )
}
export default CadastroLancamentoDivisaoDiferente
