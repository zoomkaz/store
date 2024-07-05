import React, { useEffect, useState } from 'react'
import styles from './Main.module.scss'
import Container from '../../UI/container/Container'
import { Link } from 'react-router-dom'
import { translit } from '../../func/translite'
import { GetAllCategoriesMethod } from '../../services/CategoryService'
import { ICategory } from '../../types/types'

const Main = () => {
  const [categories, setCategories] = useState<ICategory[]>([])

  const getAllCategories = async () => {
    const data = await GetAllCategoriesMethod()
    if (data.status === 200) {
      setCategories(data.data)
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <Container>
      <div className={styles.main}>
        <div className={styles.popular}>
          <h2>Популярные категории</h2>
          <div className={styles.categotyContainer}>
            {
              categories.sort((a, b) => a.id - b.id).map((el, index) => {
                return <Link to={`/category/${translit(el.name)}`} key={index} className={styles.link}>
                  <div className={styles.categoryBox}>
                    <img src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt={el.name} />
                    <p>{el.name}</p>
                  </div>
                </Link>
              })
            }
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Main