import { api } from '@apis/api'
import { IPagination, Page } from '@models/pagination'
import { useEffect, useState } from 'react'

type PaginationConfig = {
	url: string
	pageSize?: number
	initialPage?: number
	loadOnMount?: boolean
	infinite?: boolean
	fetchParams?: Record<string, any>
}
export type PaginationWithValue<T> = {
	valorTotal: number
	itens: Page<T>
}

type UsePaginationResult<T> = {
	data: Page<T> | PaginationWithValue<T> | null
	loading: boolean
	error: boolean
	errorMessage?: string
	pager: IPagination
	setPage(config: {
		page: number
		itemsPerPage?: number
		isInfinite?: boolean
		params?: Record<string, any>
		reset?: boolean
		defaultErrorMessage?: string
	}): Promise<void>
}

export const usePagination = <T,>({
	url,
	initialPage = 1,
	pageSize = 10,
	loadOnMount = false,
	infinite = false,
	fetchParams,
}: PaginationConfig): UsePaginationResult<T> => {
	const [itens, setItens] = useState<Page<T> | null>(null)

	const [pager, setPager] = useState<IPagination>({
		current: initialPage,
		pageSize: pageSize,
		total: 0,
		hasNext: false,
	})

	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string | undefined>()

	const [confs] = useState({ loadOnMount, infinite })

	const fetchData = async ({
		page,
		itemsPerPage,
		params: extraParams,
		reset,
		isInfinite,
		defaultErrorMessage,
	}: {
		page: number
		itemsPerPage?: number
		isInfinite?: boolean
		params?: Record<string, any>
		reset?: boolean
		defaultErrorMessage?: string
	}) => {
		try {
			setLoading(true)
			setError(false)
			setErrorMessage(undefined)

			const params = {
				page: reset ? initialPage : page,
				linesPerPage: reset ? pageSize : itemsPerPage ?? pager.pageSize,
				...extraParams,
			}

			const { data } = await api.get<Page<T>>(url, { params })

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			const hasItens = !data.itens

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			const paginated = data.itens ?? data

			if (!reset && (isInfinite || confs.infinite) && itens) {
				const dataItems = [
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					//@ts-ignore
					...(itens.itens?.content ?? itens.content),
					...paginated.content,
				]
				if (hasItens) {
					setItens({
						...data,
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						itens: {
							...paginated,
							content: dataItems,
						},
					})
				} else {
					setItens({ ...paginated, content: dataItems })
				}
			} else {
				setItens(data)
			}
			setPager({
				current: paginated.number,
				total: paginated.totalElements,
				pageSize: paginated.size,
				hasNext:
					!(paginated?.itens?.last ?? paginated?.last) &&
					!(paginated?.itens?.empty ?? paginated?.empty),
			})
		} catch (error: any) {
			console.log('erro ao buscar', error)
			setError(true)
			setErrorMessage(
				error?.response?.data?.message ??
					defaultErrorMessage ??
					'Ocorreu um erro ao obter os dados',
			)
		} finally {
			setLoading(false)
		}
	}

	const setPage = async (params: {
		page: number
		itemsPerPage?: number
		isInfinite?: boolean
		params?: Record<string, any>
		reset?: boolean
		defaultErrorMessage?: string
	}) => {
		await fetchData(params)
	}

	useEffect(() => {
		if (confs.loadOnMount && !itens) {
			fetchData({
				page: pager.current,
				itemsPerPage: pager.pageSize,
				params: fetchParams,
			})
		}
	}, [url, confs])

	return {
		data: itens,
		loading: loading,
		error,
		errorMessage,
		setPage,
		pager,
	}
}
