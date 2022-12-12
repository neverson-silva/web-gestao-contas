import moment from 'moment'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import generateCalendar from 'antd/lib/calendar/generateCalendar'
import 'moment/locale/pt-br'
import { CalendarProps } from 'antd'
import locale from 'antd/lib/date-picker/locale/pt_PT'

const Calendario = generateCalendar<moment.Moment>(momentGenerateConfig)

const Calendar: React.FC<CalendarProps<moment.Moment>> = (props) => {
	return <Calendario {...props} locale={locale} />
}
export default Calendar
