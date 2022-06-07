import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

interface Item {
  id: string
  name: string
}

interface CartState {
  items: Item[]
}

const initialState: CartState = {
  items: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCart: (state) => {
      state.items.push({
        id: 'test',
        name: 'Product 1'
      })
    }
  }
})

export const { addCart } = cartSlice.actions
export const cartItems = (state: RootState) => state.cartSlice.items

export default cartSlice.reducer