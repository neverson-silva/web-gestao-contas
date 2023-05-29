import { Pessoa } from '@models/faturaItem'
import { formatarDinheiro, getPerfilUrl } from '@utils/util'
import { Card } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const { Meta } = Card

type CardListProps = {
  pessoas: Pessoa[]
}

export const CardListPessoas: React.FC<CardListProps> = ({ pessoas }) => {
  const navigate = useNavigate()
  const getNome = (pessoa: Pessoa) => {
    const fullName = `${pessoa.nome} ${pessoa.sobrenome}`
    return fullName.length <= 23
      ? fullName
      : `${pessoa.nome} ${pessoa.sobrenome.split(' ').pop()}`
  }

  const handleOnClick = (pessoa: Pessoa) => {
    navigate(`/pessoas/${pessoa.id}`, { state: { pessoa } })
  }

  return (
    <div
      style={{
        marginTop: 30,
      }}
    >
      {pessoas.chunk(4).map((pes, indice) => (
        <div
          key={indice}
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
          }}
        >
          {pes.map((pessoa, index) => {
            return (
              <div
                style={{
                  margin: 20,
                }}
                key={index}
              >
                <Card
                  hoverable
                  onClick={() => handleOnClick(pessoa)}
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="example"
                      src={getPerfilUrl(pessoa)}
                      height={240}
                      width={120}
                    />
                  }
                >
                  <Meta
                    title={getNome(pessoa)}
                    description={formatarDinheiro(pessoa.valorTotal ?? 0)}
                  />
                </Card>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
