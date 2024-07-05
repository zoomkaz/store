import React, { useEffect, useState } from 'react'
import styles from './Catalog.module.scss'
import Container from '../../UI/container/Container'
import { translit } from '../../func/translite';
import Filter from '../../components/filter/Filter';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import { ICategory, IProduct } from '../../types/types';
import Item from '../../components/item/Item';
import { Link } from 'react-router-dom';
import { GetAllCategoriesMethod } from '../../services/CategoryService';
import { GetAllProductsMethod } from '../../services/ProductService';
import loader from '../../assets/loader.gif'

const Catalog = () => {
  const [items, setItems] = useState<IProduct[]>([])
  const [filteredItems, setFilteredItems] = useState<IProduct[]>([])
  const [currentFilters, setCurrentFilters] = useState<string[]>([])

  const category = window.location.pathname;
  const [loading, setLoading] = useState(true)

  const [allCategories, setAllCategories] = useState<ICategory[]>([])
  const [currentCategory, setCurrentCategory] = useState<ICategory | null>(null)

  const getAllCategories = async () => {
    const data = await GetAllCategoriesMethod()
    if (data.status === 200) {
      setAllCategories(data.data)
      let availableList = data.data.map((el: ICategory) => el.name);
      if (availableList.indexOf(translit(category.split('/')[2], true)) === -1) {
        window.location.href = '/404';
      } else {
        let temp = data.data.filter((el: ICategory) => el.name === translit(category.split('/')[2], true))[0]
        setCurrentCategory(temp)
        setCurrentFilters(temp.filters)
        setLoading(false)
      }
    }
  }

  const getAllProductsByCategory = async (categoryId: number) => {
    const data = await GetAllProductsMethod(categoryId)
    if (data.status === 200) {
      setItems(data.data.rows)
      setFilteredItems(data.data.rows)
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  useEffect(() => {
    if (currentCategory) getAllProductsByCategory(currentCategory.id)
  }, [allCategories, currentCategory])

  const [itemLoading, setItemLoading] = useState(true)

  return (
    <div className={styles.catalog}>
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
          <div className={styles.catalogContainer}>
            <h2><span><Link to={'/'}>Главная</Link></span><span>—</span>{translit(category.split('/')[2], true)}</h2>
            <div className={styles.main}>
              <div className={styles.filterContainer}>
                <Filter
                  setItemLoading={setItemLoading}
                  filters={currentFilters}
                  items={items}
                  setItems={setItems}
                  filteredItems={filteredItems}
                  setFilteredItems={setFilteredItems}
                />
              </div>
              <div className={styles.itemsContainer}>
                {
                  filteredItems.length ?
                    <div className={styles.items}>
                      <div className={styles.itemsLoadingContainer} style={itemLoading ? { display: 'block' } : { display: "none" }}>
                        <div className={styles.loader}>
                          <img src={loader} alt="loader" />
                        </div>
                      </div>
                      {
                        filteredItems.map((el, index) => <Item item={el} key={index} />)
                      }
                    </div>
                    :
                    <div className={styles.noItems}>
                      <h1>По вашему запросу ничего не найдено</h1>
                      <p>Попробуйте изменить критерии подбора товара</p>
                    </div>
                }
              </div>
            </div>
          </div>
        </Container>
      }
    </div>
  )
}

export default Catalog