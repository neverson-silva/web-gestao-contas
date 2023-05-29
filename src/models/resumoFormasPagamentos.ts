export interface ResumoFormaPagamentosDTO {
  cartao: ResumoFormaPagamento
  dinheiro: ResumoFormaPagamento
  parcelado: ResumoFormaPagamento
  total: ResumoFormaPagamento
}

export interface ResumoFormaPagamento {
  titulo: string
  valor: number
  porcentagem: number
  corIcone: string
}
