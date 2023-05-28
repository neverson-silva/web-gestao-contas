export interface GraficoDadosPorFormaPagamento {
	id: number
	nome: string
	ano: number
	fechamento: number
	anoFechamento: number
	totaisFormaPagamento: TotalFormaPagamento[]
}

export interface TotalFormaPagamento {
	corFormaPagamento: string
	nomeFormaPagamento: string
	valorTotal: number
}
