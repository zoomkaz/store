import { IProduct } from "../../types/types";
import { RootState } from "../store";

export const getBasket = (state: RootState): IProduct[] => state.basket.products;
