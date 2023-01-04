import type { Moment } from 'moment'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import generatePicker, {
	PickerProps,
} from 'antd/lib/date-picker/generatePicker'
import React, { useCallback } from 'react'
import 'moment/locale/pt-br'
import locale from 'antd/lib/date-picker/locale/pt_PT'

const Component = generatePicker<Moment>(momentGenerateConfig)

export type DatePickerProps = {
	picker?: 'time' | 'week' | 'month' | 'quarter' | 'year'
	mode?: 'time' | 'week' | 'month' | 'quarter' | 'year'
	format?: string
	allowClear?: boolean
	placeholder?: string
	defaultValue?: Moment
	onChange?: (date: Moment) => void
	autoFocus?: boolean
	bordered?: boolean
	className?: string
	dateRender?: (currentDate: Moment, today: Moment) => React.ReactNode
	disabled?: boolean
	disabledDate?: boolean
	popupClassName?: string
	getPopupContainer?: (trigger: any) => void
	inputReadOnly?: boolean
	nextIcon?: React.ReactNode
} & PickerProps<Moment>

const DatePicker: React.FC<DatePickerProps> = (props) => {
	const { defaultValue } = props
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const DatePickerMemo = useCallback(() => {
		return <Component {...props} locale={locale} />
	}, [defaultValue])

	return <DatePickerMemo />
}
export default React.memo(DatePicker)
