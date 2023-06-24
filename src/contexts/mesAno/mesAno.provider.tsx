import { api } from '@apis/api'
import moment, { Moment } from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

export type MesAnoContextData = {
  ano: number | undefined
  mes: number | undefined
  meses: Array<{ id: number; nome: string; nomeAbreviado: string }>
  beautifyDate(): string
  alterarData(mes: number, ano: number): void
  buscarMesAnoAtual(force?: boolean): Promise<void>
  toMoment(): Moment | null
  mesAnoAtual: {
    mes: number
    ano: number
  }
}
export const MesAnoContext = React.createContext<MesAnoContextData>(
  {} as unknown as MesAnoContextData
)

export const MesAnoProvider: React.FC<any> = React.memo(({ children }) => {
  const [mes, setMes] = useState<number>()
  const [ano, setAno] = useState<number>()
  const [mesAnoAtual, setMesAnoAtual] = useState({
    mes: 0,
    ano: 0,
  })

  const meses = useMemo(() => {
    return [
      { id: 1, nome: 'Janeiro', nomeAbreviado: 'Jan' },
      { id: 2, nome: 'Fevereiro', nomeAbreviado: 'Fev' },
      { id: 3, nome: 'Março', nomeAbreviado: 'Mar' },
      { id: 4, nome: 'Abril', nomeAbreviado: 'Abr' },
      { id: 5, nome: 'Maio', nomeAbreviado: 'Mai' },
      { id: 6, nome: 'Junho', nomeAbreviado: 'Jun' },
      { id: 7, nome: 'Julho', nomeAbreviado: 'Jul' },
      { id: 8, nome: 'Agosto', nomeAbreviado: 'Ago' },
      { id: 9, nome: 'Setembro', nomeAbreviado: 'Set' },
      { id: 10, nome: 'Outubro', nomeAbreviado: 'Out' },
      { id: 11, nome: 'Novembro', nomeAbreviado: 'Nov' },
      { id: 12, nome: 'Dezembro', nomeAbreviado: 'Dez' },
    ]
  }, [])

  const buscarMesAnoAtual = async (force?: boolean) => {
    try {
      if ((!mes && !ano) || force) {
        const { data } = await api.get<{
          mesReferencia: number
          anoReferencia: number
        }>('meses/mesAtual')

        setAno(data.anoReferencia)
        setMes(data.mesReferencia)
        setMesAnoAtual({
          mes: data.mesReferencia,
          ano: data.anoReferencia,
        })
      }
    } catch (e) {
      const mesTemp = moment().month() + 1
      const anoTemp = moment().year()
      setMes(mesTemp)
      setAno(anoTemp)
      setMesAnoAtual({
        mes: mesTemp,
        ano: anoTemp,
      })
    }
  }

  const alterarData = (pMes: number, pAno: number) => {
    setMes(pMes)
    setAno(pAno)
  }

  const beautifyDate = () => {
    return moment(`${ano}-${mes}-01`).format('MMMM [de] YYYY')
  }

  const toMoment = (): Moment | null => {
    if (!ano) {
      return null
    }
    return moment(`${ano}-${mes}-01`)
  }

  useEffect(() => {
    buscarMesAnoAtual()
  }, [mes, ano])

  const contextData = useMemo(
    () => ({
      mes,
      ano,
      alterarData,
      beautifyDate,
      toMoment,
      mesAnoAtual,
      meses,
      buscarMesAnoAtual,
    }),
    [mes, ano, alterarData, beautifyDate, toMoment, meses, buscarMesAnoAtual]
  )
  return (
    <MesAnoContext.Provider value={contextData}>
      {children}
    </MesAnoContext.Provider>
  )
})
