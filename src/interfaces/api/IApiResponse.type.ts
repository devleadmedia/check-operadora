export interface IApiResponse<T> {
  data: T
  message?: string
}

export interface IApiPaginatedResponse<T> {
  data: T[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}
