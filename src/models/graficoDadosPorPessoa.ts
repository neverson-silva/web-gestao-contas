export interface DadosGraficoPorPessoa {
  id: number
  nome: string
  ano: number
  fechamento: number
  anoFechamento: number
  totaisPessoa: TotalPessoaGrafico[]
}

export interface TotalPessoaGrafico {
  idPessoa: number
  nome: string
  sobrenome: string
  total: number
  corBackground: string
  corBorder: string
}
