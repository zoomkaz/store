import { useEffect } from "react"
import { useAppDispatch } from "./hooks"
import { getBasket } from "../../services/BasketService"

export const useAppInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    Promise.all([
      dispatch(getBasket()).unwrap()
    ])
      .catch(() => {

      })
    // .finally(() => {
    //   dispatch(setAppInit(true));
    // });
  }, [dispatch])
}