import React, { ChangeEvent, useEffect, useState } from 'react'
import Container from '../../UI/container/Container'
import { CheckAuthMethod } from '../../services/UserService'
import { jwtDecode } from 'jwt-decode'
import styles from './Admin.module.scss'
import Skeleton from 'react-loading-skeleton'
import List from '../../UI/list/List'
import { IBrand, ICategory } from '../../types/types'
import { CreateCategoryMethod, GetAllCategoriesMethod } from '../../services/CategoryService'
import plus from '../../assets/icons/plus.svg'
import Modal from '../../UI/modal/Modal'
import { CreateProductMethod, GetAllProductsMethod, UpdateProductMethod } from '../../services/ProductService'
import { CreateBrandMethod, GetAllBrandsMethod } from '../../services/BrandService'
import { Form } from 'react-bootstrap'

const Admin = () => {
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    let userToken, userData
    try {
      userToken = localStorage.getItem('token')
      // если в хранилище нет действительного токена
      if (!userToken) {
        return false
      }
      // токен есть, надо проверить его подлинность
      const response = await CheckAuthMethod()
      userToken = response.data.token
      userData = jwtDecode(userToken)
      localStorage.setItem('token', userToken)
      return userData
    } catch (e) {
      localStorage.removeItem('token')
      return false
    }
  }

  const getRole = async () => {
    const data: any = await checkAuth()
    if (data.role !== 'ADMIN') {
      document.location.href = '/404'
    } else {
      setLoading(false)
    }
  }

  // categories
  const [categories, setCategories] = useState<ICategory[]>([])

  const getAllCategories = async () => {
    const data = await GetAllCategoriesMethod()
    if (data.status === 200) {
      setCategories(data.data)
    }
  }

  //products
  const [productsByCategories, setProductsByCategories] = useState<any>()

  const getAllProductsByCategory = async (categoryId: number) => {
    const data = await GetAllProductsMethod(categoryId)
    if (data.status === 200) {
      return data.data.rows
    }
  }

  const getCurrentAdminProductList = async () => {
    let temp = categories.map(el => el.id)
    let result = {}
    temp.forEach(async (el) => {
      const products = await getAllProductsByCategory(el)
      const currentCategory = categories.filter(category => category.id === el)
      const currentFilters = currentCategory[0].filters
      products.push(currentFilters)
      // @ts-ignore
      result[`${currentCategory[0].name}`] = products
      if (el === temp.slice(-1)[0]) {
        setProductsByCategories(result)
      }
    })
  }

  //brands
  const [brands, setBrands] = useState<IBrand[]>([])

  const getAllBrands = async () => {
    const data = await GetAllBrandsMethod()
    if (data.status === 200) {
      setBrands(data.data)
    }
  }

  useEffect(() => {
    getCurrentAdminProductList()
  }, [categories])

  useEffect(() => {
    getRole()
  }, [])

  useEffect(() => {
    if (!loading) {
      getAllCategories()
      getCurrentAdminProductList()
      getAllBrands()
    }
  }, [loading])

  const [showModal, setShowModal] = useState(false)
  const [whatCreate, setWhatCreate] = useState<'category' | 'brand' | 'product'>('category')

  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  // category
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryFilters, setNewCategoryFilters] = useState('')
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null)

  //brand
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandImage, setNewBrandImage] = useState<File | null>(null)

  // product
  const [newProductName, setNewProductName] = useState('')
  const [newProductCategory, setNewProductCategory] = useState<number | null>(null)
  const [newProductPrice, setNewProductPrice] = useState<number>(0)
  const [newProductBrand, setNewProductBrand] = useState<number | null>(null)
  const [newProductWeight, setNewProductWeight] = useState('')
  const [newProductColor, setNewProductColor] = useState('')
  const [newProductAge, setNewProductAge] = useState('')
  const [newProductStop, setNewProductStop] = useState('')
  const [newProductImage, setNewProductImage] = useState<File | null>(null)

  const create = async (type: 'category' | 'product' | 'brand') => {
    if (type === 'category') {
      if (newCategoryName && newCategoryImage && newCategoryFilters) {
        const data = await CreateCategoryMethod(newCategoryName, newCategoryFilters, newCategoryImage)
        if (data.status === 200) {
          setOkMessage('Успешно')
          setLoading(true)
          setTimeout(() => {
            setOkMessage('');
            setLoading(false)
            setShowModal(false)
          }, 2000);
        } else {
          setErrorMessage(data.data)
          setTimeout(() => {
            setErrorMessage('')
          }, 2000);
        }
      } else {
        setErrorMessage('Проверьте правильность введённых полей')
        setTimeout(() => {
          setErrorMessage('')
        }, 2000);
      }
    } else if (type === 'brand') {
      if (newBrandName && newBrandImage) {
        const data = await CreateBrandMethod(newBrandName, newBrandImage)
        if (data.status === 200) {
          setOkMessage('Успешно')
          setLoading(true)
          setTimeout(() => {
            setOkMessage('');
            setLoading(false)
            setShowModal(false)
          }, 2000);
        } else {
          setErrorMessage(data.data)
          setTimeout(() => {
            setErrorMessage('')
          }, 2000);
        }
      } else {
        setErrorMessage('Проверьте правильность введённых полей')
        setTimeout(() => {
          setErrorMessage('')
        }, 2000);
      }
    } else if (type === 'product') {
      if (newProductName && newProductImage && newProductBrand && newProductColor && +newProductPrice && newProductCategory && newProductWeight) {
        const data = await CreateProductMethod(newProductName, +newProductPrice, newProductCategory, newProductBrand, newProductColor, newProductWeight, newProductImage, newProductAge, newProductStop === 'stop' ? true : false)
        if (data.status === 200) {
          setOkMessage('Успешно')
          setLoading(true)
          setTimeout(() => {
            setOkMessage('');
            setLoading(false)
            setShowModal(false)
          }, 2000);
        } else {
          setErrorMessage(data.data)
          setTimeout(() => {
            setErrorMessage('')
          }, 2000);
        }
      } else {
        setErrorMessage('Проверьте правильность введённых полей')
        setTimeout(() => {
          setErrorMessage('')
        }, 2000);
      }
    }
  }

  const changeImage = (e: ChangeEvent<HTMLInputElement>, type: 'category' | 'product' | 'brand') => {
    if (e.target.files) {
      if (type === 'category') {
        setNewCategoryImage(e.target.files[0])
      } else if (type === 'product') {
        setNewProductImage(e.target.files[0])
      } else if (type === 'brand') {
        setNewBrandImage(e.target.files[0])
      }
    }
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, type: "category" | "brand") => {
    if (type === 'category') {
      setNewProductCategory(+e.target.value)
    } else if (type === 'brand') {
      setNewProductBrand(+e.target.value)
    }
  }

  const modalContent = <div>
    {
      whatCreate === 'category' ?
        <div className={styles.formCreate}>
          <h2>Новая категория</h2>
          <input className={styles.formInput} type="text" placeholder='name' onChange={(e) => setNewCategoryName(e.target.value)} />
          <input className={styles.formInput} type="text" placeholder='filter, filter, filter' onChange={(e) => setNewCategoryFilters(e.target.value)} />
          <input className={styles.formInput} type="file" placeholder='image' onChange={(e) => changeImage(e, 'category')} />
          <button onClick={() => create("category")}>Создать категорию</button>
        </div>
        :
        whatCreate === 'brand' ?
          <div className={styles.formCreate}>
            <h2>Новый бренд</h2>
            <input className={styles.formInput} type="text" placeholder='name' onChange={(e) => setNewBrandName(e.target.value)} />
            <input className={styles.formInput} type="file" placeholder='image' onChange={(e) => changeImage(e, 'brand')} />
            <button onClick={() => create("brand")}>Создать бренд</button>
          </div>
          :
          whatCreate === 'product' ?
            <div className={styles.formCreate}>
              <h2>Новый продукт</h2>
              <Form.Select
                className={styles.customSelect}
                name="category"
                onChange={e => handleSelectChange(e, "category")}
              >
                <option value="">Категория</option>
                {categories && categories.map(item =>
                  <option key={item.id} value={item.id}>{item.name}</option>
                )}
              </Form.Select>
              <Form.Select
                className={styles.customSelect}
                name="brand"
                onChange={e => handleSelectChange(e, "brand")}
              >
                <option value="">Бренд</option>
                {brands && brands.map(item =>
                  <option key={item.id} value={item.id}>{item.name}</option>
                )}
              </Form.Select>
              <input className={styles.formInput} type="text" placeholder='name' onChange={(e) => setNewProductName(e.target.value)} />
              <input className={styles.formInput} type="text" placeholder='price' onChange={(e) => setNewProductPrice(+e.target.value)} />
              <input className={styles.formInput} type="text" placeholder='color' onChange={(e) => setNewProductColor(e.target.value)} />
              <input className={styles.formInput} type="text" placeholder='weight' onChange={(e) => setNewProductWeight(e.target.value)} />
              <input className={styles.formInput} type="text" placeholder='age' onChange={(e) => setNewProductAge(e.target.value)} />
              <input className={styles.formInput} type="text" placeholder='stop' onChange={(e) => setNewProductStop(e.target.value)} />
              <input className={styles.formInput} type="file" placeholder='image' onChange={(e) => changeImage(e, 'product')} />
              <button onClick={() => create("product")}>Создать продукт</button>
            </div>
            :
            <></>
    }
    <div className={styles.error}>{errorMessage}</div>
    <div className={styles.ok}>{okMessage}</div>
  </div>

  return (
    <>
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
          <div className={styles.adminPage}>
            <div className={styles.categoryContainer}>
              <div className={styles.titleContainer}>
                <h1>Категории</h1>
                <div className={styles.btn}>
                  <img src={plus} alt="create" onClick={() => { setShowModal(true); setWhatCreate('category') }} />
                </div>
              </div>
              <List list={categories} type={'ICategory'} setLoading={setLoading} />
            </div>
            <div className={styles.brandContainer}>
              <div className={styles.titleContainer}>
                <h1>Бренды</h1>
                <div className={styles.btn}>
                  <img src={plus} alt="create" onClick={() => { setShowModal(true); setWhatCreate('brand') }} />
                </div>
              </div>
              <List list={brands} type={'IBrand'} setLoading={setLoading} />
            </div>
            <div className={styles.productContainer}>
              <div className={styles.titleContainer}>
                <h1>Товары</h1>
                <div className={styles.btn}>
                  <img src={plus} alt="create" onClick={() => { setShowModal(true); setWhatCreate('product') }} />
                </div>
              </div>
              <List list={productsByCategories} categories={categories} brands={brands} type={'IProduct'} setLoading={setLoading} />
            </div>
          </div>
          <Modal showModal={showModal} setShowModal={setShowModal}>{modalContent}</Modal>
        </Container>
      }
    </>
  )
}

export default Admin