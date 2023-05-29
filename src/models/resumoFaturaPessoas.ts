import { FormaPagamento, Pessoa } from './faturaItem'

export class ResumoFaturaPessoas {
  pessoa: Pessoa
  valorMesAtual: number
  valorMesAnterior: number
  resumos: ResumoFatura[]
}

export interface ResumoFatura {
  id: {
    pessoaId: number
    formaPagamentoId: number
    mesId: number
    ano: number
  }
  pessoa: Pessoa
  formaPagamento: FormaPagamento
  valorTotal: number
  valorParcelado: number
  valorAVista: number
  saldo: number
  parcelado: boolean
  cartaoAvista: boolean
}
