export interface IGeo {
  latitude: number,
  longitude: number
}

export interface IProductProps {
  name: string
  value: string
}

export interface IProduct {
  id: number
  image: string
  name: string
  categoryId: number
  price: string
  color: string
  age?: string
  brandId: number
  stop: boolean
  weight: string
  createdAt: string
  updatedAt: string
  props: IProductProps[]
  brand: IBrand
  category: ICategory
  quantity: number
}

export interface UserCheckData {
  id: number
  email: string
  role: string
}

export interface ICategory {
  id: number
  name: string
  filters: string[]
  image: string
  createdAt: string
  updatedAt: string
}

export interface IBrand {
  id: number
  name: string
  image: string
  createdAt: string
  updatedAt: string
}

export interface ICdekCity {
  city: string
  city_uuid: string
  code: number
  country: string
  country_code: string
  kladr_code: string
  latitude: number
  longitude: number
  payment_limit: number
  region: string
  region_code: number
  time_zone: string
}

export interface IOrderItem {
  createdAt: string
  id: number
  image: string
  name: string
  orderId: number
  price: number
  quantity: number
  updatedAt: string
}

export interface IOrder {
  address: string
  amount: number
  comment: string
  confirm: boolean
  createdAt: string
  deliweryWay: string
  email: string
  firstName: string
  id: number
  lastName: string
  payOption: string
  phone: string
  status: number
  updatedAt: string
  userId: number
  image: string
  items: IOrderItem[]
}