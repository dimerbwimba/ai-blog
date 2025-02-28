export interface Post {
  id: string
  title: string
  description: string
  seo_slug: string
  image: string
  createdAt: string
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
} 