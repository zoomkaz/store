import React, { useEffect, useState } from 'react'
import styles from './Profile.module.scss'
import Container from '../../UI/container/Container'
import { CheckAuthMethod } from '../../services/UserService'
import { jwtDecode } from 'jwt-decode'
import Skeleton from 'react-loading-skeleton'
import { UserCheckData } from '../../types/types'
import { Link } from 'react-router-dom'

interface ProfilePropsType {
  children: JSX.Element;
}

const Profile = ({ children }: ProfilePropsType) => {

  const [isAuth, setIsAuth] = useState(false)
  const [profile, setProfile] = useState<UserCheckData | null>(null)
  const token = localStorage.getItem("token") ?? '';

  const checkAuth = async () => {
    let userToken, userData: UserCheckData
    try {
      userToken = localStorage.getItem('token')
      // если в хранилище нет действительного токена
      if (!userToken) {
        setIsAuth(false)
        window.location.href = '/';
        return false
      }
      // токен есть, надо проверить его подлинность
      const response = await CheckAuthMethod()
      userToken = response.data.token
      userData = jwtDecode(userToken)
      localStorage.setItem('token', userToken)
      setIsAuth(true)
      setProfile(userData)
    } catch (e) {
      localStorage.removeItem('token')
      setIsAuth(false)
      window.location.href = '/';
      return false
    }
  }

  useEffect(() => {
    checkAuth()
  }, [token])

  useEffect(() => {
    if (!isAuth) return
  }, [isAuth])

  const [activeNav, setActiveNav] = useState('profile')

  useEffect(() => {
    const activePath = window.location.pathname.split('/')[2]
    setActiveNav(activePath)
  }, [window.location.pathname])


  return (
    <div className={styles.profile}>
      {!isAuth ?
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
        profile ?
          <Container>
            <div className={styles.content}>
              <h2><span><Link to={'/'}>Главная</Link></span><span>—</span>Мой профиль</h2>
              <div className={styles.profileContainer}>
                <div className={styles.profileNav}>
                  <h3>Личный кабинет</h3>
                  <Link to={'/my/profile'}><p className={activeNav === 'profile' ? styles.active : ''}>Мой профиль</p></Link>
                  <Link to={'/my/orders'}><p className={activeNav === 'orders' ? styles.active : ''}>Мои заказы</p></Link>
                  <Link to={'/my/partner'}><p className={activeNav === 'partner' ? styles.active : ''}>Партнерская программа</p></Link>
                  <p>Выход</p>
                </div>
                <div className={styles.profileContent}>
                  {children}
                </div>
              </div>
            </div>
          </Container>
          :
          <Container>
            Нет данных о профиле
          </Container>
      }
    </div>
  )
}

export default Profile