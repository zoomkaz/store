import React, { ChangeEvent, useEffect, useState, useCallback } from 'react'
import styles from './Header.module.scss'
import { Link, NavLink } from 'react-router-dom'
import Container from '../../UI/container/Container'
import search from '../../../src/assets/icons/search.svg'
import basket from '../../../src/assets/icons/basket.svg'
import profile from '../../../src/assets/icons/profile.svg'
import { GeoMethod } from '../../services/GeoService'
import { IGeo, IProduct } from '../../types/types'
import Modal from '../../UI/modal/Modal'
import Autocomplete from '../../UI/autocomplete/Autocomplete'
import fullCitiesRow from '../../data/rowCities.json'
import { CheckAuthMethod } from '../../services/UserService'
import { jwtDecode } from 'jwt-decode'
import Login from '../auth/Login'
import Signup from '../auth/Signup'
import { GetAllProductsMethod } from '../../services/ProductService'
import { translit } from '../../func/translite'
import loginIcon from '../../assets/icons/login.svg'
import logoutIcon from '../../assets/icons/logout.svg'

const Header = () => {

  const navItems = [
    { name: 'О компании', path: '/' },
    { name: 'Доставка и оплата', path: '/' },
    { name: 'Контакты', path: '/' },
  ]

  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
    const position = Math.ceil(
      (scrollTop / (scrollHeight - clientHeight)) * 100
    );
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    // checkAuth()
    const token = localStorage.getItem("token") ?? ''
    token ? setIsAuth(true) : setIsAuth(false)
  }, [])

  const [userLocation, setUserLocation] = useState<IGeo | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const [cityStored, setCityStored] = useState(false);

  useEffect(() => {
    getAllProducts()
    getUserLocation()
    const city = localStorage.getItem("city") ?? '';
    city ? setCityStored(true) : setCityStored(false)
  }, [])

  const [city, setCity] = useState<string | null>(null)

  const getCity = useCallback(async () => {
    if (!userLocation) return
    const city = await GeoMethod(userLocation.latitude, userLocation.longitude)
    if (city !== 'Нет данных') {
      const selected = localStorage.getItem("city");
      setCity(selected ? selected : city)
    }
  }, [userLocation])

  useEffect(() => {
    getCity()
  }, [getCity])

  const saveCity = (selected: string) => {
    localStorage.setItem("city", selected ? selected : city ?? 'Москва')
    setCity(selected ? selected : city ?? 'Москва')
    setCityStored(true)
    setShowModal(false)
  }

  const [showModal, setShowModal] = useState(false);

  const mainCities = [
    'Москва',
    'Санкт-Петербург',
    'Владивосток',
    'Волгоград',
    'Воронеж',
    'Екатеринбург',
    'Казань',
    'Краснодар',
    'Красноярск',
    'Нижний Новгород',
    'Новосибирск',
    'Омск',
    'Пермь',
    'Ростов-на-Дону',
    'Самара',
    'Саратов',
    'Сочи',
    'Тула',
    'Челябинск',
    'Уфа',
  ]

  const fullCities = fullCitiesRow.map(el => el.city)

  const [searchValue, setSearchValue] = useState('');

  const [currentAuthModal, setCurrentAuthModal] = useState<'login' | 'signup'>('login')
  const [showAuthModal, setShowAuthModal] = useState(false);

  const modalContent = <div className={styles.modalContent}>
    <p>Ваш город: {city ?? 'Москва'}</p>
    <input type="text" placeholder='Введите название Вашего города' onChange={(e) => setSearchValue(e.target.value)} />
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
    <div className={styles.mainCities}>
      {
        mainCities.map((city, index) => <p key={index} onClick={() => saveCity(city)}>{city}</p>)
      }
    </div>
  </div>

  const [isAuth, setIsAuth] = useState(false)

  const checkAuth = async (toProfile: boolean = false) => {
    let userToken, userData
    try {
      userToken = localStorage.getItem('token')
      // если в хранилище нет действительного токена
      if (!userToken) {
        setIsAuth(false)
        setShowAuthModal(true)
        return false
      }
      // токен есть, надо проверить его подлинность
      const response = await CheckAuthMethod()
      userToken = response.data.token
      userData = jwtDecode(userToken)
      localStorage.setItem('token', userToken)
      setIsAuth(true)
      if (toProfile) window.location.href = '/my/profile'
      return userData
    } catch (e) {
      localStorage.removeItem('token')
      setIsAuth(false)
      setShowAuthModal(true)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuth(false)
    window.location.reload()
  }

  const [allProducts, setAllProducts] = useState<IProduct[]>([])

  const getAllProducts = async () => {
    const data = await GetAllProductsMethod()
    if (data.status === 200 && data.data.rows) {
      setAllProducts(data.data.rows)
    }
  }

  const [searchResult, setSearchResult] = useState<IProduct[]>([])
  const [activeHidden, setActiveHidden] = useState(false)

  const searchProduct = (e: ChangeEvent<HTMLInputElement>, hidden?: 'hidden') => {
    if (hidden) { setActiveHidden(true) } else { setActiveHidden(false) }
    if (e.target.value) {
      let result = allProducts.filter(product => product.name.toLowerCase().match(e.target.value)).slice(0, 5);
      setSearchResult(result)
    } else {
      setSearchResult([])
    }
  }

  return (
    <div className={styles.header} onScroll={handleScroll}>
      <Container>
        <div className={styles.headerTop}>
          <div className={styles.connection}>
            <div className={styles.place}>
              <p onClick={() => setShowModal(true)}>{city ? city : 'Москва'}</p>
              <div className={styles.confirmModal} style={cityStored ? { display: 'none' } : { display: 'block' }}>
                <p>Ваш город <span>{city ? city : 'Москва'}</span>?</p>
                <div className={styles.btns}>
                  <button className={styles.btnYes} onClick={() => saveCity(city ?? 'Москва')}>Да</button>
                  <button className={styles.btnNo} onClick={() => setShowModal(true)}>Нет</button>
                </div>
              </div>
            </div>
            <div className={styles.phone}><a href="tel:+7 777 777 77 77">+7 777 777 77 77</a></div>
            <div className={styles.email}><a href="mailto:example@example.ru">example@example.ru</a></div>
          </div>
          <div className={styles.nav}>
            {
              navItems.map((item, index) => {
                return <Link className={styles.navItem} to={item.path} key={index}>{item.name}</Link>
              })
            }
          </div>
        </div>
        <div className={styles.headerBottom}>
          <Link to={'/'}><div className={styles.logo}>Logo</div></Link>
          <div className={styles.searchContainer}>
            <input type="text" placeholder='Поиск' onChange={(e) => searchProduct(e)} />
            <img src={search} className={styles.searchImg} alt="search" />
            <div className={styles.searchResult} style={searchResult.length && !activeHidden ? { display: 'block' } : { display: "none" }}>
              {
                searchResult.length && !activeHidden &&
                searchResult.map((el, index) => {
                  return <NavLink to={`/item/${translit(el.name)}`} state={el} key={index} onClick={() => setSearchResult([])}>
                    <div className={styles.resultItem}>
                      <img src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="productImage" />
                      <p>{el.name}, <span>{el.price}.-</span></p>
                    </div>
                  </NavLink>
                })
              }
            </div>
          </div>
          <div className={styles.icons}>
            {
              isAuth ?
                <div className={styles.authIcons}>
                  <div className={styles.logout}>
                    <img src={logoutIcon} alt="logout" onClick={logout} />
                  </div>
                  <div className={styles.profile}>
                    <img src={profile} alt="profile" onClick={() => checkAuth(true)} />
                  </div>
                </div>
                :
                <div className={styles.authIcons}>
                  <div className={styles.login}>
                    <img src={loginIcon} alt="login" onClick={() => checkAuth()} />
                  </div>
                </div>
            }
            <div className={styles.basket}>
              <Link to={'/order'}><img src={basket} alt="basket" /></Link>
            </div>
          </div>
        </div>
      </Container>
      <div className={styles.hiddenHeader} style={scrollPosition >= 3 ? { top: '0px' } : { top: '-100px' }}>
        <Container>
          <div className={styles.headerBottom}>
            <Link to={'/'}><div className={styles.logo}>Logo</div></Link>
            <div className={styles.searchContainer}>
              <input type="text" placeholder='Поиск' onChange={(e) => searchProduct(e, 'hidden')} />
              <img src={search} className={styles.searchImg} alt="search" />
              <div className={styles.searchResult} style={searchResult.length && activeHidden && scrollPosition >= 3 ? { display: 'block' } : { display: "none" }}>
                {
                  searchResult.length && activeHidden && scrollPosition >= 3 &&
                  searchResult.map((el, index) => {
                    return <NavLink to={`/item/${translit(el.name)}`} state={el} key={index} onClick={() => setSearchResult([])}>
                      <div className={styles.resultItem}>
                        <img src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="productImage" />
                        <p>{el.name}, <span>{el.price}.-</span></p>
                      </div>
                    </NavLink>
                  })
                }
              </div>
            </div>
            <div className={styles.icons}>
              {
                isAuth ?
                  <div className={styles.authIcons}>
                    <div className={styles.logout}>
                      <img src={logoutIcon} alt="logout" onClick={logout} />
                    </div>
                    <div className={styles.profile}>
                      <img src={profile} alt="profile" onClick={() => checkAuth(true)} />
                    </div>
                  </div>
                  :
                  <div className={styles.authIcons}>
                    <div className={styles.login}>
                      <img src={loginIcon} alt="login" onClick={() => checkAuth()} />
                    </div>
                  </div>
              }
              <div className={styles.basket}>
                <Link to={'/order'}><img src={basket} alt="basket" /></Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {modalContent}
      </Modal>
      <Modal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
      >
        {
          currentAuthModal === 'login' ?
            <Login
              setIsAuth={setIsAuth}
              setShowModal={setShowAuthModal}
              setCurrentAuthModal={setCurrentAuthModal}
            />
            :
            <Signup
              setIsAuth={setIsAuth}
              setShowModal={setShowAuthModal}
              setCurrentAuthModal={setCurrentAuthModal}
            />
        }
      </Modal>
    </div>
  )
}

export default Header
