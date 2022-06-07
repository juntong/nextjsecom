export interface ImageFormatData {
  url: string
}

export interface ImagesFormats {
  thumbnail: ImageFormatData
  small: ImageFormatData
}

export interface ImageAttributes {
  url: string
  formats: ImagesFormats
}

export interface ImageData {
  id: string
  attributes: ImageAttributes
}

export interface Image {
  data: ImageData[]
}

export interface ProductAttributes {
  title: string
  description: string
  price: number
  images: Image
  features: string
}

export interface ProductData {
  id: string
  attributes: ProductAttributes
}

export interface Product {
  data: ProductData[]
}
