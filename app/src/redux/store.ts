import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { BasketSlice } from "./slices/BasketSlice";

const reducer = combineReducers({
  basket: BasketSlice.reducer
})

export const store = configureStore({ reducer })

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store