import DatePicker from '@components/Time/Calendars/DatePicker'
import type { PickerTimeProps } from 'antd/lib/date-picker/generatePicker'
import type { Moment } from 'moment'
import * as React from 'react'

export type TimePickerProps = Omit<PickerTimeProps<Moment>, 'picker'>

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
))

TimePicker.displayName = 'TimePicker'

export default TimePicker
