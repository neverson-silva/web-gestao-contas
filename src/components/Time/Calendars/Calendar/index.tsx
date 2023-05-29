import { CalendarProps } from 'antd'
import generateCalendar from 'antd/lib/calendar/generateCalendar'
import locale from 'antd/lib/date-picker/locale/pt_PT'
import moment from 'moment'
import 'moment/locale/pt-br'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'

const Calendario = generateCalendar<moment.Moment>(momentGenerateConfig)

const Calendar: React.FC<CalendarProps<moment.Moment>> = (props) => {
  return <Calendario {...props} locale={locale} />
}
export default Calendar
