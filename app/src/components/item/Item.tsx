import React, { useEffect, useState } from 'react'
import styles from './Item.module.scss'
import { IProduct } from '../../types/types'
import { addSpace } from '../../func/addSpace'
import { NavLink } from 'react-router-dom'
import { translit } from '../../func/translite'
import { sklonenie } from '../../func/sklonenie'
import { appendToBasket } from '../../services/BasketService'
import { getBasket } from '../../redux/selectors/basket.selector'
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks'
import { setBasket } from '../../redux/slices/BasketSlice'

interface ItemPropsType {
  item: IProduct
}

const Item = ({ item }: ItemPropsType) => {

  const ageVariants = ['год', 'года', 'лет']

  const propWeight = item.props.filter(pr => pr.name === 'weight')
  const propAge = item.props.filter(pr => pr.name === 'age')
  const propStop = item.props.filter(pr => pr.name === 'stop')

  const [inBasket, setInBasket] = useState(false)

  const dispatch = useAppDispatch();
  const basket = useAppSelector(getBasket);

  const appendToBasketFn = async () => {
    const data = await dispatch(appendToBasket({ id: item.id, amount: 1 })).unwrap()
    if (data) {
      dispatch(setBasket(data))
      setInBasket(true)
    }
  }

  useEffect(() => {
    basket.filter(el => el.id === item.id).length ? setInBasket(true) : setInBasket(false)
  }, [basket, item.id])


  return (
    <div className={styles.item}>
      <NavLink to={`/item/${translit(item.name)}`} state={item}>
        <img src={`${process.env.REACT_APP_IMG_URL}${item.image}`} alt={item.name} />
      </NavLink>
      <p className={styles.price}>{addSpace(item.price.toString())} ₽</p>
      <NavLink to={`/item/${translit(item.name)}`} state={item}>
        <p className={styles.name}>{item.name}, <span>{propWeight.length && propWeight[0].value} г</span></p>
      </NavLink>
      {propAge.length && <p className={styles.age}>{propAge[0].value} {sklonenie(+propAge[0].value, ageVariants)}</p>}
      {
        propStop.length && (propStop[0].value === 'true' ? true : false) ?
          <div className={styles.btnNo}>Товар закончился</div>
          :
          <button className={inBasket ? styles.btnIn : styles.btnOk} onClick={inBasket ? () => { } : appendToBasketFn}>{inBasket ? 'В корзине' : 'В корзину'}</button>
      }
    </div>
  )
}

export default Item