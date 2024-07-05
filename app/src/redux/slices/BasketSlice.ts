import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { appendToBasket, getBasket } from "../../services/BasketService";
import { IProduct } from "../../types/types";

interface BasketState {
  isFetching: boolean;
  products: IProduct[];
  error: string;
}

const initialState: BasketState = {
  isFetching: false,
  products: [],
  error: '',
};

export const BasketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    setBasket(state: BasketState, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(getBasket.pending.type, (state) => {
      state.isFetching = true;
    })
    builder.addCase(getBasket.fulfilled.type, (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
      state.isFetching = false;
    })
    builder.addCase(getBasket.rejected.type, (state, action: PayloadAction<string>) => {
      state.isFetching = false;
      state.error = action.payload;
    })
  }
})

export const {
  setBasket
} = BasketSlice.actions;