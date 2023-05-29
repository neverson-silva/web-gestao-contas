export class Page<T> {
  content: T[]
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export class Pageable {
  sort: Sort
  offset: number
  pageNumber: number
  pageSize: number
  unpaged: boolean
  paged: boolean
}

export class Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface IPagination {
  current: number
  pageSize: number
  total?: number
  hasNext?: boolean
}
