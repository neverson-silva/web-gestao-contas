import type { Moment } from 'moment'
import * as React from 'react'
import type { PickerTimeProps } from 'antd/lib/date-picker/generatePicker'
import DatePicker from '@components/Time/Calendars/DatePicker'

export type TimePickerProps = Omit<PickerTimeProps<Moment>, 'picker'>

const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => (
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	<DatePicker {...props} picker="time" mode={undefined} ref={ref} />
))

TimePicker.displayName = 'TimePicker'

export default TimePicker
