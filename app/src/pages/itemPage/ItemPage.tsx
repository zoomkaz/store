import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from './ItemPage.module.scss'
import { Link, useLocation } from 'react-router-dom';
import { IProduct } from '../../types/types';
import Container from '../../UI/container/Container';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { sklonenie } from '../../func/sklonenie';
import { addSpace } from '../../func/addSpace';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/thumbs';
import 'swiper/scss/free-mode';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { appendToBasket, decrementToBasket, incrementToBasket } from '../../services/BasketService';
import { setBasket } from '../../redux/slices/BasketSlice';
import { getBasket } from '../../redux/selectors/basket.selector';

const ItemPage = () => {

  const state: IProduct = useLocation().state;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) {
      document.location.href = '/404'
    } else {
      setLoading(false)
    }
  }, [state])

  const ageVariants = ['год', 'года', 'лет']

  const propWeight = state.props.filter(pr => pr.name === 'weight')
  const propAge = state.props.filter(pr => pr.name === 'age')
  const propColor = state.props.filter(pr => pr.name === 'color')
  const propStop = state.props.filter(pr => pr.name === 'stop')

  const [countItems, setCountItems] = useState<number | ''>(1)

  const [inBasket, setInBasket] = useState(false)
  const basket = useAppSelector(getBasket);

  useEffect(() => {
    basket.filter(el => el.id === state.id).length ? setInBasket(true) : setInBasket(false)
  }, [basket, state.id])

  const changeCount = (char: '+' | '-') => {
    if (countItems === '') setCountItems(1)
    if (char === '+') {
      if (+countItems < 99) {
        setCountItems(+countItems + 1)
        IncrementToBasketFn(state, 1)
      }
    } else {
      if (+countItems <= 1) {
      } else {
        setCountItems(+countItems - 1)
        DecrementToBasketFn(state, 1)
      }
    }
  }

  const changeInputCount = (e: ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(+e.target.value))) return
    if (+e.target.value === 0) {
      setCountItems('')
    } else if (+e.target.value >= 99) {
      setCountItems(99)
    } else {
      setCountItems(+e.target.value)
    }
  }

  const checkValue = () => {
    countItems === '' ? setCountItems(1) : <></>
  }

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();

  const dispatch = useAppDispatch();

  const appendToBasketFn = async (item: IProduct, amount: number) => {
    const data = await dispatch(appendToBasket({ id: item.id, amount: amount ?? 1 })).unwrap()
    if (data) {
      dispatch(setBasket(data))
      setInBasket(true)
    }
  }

  const IncrementToBasketFn = async (item: IProduct, amount: number) => {
    const data = await dispatch(incrementToBasket({ id: item.id, amount: amount })).unwrap()
    if (data) {
      dispatch(setBasket(data))
    }
  }
  const DecrementToBasketFn = async (item: IProduct, amount: number) => {
    const data = await dispatch(decrementToBasket({ id: item.id, amount: amount })).unwrap()
    if (data) {
      dispatch(setBasket(data))
    }
  }

  return (
    <div className={styles.itemPage}>
      {loading ?
        <Container className={styles.skeletonContainer}>
          <div className={styles.skeletonBlock1}>
            <Skeleton height={615} baseColor={'#ffc85e30'} highlightColor={'#ffb52140'} borderRadius={'8px'} />
          </div>
          <div className={styles.skeletonBlock2}>
            <div style={{ marginBottom: '10px' }}>
              <Skeleton height={150} baseColor={'#ffc85e30'} highlightColor={'#ffb52140'} borderRadius={'8px'} />
            </div>
            <div>
              <Skeleton height={450} baseColor={'#ffc85e30'} highlightColor={'#ffb52140'} borderRadius={'8px'} />
            </div>
          </div>
        </Container>
        :
        <Container>
          <div className={styles.itemPageContainer}>
            <h2><span><Link to={'/'}>Главная</Link></span><span>—</span>{state.name}</h2>
            <div className={styles.itemPageBox}>
              <div className={styles.imageSide}>
                <div className={styles.swiperContainer}>
                  <Swiper
                    className={styles.mySwiper}
                    spaceBetween={10}
                    navigation={true}
                    style={{
                      //@ts-ignore
                      '--swiper-navigation-color': '#ffc85e',
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                  >
                    <SwiperSlide className={styles.slide}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                  </Swiper>
                  <Swiper
                    direction={'vertical'}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={styles.mySwiper2}
                    pagination={{
                      clickable: true,
                    }}
                  >
                    <SwiperSlide className={styles.slide2}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide2}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide2}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide2}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide2}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${state.image}`} alt="product" />
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
              <div className={styles.descriptionSide}>
                <div className={styles.descriptionItem}>
                  <img src={`${process.env.REACT_APP_IMG_URL}${state.brand.image}`} alt="" />
                  <p>Бренд - <span>{state.brand.name}</span></p>
                </div>
                <h4>Характеристики</h4>
                <div className={styles.descriptionItem}>
                  <p>Вес - <span>{propWeight.length && +propWeight[0].value} г</span></p>
                </div>
                <div className={styles.descriptionItem}>
                  <p>Цвет - <span>{propColor.length && propColor[0].value}</span></p>
                </div>
                <div className={styles.descriptionItem}>
                  <p>Возраст - <span>{propAge.length && propAge[0].value} {sklonenie(+propAge[0].value, ageVariants)}</span></p>
                </div>
              </div>
              <div className={styles.orderSide}>
                <div className={styles.orderCalc}>
                  <div className={styles.bonus}>
                    <span>{parseFloat((+state.price * 10 / 100).toString())} баллов</span>
                  </div>
                  <p>{addSpace(state.price.toString())} ₽</p>
                  <div className={styles.btnsContainer} style={propStop.length && propStop[0].value === 'true' ? { display: "none" } : { display: 'flex' }}>
                    <div className={styles.inputBtns} style={inBasket ? { display: "none" } : { display: "flex" }}>
                      <button className={styles.plus} onClick={() => changeCount('+')}>+</button>
                      <input type="text" value={countItems} onChange={(e) => changeInputCount(e)} onBlur={checkValue} />
                      <button className={styles.minus} onClick={() => changeCount('-')}>-</button>
                    </div>
                    <button
                      className={inBasket ? styles.btnIn : styles.toBasket}
                      onClick={inBasket ? () => { } : () => appendToBasketFn(state, +countItems)}
                    >
                      {inBasket ? 'В корзине' : 'В корзину'}
                    </button>
                  </div>
                  {
                    propStop.length && propStop[0].value === 'true' ?
                      <div className={styles.btnDis}>Товар закончился</div>
                      :
                      <button className={styles.toBuy}>Купить в один клик</button>
                  }
                </div>
                <div className={styles.deliveryInfo} style={propStop.length && propStop[0].value === 'true' ? { display: "none" } : { display: 'flex' }}>
                  <p>Информация о доставке</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      }
    </div>
  )
}

export default ItemPage