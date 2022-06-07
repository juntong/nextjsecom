import axios from 'axios'
import { Product, ProductData } from 'types/Product'

export const fetchApi = async (query: string, variables = {}) => {
  const { data } = await axios.post('http://localhost:1337/graphql', {
    query,
    variables,
  })
  return data.data
}

export const getProducts = async (): Promise<ProductData[]> => {
  const { products }: { products: Product } = await fetchApi(`
    query {
      products (pagination: { page:1, pageSize:20 }) {
        data {
          id
          attributes {
            title
            description
            price
            images {
              data {
                attributes {
                  url
                  formats
                }
              }
            }
          }
        }
      }
    }
  `)

  return products.data
}

export const getProduct = async (id: string) => {
  const { product }: { product: { data: ProductData } } = await fetchApi(
    `
  query($id: ID) {
    product(id: $id) {
      data {
        attributes {
          title
          description
          price
          Custom_field {
            title
            options
          }
          features
          images {
            data {
              id
              attributes {
                url
                formats
              }
            }
          }
        }
      }
    }
  }
  `,
    { id }
  )

  return product?.data
}
