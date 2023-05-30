import { useDadosComuns } from '@contexts/dadosComuns/useDadosComuns'
import React, { useEffect } from 'react'
import { CabecalhoPessoas } from './components/Cabecalho'
import { CardListPessoas } from './components/CardList'

const PessoasPage: React.FC = () => {
  const { pessoas, buscarPessoas } = useDadosComuns()

  useEffect(() => {
    if (!pessoas) {
      buscarPessoas()
    }
  }, [pessoas])
  return (
    <>
      <CabecalhoPessoas />
      <CardListPessoas pessoas={pessoas} />
    </>
  )
}

export default PessoasPage
