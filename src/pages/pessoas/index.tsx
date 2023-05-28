import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import React from 'react'
import { CabecalhoPessoas } from './components/Cabecalho'
import { CardListPessoas } from './components/CardList'

const PessoasPage: React.FC = () => {
  const { pessoas } = useDadosComuns()

  return (
    <>
      <CabecalhoPessoas />
      <CardListPessoas pessoas={pessoas} />
    </>
  )
}

export default PessoasPage
