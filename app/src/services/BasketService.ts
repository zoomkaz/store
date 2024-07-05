import { createAsyncThunk } from "@reduxjs/toolkit";
import { IProduct } from "../types/types";
import { ApiClient } from "./Client"

export const getBasket = createAsyncThunk('basket/getone', async () => {
  try {
    const data = await GetBasketMethod()
    if (data.status === 200) {
      return data.data.products as IProduct[];
    }
  } catch (e) {
    // return e.error;
  }
});

interface AppendPropsType {
  id: number,
  amount: number
}
interface RemovePropsType {
  id: number
}

export const appendToBasket = createAsyncThunk(
  'basket/append',
  async ({ id, amount }: AppendPropsType) => {
    try {
      const data = await AppendToBasketMethod(id, amount)
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })
export const setToBasket = createAsyncThunk(
  'basket/set',
  async ({ id, amount }: AppendPropsType) => {
    try {
      const data = await SetToBasketMethod(id, amount)
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })
export const incrementToBasket = createAsyncThunk(
  'basket/increment',
  async ({ id, amount }: AppendPropsType) => {
    try {
      const data = await IncrementToBasketMethod(id, amount)
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })
export const decrementToBasket = createAsyncThunk(
  'basket/decrement',
  async ({ id, amount }: AppendPropsType) => {
    try {
      const data = await DecrementToBasketMethod(id, amount)
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })
export const removeFromBasket = createAsyncThunk(
  'basket/remove',
  async ({ id }: RemovePropsType) => {
    try {
      const data = await RemoveFromBasketMethod(id)
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })
export const clearBasket = createAsyncThunk(
  'basket/clear',
  async () => {
    try {
      const data = await ClearBasketMethod()
      if (data.status === 200) {
        return data.data.products as IProduct[];
      }
    } catch (e) {

    }
  })

export const GetBasketMethod = async () => {
  return await ApiClient({
    url: '/basket/getone'
  })
}

export const AppendToBasketMethod = async (id: number, amount: number) => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/product/${id}/append/${amount}`
  })
}
export const SetToBasketMethod = async (id: number, amount: number) => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/product/${id}/set/${amount}`
  })
}
export const IncrementToBasketMethod = async (id: number, amount: number) => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/product/${id}/increment/${amount}`
  })
}
export const DecrementToBasketMethod = async (id: number, amount: number) => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/product/${id}/decrement/${amount}`
  })
}
export const RemoveFromBasketMethod = async (id: number) => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/product/${id}/remove`
  })
}
export const ClearBasketMethod = async () => {
  return await ApiClient({
    method: "PUT",
    url: `/basket/clear`
  })
}