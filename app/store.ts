import { configureStore } from '@reduxjs/toolkit'
import counterSlice from '@/feature/counter/counterSlice'
import cartSlice from '@/feature/cart/cartSlice'

const store =  configureStore({
  reducer: {
    counterSlice,
    cartSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store