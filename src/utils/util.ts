import { FormaPagamento, Pessoa } from '../models/faturaItem'

export const toFixedTrunc = (x: string | number, n: number): string => {
  const v = (typeof x === 'string' ? x : x.toString()).split('.')
  if (n <= 0) return v[0]
  let f = v[1] || ''
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`
  while (f.length < n) f += '0'
  return `${v[0]}.${f}`
}

export const converterParaNumero = (
  valor: string | number,
  decimais = 2
): number => {
  if (!valor) {
    return valor as unknown as number
  }
  return Number(toFixedTrunc(valor, decimais))
}

export const formatarDinheiro = (valor: number): string | undefined => {
  if (valor != null) {
    return converterParaNumero(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }
}

export const delay = (miliseconds: number): Promise<void> => {
  return new Promise(function (resolve) {
    setTimeout(resolve, miliseconds)
  })
}

export const isPar = (valor: number): boolean => valor % 2 === 0

export const beautyNumber = (numero?: number) =>
  Number(numero ?? 0) <= 9 ? `0${Number(numero)}` : Number(numero)

export const isCartao = (formaPagamento: FormaPagamento) =>
  ![6, 7].includes(Number(formaPagamento.id))

export const converterDinheiroEmFloat = (valor: string): number => {
  if (valor) {
    let compativelComParseFloat = String(valor).replace('R$ ', '')
    compativelComParseFloat = compativelComParseFloat.replace(',', '.')
    return parseFloat(compativelComParseFloat)
  }
  return valor as unknown as number
}

export const getPerfilUrl = (pessoa: Pessoa): string => {
  return pessoa.perfil
    ? pessoa.perfil
    : pessoa.sexo === 'F'
    ? '/default-avatar-mulher.png'
    : '/default-avatar.png'
}
