import React, { ChangeEvent, useEffect, useState } from 'react'
import styles from './Order.module.scss'
import Container from '../../UI/container/Container'
import { Link } from 'react-router-dom'
import empty from '../../assets/icons/empty.svg'
import { getBasket } from '../../redux/selectors/basket.selector'
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks'
import { ICdekCity, IProduct } from '../../types/types'
import { addSpace } from '../../func/addSpace'
import { clearBasket, decrementToBasket, incrementToBasket, removeFromBasket, setToBasket } from '../../services/BasketService'
import { setBasket } from '../../redux/slices/BasketSlice'
import Autocomplete from '../../UI/autocomplete/Autocomplete'
import fullCitiesRow from '../../data/rowCities.json'
import Modal from '../../UI/modal/Modal'
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps'
import { GetAllCitiesMethod, GetAllPointsMethod } from '../../services/GeoService'
import { CreateOrderMethod } from '../../services/OrderService'
import created from '../../assets/icons/created.svg'

const Order = () => {
  const basket = useAppSelector(getBasket);
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let temp = basket.reduce((prev, cur) => +prev + (+cur.price * +cur.quantity), 0)
    setTotal(+temp)
  }, [basket])

  useEffect(() => {
    let temp = basket.reduce((prev, cur) => +prev + (+cur.price * +cur.quantity), 0)
    setTotal(+temp)
  }, [basket])

  const changeCount = (char: '+' | '-', item: IProduct) => {
    const inp = document.getElementById(`inp-${item.id}`) || document.createElement("input");
    if ((inp as HTMLInputElement).value === '') (inp as HTMLInputElement).value = '1';
    if (char === '+') {
      if (+(inp as HTMLInputElement).value < 99) {
        (inp as HTMLInputElement).value = (+(inp as HTMLInputElement).value + 1).toString()
        IncrementToBasketFn(item, 1)
      }
    } else {
      if (+(inp as HTMLInputElement).value <= 1) {
      }
      else {
        (inp as HTMLInputElement).value = (+(inp as HTMLInputElement).value - 1).toString()
        DecrementToBasketFn(item, 1)
      }
    }
  }

  const changeInputCount = (e: ChangeEvent<HTMLInputElement>, item: IProduct) => {
    const inp = document.getElementById(`inp-${item.id}`) || document.createElement("input");
    if (isNaN(Number(+e.target.value))) return
    if (+e.target.value === 0) {
      (inp as HTMLInputElement).value = ''
      setToBasketFn(item, 1)
    }
    else if (+e.target.value >= 99) {
      (inp as HTMLInputElement).value = '99'
      setToBasketFn(item, 99)
    } else {
      (inp as HTMLInputElement).value = e.target.value
      setToBasketFn(item, +e.target.value)
    }
  }

  const checkValue = (item: IProduct) => {
    const inp = document.getElementById(`inp-${item.id}`) || document.createElement("input");
    (inp as HTMLInputElement).value === '' ? (inp as HTMLInputElement).value = '1' : <></>
  }

  const dispatch = useAppDispatch();

  const setToBasketFn = async (item: IProduct, amount: number) => {
    const data = await dispatch(setToBasket({ id: item.id, amount: amount })).unwrap()
    if (data) {
      dispatch(setBasket(data))
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

  const RemoveFromBasketFn = async (item: IProduct) => {
    const data = await dispatch(removeFromBasket({ id: item.id })).unwrap()
    if (data) {
      dispatch(setBasket(data))
    }
  }

  const ClearBasketFn = async () => {
    const data = await dispatch(clearBasket()).unwrap()
    if (data) {
      dispatch(setBasket(data))
    }
  }

  // FORMS FORMS FORMS

  const [validPhone, setValidPhone] = useState('+7 (')
  const [validFirstName, setValidFirstName] = useState('')
  const [validLastName, setValidLastName] = useState('')
  const [validEmail, setValidEmail] = useState('')
  const [validAdress, setValidAdress] = useState('')

  const [errorFirstName, setErrorFirstName] = useState('')
  const [errorLastName, setErrorLastName] = useState('')
  const [errorPhone, setErrorPhone] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorCity, setErrorCity] = useState('')
  const [errorAdress, setErrorAdress] = useState('')

  const validateFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let error;
    if (!value) {
      error = 'Обязательное поле';
      setErrorFirstName(error)
    } else if (!/^[а-яА-ЯёЁa-zA-Z]+$/i.test(value)) {
      error = 'Имя должно состоять только из букв';
      setErrorFirstName(error)
    } else if (value.length < 2) {
      error = 'Имя должно быть больше одной буквы';
      setErrorFirstName(error)
    } else {
      setErrorFirstName('')
      setValidFirstName(value)
    }
  }

  const validateLastName = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let error;
    if (!value) {
      setErrorLastName('')
      setValidLastName('')
      return
    }
    if (!/^[а-яА-ЯёЁa-zA-Z]+$/i.test(value)) {
      error = 'Фамилия должна состоять только из букв';
      setErrorLastName(error)
    } else if (value.length < 2) {
      error = 'Фамилия должна быть больше одной буквы';
      setErrorLastName(error)
    } else {
      setErrorLastName('')
      setValidLastName(value)
    }
  }

  const checkValidatePhone = (e: ChangeEvent<HTMLInputElement>, focus?: boolean) => {
    const inp = (document.getElementById("phone") as HTMLInputElement) ?? document.createElement("input");
    inp.selectionStart = inp.value.length
    inp.selectionEnd = inp.value.length
    inp.setSelectionRange(inp.value.length, inp.value.length)
    validatePhone(e, focus);
  }

  const validatePhone = (e: ChangeEvent<HTMLInputElement>, focus?: boolean) => {
    let value = e.target.value;
    let error;
    if (e.target.value.length > 18) {
      e.target.value = e.target.value.slice(0, 18)
    }
    if (!value) {
      error = 'Обязательное поле';
      setErrorPhone(error)
    }
    if (!/(\+7|8)\s?[(]\d{3}[)]\s?\d{3}[\s?|-]\d{2}[\s?|-]\d{2}/gi.test(value)) {
      error = 'Некорректный номер телефона';
      setErrorPhone(error)
    }
    if ((focus && !value) || !value) {
      e.target.value = `+7 (`
    } else if (value === `+7 `) {
      e.target.value = `+7 (`
    } else if (focus === false && value === `+7 (`) {
      e.target.value = '';
      error = 'Обязательное поле';
      setErrorPhone(error)
    } else if (focus === false && !validPhone && value !== `+7 (`) {
      e.target.value = '';
      error = 'Обязательное поле';
      setErrorPhone(error)
    } else {
      if (!e.target.value.startsWith(`+7 (`)) {
        e.target.value = `+7 (`
      }
      //@ts-ignore
      if ((!/^\d+$/gi.test(+e.nativeEvent.data) || e.nativeEvent.data === ' ') && e.nativeEvent.data) {
        e.target.value = e.target.value.slice(0, e.target.value.length - 1)
        return
      }
      //@ts-ignore
      if (value.length === 7 && e.nativeEvent.inputType !== 'deleteContentBackward') {
        let firstPart = value.slice(0, 7)
        let lastPart = value.slice(7)
        e.target.value = `${firstPart}) ${lastPart}`
      }
      //@ts-ignore
      if (value.length === 8 && e.nativeEvent.inputType === 'deleteContentBackward') {
        e.target.value = value.slice(0, 6)
      }
      //@ts-ignore
      if (value.length === 12 && e.nativeEvent.inputType !== 'deleteContentBackward') {
        let firstPart = value.slice(0, 12)
        let lastPart = value.slice(12)
        e.target.value = `${firstPart}-${lastPart}`
      }
      //@ts-ignore
      if (value.length === 12 && e.nativeEvent.inputType === 'deleteContentBackward') {
        e.target.value = value.slice(0, 11)
      }
      //@ts-ignore
      if (value.length === 15 && e.nativeEvent.inputType !== 'deleteContentBackward') {
        let firstPart = value.slice(0, 15)
        let lastPart = value.slice(15)
        e.target.value = `${firstPart}-${lastPart}`
      }
      //@ts-ignore
      if (value.length === 15 && e.nativeEvent.inputType === 'deleteContentBackward') {
        e.target.value = value.slice(0, 14)
      }
      if (/(\+7|8)\s?[(]\d{3}[)]\s?\d{3}[\s?|-]\d{2}[\s?|-]\d{2}/gi.test(value)) {
        setErrorPhone('')
        setValidPhone(value)
      }
    }
  }

  const validateEmail = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let error;
    if (!value) {
      error = 'Обязательное поле';
      setErrorEmail(error)
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Некорректный e-mail адрес';
      setErrorEmail(error)
    } else {
      setErrorEmail('')
      setValidEmail(value)
    }
  }

  const validateAdress = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let error;
    if (!value) {
      error = 'Обязательное поле';
      setErrorAdress(error)
    } else {
      setErrorAdress('')
      setValidAdress(value)
    }
  }

  const fullCities = fullCitiesRow.map(el => el.city)
  const [searchValue, setSearchValue] = useState('');
  const [city, setCity] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false);
  const [cityStored, setCityStored] = useState('');

  useEffect(() => {
    const city = localStorage.getItem("city") ?? '';
    city ? setCityStored(city) : setCityStored('')
  }, [])

  const inpCity = (document.getElementById('city') as HTMLInputElement) ?? document.createElement("input");

  useEffect(() => {
    if (city) {
      inpCity.value = city
    }
  }, [city, inpCity])

  const validateCity = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let error;
    if (!value) {
      error = 'Обязательное поле';
      setErrorCity(error)
      setSearchValue('')
      setCity('')
    } else {
      setErrorCity('')
      setSearchValue(value)
      setCity(value)
    }
  }

  const [deliveryWay, setDeliveryWay] = useState<'courier' | 'pickup' | 'mail'>()

  const changeDelivery = (way: 'courier' | 'pickup' | 'mail') => {
    if (way === 'mail') setPayOption('online')
    setDeliveryWay(way)
  }

  // FORMS FORMS FORMS

  const [showPickupModal, setShowPickupModal] = useState(false)

  const images = [...Array(10)].map((n, i) => {
    const letter = String.fromCharCode(i + 97);
    return `https://img.icons8.com/ios-filled/2x/marker-${letter}.png`;
  });

  const [cdekAllCities, setCdekAllCities] = useState<ICdekCity[]>([])

  const getAllCities = async () => {
    const data = await GetAllCitiesMethod()
    if (data.status === 200) {
      setCdekAllCities(data.data)
    }
  }

  useEffect(() => {
    getAllCities()
  }, [])

  const [cdekCurrentCity, setCdekCurrentCity] = useState<ICdekCity>()

  useEffect(() => {
    if (!city) {
      const newCity = localStorage.getItem("city") ?? '';
      const findCity = cdekAllCities.filter(c => c.city === newCity)
      if (findCity?.length) {
        setCdekCurrentCity(findCity[0])
      }
    } else {
      const findCity = cdekAllCities.filter(c => c.city === city)
      if (findCity?.length) {
        setCdekCurrentCity(findCity[0])
      }
    }
  }, [cdekAllCities, city])

  // NEED FIX API
  const [allPoints, setAllPoints] = useState<any[]>([])

  const getAllPoints = async (code: number) => {
    const data = await GetAllPointsMethod(code)
    // console.log(data);
    if (data.status === 200) {
      setAllPoints(data.data)
    }
  }

  useEffect(() => {
    if (cdekCurrentCity) {
      getAllPoints(cdekCurrentCity.code)
    }
  }, [cdekCurrentCity])

  const pickupModal = <div className={styles.pickupModal}>
    <h2>Выбор варианта самовывоза</h2>
    <div className={styles.pickupModalContent}>
      <div className={styles.mapSide}>
        {/* <span> </span> */}
        <YMaps
          query={{
            load: "package.full",
            apikey: process.env.REACT_APP_Y_API_KEY
          }}
        >
          <div className={styles.mapWr}>
            <Map
              state={{ center: cdekCurrentCity ? [cdekCurrentCity.latitude, cdekCurrentCity.longitude] : [55.75, 37.57], zoom: 9, controls: ["zoomControl"], }}
              width="100%"
              height="100%"
            >
              {/* NEED FIX API */}
              {images.map((n, i) => {
                return (
                  <Placemark
                    onClick={() => {
                      alert("Вы нажали метку " + (i + 1));
                      console.log(n, i);

                    }}
                    key={n}
                    defaultGeometry={[55.75, 37.57].map((c) => c + (Math.random() - 0.5))}
                    options={{
                      iconImageSize: [10, 10],
                      preset: "islands#blueDotIcon"
                    }}
                  />
                );
              })}
            </Map>
          </div>
        </YMaps>
      </div>
      <div className={styles.listSide}>
        {
          images.map((el, index) => {
            return <div key={index}>
              <img src={el} alt="point" />
            </div>
          })
        }
      </div>
    </div>
  </div >

  const [payOption, setPayOption] = useState<'online' | 'cardOrCash'>()

  const changePay = (option: 'online' | 'cardOrCash') => {
    setPayOption(option)
  }

  const [confirm, setConfirm] = useState<'yes' | 'no'>('no')
  const [comment, setComment] = useState('')

  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (
      payOption &&
      deliveryWay &&
      (city ? city : localStorage.getItem("city")) &&
      validAdress &&
      validEmail &&
      validFirstName &&
      validPhone &&
      !errorFirstName &&
      !errorLastName &&
      !errorPhone &&
      !errorEmail &&
      !errorCity &&
      !errorAdress
    ) {
      setOk(true)
    } else {
      setOk(false)
    }
  }, [
    city,
    deliveryWay,
    errorAdress,
    errorCity,
    errorEmail,
    errorFirstName,
    errorLastName,
    errorPhone,
    payOption,
    validAdress,
    validEmail,
    validFirstName,
    validPhone
  ])

  const createOrder = async () => {
    const token = localStorage.getItem("token");
    if (payOption === 'online') {

    }
    else {
      if (token && deliveryWay && payOption) {
        const data = await CreateOrderMethod(
          'user',
          validFirstName,
          validLastName,
          validEmail,
          validPhone,
          validAdress,
          deliveryWay,
          payOption,
          confirm === 'yes' ? true : false,
          comment
        );
        if (data.status === 200) {
          setBasket([])
          setOrderCreated(true)
        }
      } else if (deliveryWay && payOption) {
        const data = await CreateOrderMethod(
          'guest',
          validFirstName,
          validLastName,
          validEmail,
          validPhone,
          validAdress,
          deliveryWay,
          payOption,
          confirm === 'yes' ? true : false,
          comment
        );
        if (data.status === 200) {
          setBasket([])
          setOrderCreated(true)
        }
      }
    }
  }

  const [orderCreated, setOrderCreated] = useState(false)
  const token = localStorage.getItem("token");

  const createdModal = <div className={styles.createdModal}>
    <h2>Заказ успешно оформлен</h2>
    <img src={created} alt="created" />
    <button
      onClick={() => token ? window.location.href = '/my/orders' : window.location.href = '/'}
    >
      {token ? 'Перейти на страницу заказов' : 'На главную'}
    </button>
  </div>

  const checkErrors = () => {
    !validFirstName ? setErrorFirstName('Обязательное поле') : <></>
    !/(\+7|8)\s?[(]\d{3}[)]\s?\d{3}[\s?|-]\d{2}[\s?|-]\d{2}/gi.test(validPhone) ? setErrorPhone('Некорректный номер телефона') : <></>
    !validEmail ? setErrorEmail('Обязательное поле') : <></>
    (!city || !cityStored) ? setErrorCity('Обязательное поле') : <></>
    !validAdress ? setErrorAdress('Обязательное поле') : <></>
    window.scroll({ top: 0 })
  }

  return (
    <Container>
      <div className={styles.order}>
        {
          basket.length ?
            <div className={styles.orderContainer}>
              <div className={styles.basketSide}>
                <div className={styles.head}>
                  <h2>Корзина</h2>
                  <h5 className={styles.clear} onClick={ClearBasketFn}>Удалить всё</h5>
                </div>
                <div className={styles.basketContent}>
                  {
                    basket.map((el, index) => {
                      return <div className={styles.item} key={index}>
                        <div className={styles.imageSide}>
                          <img src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="product" />
                        </div>
                        <div className={styles.descSide}>
                          <div className={styles.top}>
                            <p className={styles.name}>{el.name}</p>
                            <p className={styles.delete} onClick={() => RemoveFromBasketFn(el)}>Удалить</p>
                          </div>
                          <div className={styles.bottom}>
                            <div className={styles.inputBtns}>
                              <button className={styles.plus} onClick={() => changeCount('+', el)}>+</button>
                              <input
                                type="text"
                                id={`inp-${el.id}`}
                                defaultValue={el.quantity}
                                onChange={(e) => changeInputCount(e, el)}
                                onBlur={() => checkValue(el)}
                              />
                              <button className={styles.minus} onClick={() => changeCount('-', el)}>-</button>
                            </div>
                            <span>{addSpace((el.price).toString())} ₽ / шт.</span>
                            <p>{addSpace((+el.price * +el.quantity).toString())} ₽</p>
                          </div>
                        </div>
                      </div>
                    })
                  }
                </div>
                <div className={styles.headB}>
                  <h2>Итого</h2>
                  <h3>{addSpace(total.toString())} ₽</h3>
                </div>
              </div>
              <div className={styles.orderSide}>
                <div className={styles.head}>
                  <h2>Оформление</h2>
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoContainer}>
                    <h3 className={styles.infoTitle}>Покупатель</h3>
                    <form className={styles.form}>
                      <div className={styles.formOption}>
                        <label htmlFor="firstName">Имя *</label>
                        <input
                          id="firstName"
                          name="firstName"
                          placeholder="firstName"
                          onChange={(e) => validateFirstName(e)}
                          onFocus={(e) => validateFirstName(e)}
                        />
                        {errorFirstName && <div className={styles.formError}>{errorFirstName}</div>}
                      </div>
                      <div className={styles.formOption}>
                        <label htmlFor="lastName">Фамилия</label>
                        <input
                          id="lastName"
                          name="lastName"
                          placeholder="Фамилия"
                          onChange={(e) => validateLastName(e)}
                          onFocus={(e) => validateLastName(e)}
                        />
                        {errorLastName && <div className={styles.formError}>{errorLastName}</div>}
                      </div>
                      <div className={styles.formOption}>
                        <label htmlFor="phone">Телефон *</label>
                        <input
                          id="phone"
                          name="phone"
                          placeholder="+7 (___) __-___-__"
                          onChange={(e) => checkValidatePhone(e)}
                          onFocus={(e) => checkValidatePhone(e, true)}
                          onBlur={(e) => checkValidatePhone(e, false)}
                          onClick={(e: any) => checkValidatePhone(e)}
                        />
                        {errorPhone && <div className={styles.formError}>{errorPhone}</div>}
                      </div>
                      <div className={styles.formOption}>
                        <label htmlFor="email">E-mail *</label>
                        <input
                          id="email"
                          name="email"
                          placeholder="E-mail"
                          onChange={(e) => validateEmail(e)}
                          onFocus={(e) => validateEmail(e)}
                        />
                        {errorEmail && <div className={styles.formError}>{errorEmail}</div>}
                      </div>
                    </form>
                    {/* <button type='submit'>Submit</button> */}
                  </div>
                  <div className={styles.infoContainer}>
                    <h3 className={styles.infoTitle}>Доставка</h3>
                    <form className={styles.form}>
                      <div className={styles.formOption}>
                        <label htmlFor="city">Город *</label>
                        <input
                          id='city'
                          name='city'
                          type="text"
                          placeholder='Введите название Вашего города'
                          onChange={(e) => validateCity(e)}
                          defaultValue={cityStored}
                        />
                        <div className={styles.autocompleteContainer}>
                          {searchValue && <Autocomplete
                            searchValue={searchValue}
                            searchList={fullCities}
                            setValue={setCity}
                            setSearchValue={setSearchValue}
                            tag={'city'}
                            setShowModal={setShowModal}
                          />}
                        </div>
                        {errorCity && <div className={styles.formError}>{errorCity}</div>}
                      </div>
                    </form>
                    <div className={styles.changeOption}>
                      <div
                        className={deliveryWay === 'courier' ? styles.changeBoxActive : styles.changeBox}
                        onClick={() => changeDelivery('courier')}
                      >
                        <p>Курьер</p>
                        <p>500 ₽</p>
                        <p>от 30 июня</p>
                      </div>
                      <div
                        className={deliveryWay === 'pickup' ? styles.changeBoxActive : styles.changeBox}
                        onClick={() => changeDelivery('pickup')}
                      >
                        <p>Пункт выдачи</p>
                        <p>300 ₽</p>
                        <p>от 30 июня</p>
                      </div>
                      <div
                        className={deliveryWay === 'mail' ? styles.changeBoxActive : styles.changeBox}
                        onClick={() => changeDelivery('mail')}>
                        <p>Почта</p>
                        <p>Бесплатно</p>
                        <p>от 28 июня</p>
                      </div>
                    </div>
                    {
                      deliveryWay && (
                        deliveryWay === 'courier' || deliveryWay === 'mail' ?
                          <div className={styles.courierContainer}>
                            <div className={styles.courierinfo}>
                              <div className={styles.row}>
                                <p>Стоимость доставки</p>
                                <p>Примерная дата доставки</p>
                                <p>Способ доставки</p>
                              </div>
                              <div className={styles.row}>
                                <p><span>{deliveryWay === 'mail' ? 'Бесплатно' : '500 ₽'}</span></p>
                                <p>30 июня</p>
                                <p>{deliveryWay === 'mail' ? 'Почта России' : 'СДЭК'}</p>
                              </div>
                            </div>
                            <div className={styles.inputContainer}>
                              <label htmlFor="adress">Улица, дом, квартира *</label>
                              <input
                                id="adress"
                                name="adress"
                                placeholder="Улица, дом, квартира"
                                onChange={(e) => validateAdress(e)}
                                onFocus={(e) => validateAdress(e)}
                              />
                              {errorAdress && <div className={styles.formError}>{errorAdress}</div>}
                            </div>
                          </div>
                          : deliveryWay === 'pickup' ?
                            <div className={styles.pickupContainer}>
                              <p>Варианты пунктов самовывоза</p>
                              <button onClick={() => setShowPickupModal(true)}>
                                Выберите пункт самовывоза
                                <span className={styles.arr} style={showPickupModal ? { transform: 'scaleY(-1)' } : {}}></span>
                              </button>
                            </div>
                            :
                            <></>
                      )
                    }
                  </div>
                  {
                    deliveryWay && (
                      <div className={styles.infoContainer}>
                        <h3 className={styles.infoTitle}>Оплата</h3>
                        <div className={styles.changeOption}>
                          <div
                            className={payOption === 'online' ? styles.changeBoxActive : styles.changeBox}
                            onClick={() => changePay('online')}>
                            <p>Онлайн</p>
                            <p>+100 бонусов при оплате заказа на сайте</p>
                          </div>
                          {
                            deliveryWay !== 'mail' ?
                              <div
                                className={payOption === 'cardOrCash' ? styles.changeBoxActive : styles.changeBox}
                                onClick={() => changePay('cardOrCash')}>
                                <p>При получении</p>
                                <p>Картой или наличными</p>
                              </div>
                              :
                              <></>
                          }
                        </div>
                        {
                          payOption === 'online' ?
                            <div className={styles.payOptionInfo}>
                              <p>+100 бонусов при оплате заказа онлайн</p>
                              <p>После нажатия кнопки "ПОДТВЕРДИТЬ ЗАКАЗ", вас автоматически перенаправит на страницу безопасной оплаты.</p>
                            </div>
                            :
                            <div className={styles.payOptionInfo}>
                              <p>Оплата наличными или картой при получении</p>
                              <p style={{ display: 'none' }}></p>
                            </div>
                        }
                      </div>
                    )
                  }
                  {
                    payOption && (
                      <div className={styles.confirmContainer}>
                        <h3 className={styles.infoTitle}>Подтверждение</h3>
                        <div className={styles.payOptionInfo}>
                          <p>Вам позвонить для подтверждения заказа ?</p>
                          <p style={{ display: 'none' }}></p>
                          <div className={styles.radioContainer}>
                            <label htmlFor="yes">
                              <input type="radio" name="confirm" id="yes" value='yes' onChange={() => setConfirm('yes')} />
                              <span>Да.</span> У меня есть вопросы по заказу.
                            </label>
                            <label htmlFor="no">
                              <input type="radio" name="confirm" id="no" value='no' defaultChecked onChange={() => setConfirm('no')} />
                              <span>Нет.</span> Звоните только по необходимости.
                            </label>
                          </div>
                        </div>
                        <h3 className={styles.infoTitle}>Комментарий к заказу</h3>
                        <textarea name="" id="" onChange={(e) => setComment(e.target.value)}></textarea>
                      </div>
                    )
                  }
                </div>
                <div className={styles.headBLast}>
                  <div className={styles.row}>
                    <p>Стоимость товаров</p>
                    <p>{addSpace(total.toString())} ₽</p>
                  </div>
                  <div className={styles.row}>
                    <p>Стоимость доставки</p>
                    <p>{deliveryWay === 'courier' ? '500 ₽' : deliveryWay === 'pickup' ? '300 ₽' : 'Бесплатно'}</p>
                  </div>
                  <div className={styles.row}>
                    <h2>Итого</h2>
                    <h3>{addSpace((+total + (deliveryWay === 'courier' ? 500 : deliveryWay === 'pickup' ? 300 : 0)).toString())} ₽</h3>
                    <button
                      className={ok ? styles.btnOk : styles.btnDis}
                      onClick={() => ok ? createOrder() : checkErrors()}
                    >
                      {ok ? 'Подтвердить заказ' : 'Заполните все обязательные поля'}
                    </button>
                  </div>
                  <p className={styles.warn}>Оформляя заказ, вы подтверждаете свое совершеннолетие и соглашаетесь с нашими <a href="/">условиями обработки персональных данных</a></p>
                </div>
              </div>
            </div>
            :
            <div className={styles.empty}>
              <img src={empty} alt="empty" />
              <h1>Ваша корзина пуста</h1>
              <Link to={'/'}><button>Перейти на главную страницу</button></Link>
            </div>
        }
      </div>
      <Modal
        showModal={showPickupModal}
        setShowModal={setShowPickupModal}
      >
        {pickupModal}
      </Modal>
      <Modal
        showModal={orderCreated}
        setShowModal={setOrderCreated}
      >
        {createdModal}
      </Modal>
    </Container>
  )
}

export default Order