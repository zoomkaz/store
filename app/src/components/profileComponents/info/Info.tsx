import React, { useEffect, useState } from 'react'
import styles from './Info.module.scss'
import { CheckAuthMethod } from '../../../services/UserService'
import { jwtDecode } from 'jwt-decode'
import { UserCheckData } from '../../../types/types'

const Info = () => {

  const [userData, setUserData] = useState<UserCheckData | null>(null)

  const getProfileInfo = async () => {
    const data = await CheckAuthMethod()
    if (data.status === 200) {
      let userToken = data.data.token
      let userData = jwtDecode(userToken)
      setUserData(userData as UserCheckData)
    }
  }

  useEffect(() => {
    getProfileInfo()
  }, [])

  return (
    <div className={styles.infoContainer}>
      {
        userData && (
          <div className={styles.userDataContainer}>
            <p>Имя: <span>{userData.email}</span></p>
            <p>E-mail: <span>{userData.email}</span></p>
          </div>
        )
      }
    </div>
  )
}

export default Info