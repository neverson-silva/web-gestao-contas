import { Pessoa as AuthPessoa } from '@models/auth'
import { Page } from '@models/pagination'

export interface BuscarItensFatura {
  valorTotal: number
  itens: Page<FaturaItem>
}

export interface FaturaItem {
  id: number
  fechamento: number
  ano: number
  parcela?: Parcela
  lancamento: Lancamento
  pessoaId: number
  itensRelacionados: FaturaItem[]
  readOnly: boolean
  pessoa: Pessoa
  dividido: boolean
  parcelado: boolean
  formaPagamento: FormaPagamento
  divisaoId?: number
  nome: string
  valorUtilizado: number
}

export class Parcela {
  id: number
  vencimento: number
  numero: number
  valor: number
  valorPago: number
  pago: boolean
  atual: boolean
  mesReferencia: Mes
  anoReferencia: number
  createdAt: string
  updatedAt: string
  valorUtilizado: number
  contaNome: string
}

export enum EDivisaoLancamentoTipo {
  IGUALMENTE = 1,
  DIFERENTE = 2,
}

export class Lancamento {
  id: number
  nome: string
  descricao: string
  valor: number
  dataCompra: string
  ano: number
  parcelado?: boolean
  quantidadeParcelas?: number
  mes: Mes
  pago: boolean
  tipoConta: number
  divisaoId?: EDivisaoLancamentoTipo
  createdAt: string
  updatedAt: string
  valorDividido?: number
  readOnly: boolean
  dividido: boolean
  valorUtilizado: number
  valorPorParcela: number
}

export class Mes {
  id: number
  nome: string
  atual: boolean
  dataCriacao: string
  dataAlteracao: string
}

export class Pessoa extends AuthPessoa {
  valorTotal?: number
}

export class FormaPagamento {
  id: number
  nome: string
  dono?: Pessoa
  ativo: boolean
  diaVencimento?: number
  cor: string
  dataCriacao: string
  dataAlteracao: string
}
