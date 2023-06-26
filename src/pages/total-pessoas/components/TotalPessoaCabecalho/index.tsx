import Bloco from '@components/Bloco'
import { DatePicker } from '@components/Time/Calendars'
import { useMesAno } from '@contexts/mesAno/useMesAno'
import { Col, Row, Typography } from 'antd'
import moment from 'moment'
import { useMemo } from 'react'

export const TotalPessoaCabecalho: React.FC = () => {
  const { beautifyDate, alterarData, mes, ano } = useMesAno()
  const defaultValueCalendar = useMemo(() => {
    if (mes && ano) {
      return moment(`${ano}-${mes}-01`)
    }
    return moment()
  }, [mes, ano])
  return (
    <Bloco style={{ marginBottom: 18 }}>
      <Row>
        <Col xs={20} className="flex justify-start items-center">
          <Typography.Title level={5}>{beautifyDate()}</Typography.Title>
        </Col>
        <Col xs={4} className="flex justify-end items-center">
          <DatePicker
            className="w-full"
            size="large"
            picker="month"
            format={'MMMM/YYYY'}
            allowClear={false}
            placeholder={'Selecione um mês'}
            defaultValue={defaultValueCalendar}
            onChange={(date) => {
              if (date) {
                alterarData(date.month() + 1, date.year())
              }
              return
            }}
          />
        </Col>
      </Row>
    </Bloco>
  )
}
