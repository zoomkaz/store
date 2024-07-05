import React from 'react'
import styles from './Error.module.scss'
import Container from '../../UI/container/Container'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className={styles.error}>
      <Container>
        <div className={styles.info}>
          <p>Ничего не найдено...</p>
          <Link to={'/'}><button>На главную</button></Link>
        </div>
      </Container>
    </div>
  )
}

export default Error