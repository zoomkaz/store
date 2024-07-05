import React, { ChangeEvent, useState } from 'react'
import styles from './List.module.scss'
import { IBrand, ICategory, IProduct } from '../../types/types';
import deleteIcon from '../../assets/icons/deleteIcon.svg'
import edit from '../../assets/icons/edit.svg'
import ok from '../../assets/icons/ok.svg'
import file from '../../assets/icons/file.svg'
import { DeleteCategoryMethod, UpdateCategoryMethod } from '../../services/CategoryService';
import { DeleteBrandMethod, UpdateBrandMethod } from '../../services/BrandService';
import { DeleteProductMethod, UpdateProductMethod } from '../../services/ProductService';
import { Form } from 'react-bootstrap';

interface ListPropsType {
  list: ICategory[] | IBrand[] | IProduct[];
  type: 'ICategory' | 'IBrand' | 'IProduct';
  setLoading: (param: boolean) => void;
  categories?: ICategory[]
  brands?: IBrand[]
}

const List = ({ list, type, setLoading, categories, brands }: ListPropsType) => {
  const [photoList, setPhotoList] = useState<any[]>([]);
  const [newImage, setNewImage] = useState<File | null>(null);

  const getBase64 = (file: File) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoList([...photoList, reader.result])
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && photoList.length < 1) {
      const file = e.target.files[0];
      getBase64(file)
      setNewImage(file)
    }
  };

  const deleteItem = async (id: number, type: string) => {
    if (type === 'category') {
      const data = await DeleteCategoryMethod(id);
      if (data.status === 200) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
    } else if (type === 'brand') {
      const data = await DeleteBrandMethod(id);
      if (data.status === 200) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
    } else if (type === 'product') {
      const data = await DeleteProductMethod(id)
      if (data.status === 200) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
    }
  }

  const showEdit = (id: number, variant: "n" | "f" | "i" | "p" | "b" | string, extra: "category" | "brand" | "product") => {
    const showDiv = document.getElementById(`show-${extra}-${variant}-${id}`) ?? document.createElement('div');
    const hiddenDiv = document.getElementById(`hidden-${extra}-${variant}-${id}`) ?? document.createElement('div');
    showDiv.style.display = 'none'
    hiddenDiv.style.display = 'flex'
  }

  const updateItem = async (
    id: number,
    column: 'name' | 'filters' | 'image' | "price" | "brand" | "category" | "color" | "age" | "weight" | "stop" | string,
    types: typeof type,
    variant: "n" | "f" | "i" | "p" | "b" | string,
    extra: "category" | "brand" | "product",
    currentProduct?: IProduct,
  ) => {
    const input = document.getElementById(`inp-${extra}-${variant}-${id}`) ?? document.createElement('input');
    if (types === 'ICategory') {
      if (column === 'name') {
        const data = await UpdateCategoryMethod(id, (input as HTMLInputElement).value)
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'filters') {
        const data = await UpdateCategoryMethod(id, undefined, (input as HTMLInputElement).value)
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'image') {
        if ((input as HTMLInputElement).files !== null) {
          const file = (input as HTMLInputElement).files?.[0]
          const data = await UpdateCategoryMethod(id, undefined, undefined, file)
          if (data.status === 200) {
            document.location.reload()
          }
        }
      }
    } else if (types === 'IBrand') {
      if (column === 'name') {
        const data = await UpdateBrandMethod(id, (input as HTMLInputElement).value)
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'image') {
        if ((input as HTMLInputElement).files !== null) {
          const file = (input as HTMLInputElement).files?.[0]
          const data = await UpdateBrandMethod(id, undefined, file)
          if (data.status === 200) {
            document.location.reload()
          }
        }
      }
    } else if (types === 'IProduct') {
      if (!currentProduct) return
      let oldPropsRow = currentProduct.props
      let newProps: any = {}
      for (let i = 0; i < oldPropsRow.length; i++) {
        newProps = { ...newProps, [oldPropsRow[i].name]: oldPropsRow[i].value }
      }
      if (column === 'price') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          +(input as HTMLInputElement).value,
          undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'brand') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          newProductBrand ?? undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'category') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          newProductCategory ?? undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'name') {
        const data = await UpdateProductMethod(
          id,
          (input as HTMLInputElement).value,
          undefined,
          undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'image') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          newImage ?? undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'color') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          (input as HTMLInputElement).value,
          newProps['weight'],
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'weight') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          newProps['color'],
          (input as HTMLInputElement).value,
          undefined,
          newProps['age'],
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'age') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          (input as HTMLInputElement).value,
          newProps['stop']
        )
        if (data.status === 200) {
          document.location.reload()
        }
      } else if (column === 'stop') {
        const data = await UpdateProductMethod(
          id,
          undefined,
          undefined,
          undefined,
          undefined,
          newProps['color'],
          newProps['weight'],
          undefined,
          newProps['age'],
          (input as HTMLInputElement).value === 'stop' ? true : false,
        )
        if (data.status === 200) {
          document.location.reload()
        }
      }
    }
  }

  const [newProductCategory, setNewProductCategory] = useState<number | null>(null)
  const [newProductBrand, setNewProductBrand] = useState<number | null>(null)

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, type: "category" | "brand") => {
    if (type === 'category') {
      setNewProductCategory(+e.target.value)
    } else if (type === 'brand') {
      setNewProductBrand(+e.target.value)
    }
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHead} style={type === 'IProduct' ? { display: "none" } : { display: 'flex' }}>
        <div className={styles.headItem}>ID</div>
        <div className={styles.headItem}>Name</div>
        <div className={styles.headItem} style={type === 'IBrand' ? { display: "none" } : { display: 'flex' }}>Filters</div>
        <div className={styles.headItem}>Image</div>
        <div className={styles.headItem}>Created</div>
        <div className={styles.headItem}>Updated</div>
      </div>
      {
        type === 'ICategory' ?
          list.length ?
            ((list as ICategory[]).sort((a, b) => +a.id - +b.id).map((el, index) => {
              return <div className={styles.listItem} key={index}>
                <div className={styles.id}>
                  {el.id}
                  <img src={deleteIcon} alt="delete" onClick={() => deleteItem(el.id, 'category')} />
                </div>
                <div className={styles.name}>
                  <div className={styles.hidden} id={`hidden-category-n-${el.id}`} style={{ display: 'none' }}>
                    <input type="text" defaultValue={el.name} id={`inp-category-n-${el.id}`} />
                    <img src={ok} alt="done" onClick={() => updateItem(el.id, 'name', type, "n", "category")} />
                  </div>
                  <div className={styles.show} id={`show-category-n-${el.id}`}>
                    <p>{el.name}</p>
                    <img src={edit} alt="edit" onClick={() => showEdit(el.id, "n", "category")} />
                  </div>
                </div>
                <div className={styles.name}>
                  <div className={styles.hidden} id={`hidden-category-f-${el.id}`} style={{ display: 'none' }}>
                    <input type="text" defaultValue={el.filters.join(', ')} id={`inp-category-f-${el.id}`} />
                    <img src={ok} alt="done" onClick={() => updateItem(el.id, 'filters', type, "f", "category")} />
                  </div>
                  <div className={styles.show} id={`show-category-f-${el.id}`}>
                    <p>{el.filters.join(', ')}</p>
                    <img src={edit} alt="edit" onClick={() => showEdit(el.id, "f", "category")} />
                  </div>
                </div>
                <div className={styles.name}>
                  <div className={styles.hidden} id={`hidden-category-i-${el.id}`} style={{ display: 'none' }}>
                    <div className={styles.imgBlock}>
                      <div className={styles.popup__file} style={photoList.length < 1 ? { display: 'flex' } : { display: "none" }}>
                        <input
                          type="file"
                          id={`inp-category-i-${el.id}`}
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                        <label htmlFor={`inp-category-i-${el.id}`}>
                          <img src={file} alt="" />
                        </label>
                      </div>
                      {
                        photoList.map((el, index) => {
                          return <img src={photoList[index]} alt='' className={styles.doc} key={index} />
                        })
                      }
                    </div>
                    <img src={ok} alt="done" onClick={() => updateItem(el.id, 'image', type, "i", "category")} />
                  </div>
                  <div className={styles.show} id={`show-category-i-${el.id}`}>
                    <img className={styles.image} src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="img" />
                    <img src={edit} alt="edit" onClick={() => showEdit(el.id, "i", "category")} />
                  </div>
                </div>
                <div className={styles.created}>{new Date(Date.parse(el.createdAt)).toLocaleString()}</div>
                <div className={styles.name}>{new Date(Date.parse(el.updatedAt)).toLocaleString()}</div>
              </div>
            }))
            :
            <div>Нет категорий</div>
          :
          type === 'IBrand' ?
            list.length ?
              ((list as IBrand[]).sort((a, b) => +a.id - +b.id).map((el, index) => {
                return <div className={styles.listItem} key={index}>
                  <div className={styles.id}>
                    {el.id}
                    <img src={deleteIcon} alt="delete" onClick={() => deleteItem(el.id, 'brand')} />
                  </div>
                  <div className={styles.name}>
                    <div className={styles.hidden} id={`hidden-brand-n-${el.id}`} style={{ display: 'none' }}>
                      <input type="text" defaultValue={el.name} id={`inp-brand-n-${el.id}`} />
                      <img src={ok} alt="done" onClick={() => updateItem(el.id, 'name', type, "n", "brand")} />
                    </div>
                    <div className={styles.show} id={`show-brand-n-${el.id}`}>
                      <p>{el.name}</p>
                      <img src={edit} alt="edit" onClick={() => showEdit(el.id, "n", "brand")} />
                    </div>
                  </div>
                  <div className={styles.name}>
                    <div className={styles.hidden} id={`hidden-brand-i-${el.id}`} style={{ display: 'none' }}>
                      <div className={styles.imgBlock}>
                        <div className={styles.popup__file} style={photoList.length < 1 ? { display: 'flex' } : { display: "none" }}>
                          <input
                            type="file"
                            id={`inp-brand-i-${el.id}`}
                            onChange={(e) => {
                              handleFileChange(e);
                            }}
                          />
                          <label htmlFor={`inp-brand-i-${el.id}`}>
                            <img src={file} alt="" />
                          </label>
                        </div>
                        {
                          photoList.map((el, index) => {
                            return <img src={photoList[index]} alt='' className={styles.doc} key={index} />
                          })
                        }
                      </div>
                      <img src={ok} alt="done" onClick={() => updateItem(el.id, 'image', type, "i", "brand")} />
                    </div>
                    <div className={styles.show} id={`show-brand-i-${el.id}`}>
                      <img className={styles.image} src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="img" />
                      <img src={edit} alt="edit" onClick={() => showEdit(el.id, "i", "brand")} />
                    </div>
                  </div>
                  <div className={styles.created}>{new Date(Date.parse(el.createdAt)).toLocaleString()}</div>
                  <div className={styles.name}>{new Date(Date.parse(el.updatedAt)).toLocaleString()}</div>
                </div>
              }))
              :
              <div>Нет брендов</div>
            :
            type === 'IProduct' ?
              list ?
                (Object.entries(list as any).map((value: any, index: number) => {
                  return <div className={styles.productListContainer} key={index}>
                    <h2 className={styles.productTitle}>{value[0]}</h2>
                    <div className={styles.listHead} style={{ marginTop: "20px" }}>
                      <div className={styles.headItem}>ID</div>
                      <div className={styles.headItem}>Name</div>
                      {
                        value[1].map((el: any, index: number) => {
                          if (Array.isArray(el)) {
                            return el.map((item: any, index: number) => {
                              return <div className={styles.headItem} key={index}>{item}</div>
                            })
                          }
                        })
                      }
                      <div className={styles.headItem}>Image</div>
                    </div>
                    {value[1].length > 1 ?
                      value[1].map((el: IProduct, index: number) => {
                        if (!Array.isArray(el)) {
                          return <div className={styles.listItem} key={index}>
                            <div className={styles.id}>
                              {el.id}
                              <img src={deleteIcon} alt="delete" onClick={() => deleteItem(el.id, 'product')} />
                            </div>
                            <div className={styles.name}>
                              <div className={styles.hidden} id={`hidden-product-n-${el.id}`} style={{ display: 'none' }}>
                                <input type="text" defaultValue={el.name} id={`inp-product-n-${el.id}`} />
                                <img src={ok} alt="done" onClick={() => updateItem(el.id, 'name', type, "n", "product", el)} />
                              </div>
                              <div className={styles.show} id={`show-product-n-${el.id}`}>
                                <p>{el.name}</p>
                                <img src={edit} alt="edit" onClick={() => showEdit(el.id, "n", "product")} />
                              </div>
                            </div>
                            <div className={styles.name}>
                              <div className={styles.hidden} id={`hidden-product-p-${el.id}`} style={{ display: 'none' }}>
                                <input type="text" defaultValue={el.price} id={`inp-product-p-${el.id}`} />
                                <img src={ok} alt="done" onClick={() => updateItem(el.id, 'price', type, "p", "product", el)} />
                              </div>
                              <div className={styles.show} id={`show-product-p-${el.id}`}>
                                <p>{el.price}</p>
                                <img src={edit} alt="edit" onClick={() => showEdit(el.id, "p", "product")} />
                              </div>
                            </div>
                            <div className={styles.name}>
                              <div className={styles.hidden} id={`hidden-product-b-${el.id}`} style={{ display: 'none' }}>
                                <Form.Select
                                  className={styles.customSelect}
                                  name="brand"
                                  onChange={e => handleSelectChange(e, "brand")}
                                  id={`inp-product-b-${el.id}`}
                                >
                                  <option value="">Бренд</option>
                                  {brands && brands.map(item =>
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                  )}
                                </Form.Select>
                                <img src={ok} alt="done" onClick={() => updateItem(el.id, 'brand', type, "b", "product", el)} />
                              </div>
                              <div className={styles.show} id={`show-product-b-${el.id}`}>
                                <p>{el.brand.name}</p>
                                <img src={edit} alt="edit" onClick={() => showEdit(el.id, "b", "product")} />
                              </div>
                            </div>
                            {
                              el.props.map((prop, index) => {
                                return <div className={styles.name} key={index}>
                                  <div className={styles.hidden} id={`hidden-product-${prop.name[0]}-${el.id}`} style={{ display: 'none' }}>
                                    <input type="text" defaultValue={prop.value} id={`inp-product-${prop.name[0]}-${el.id}`} />
                                    <img src={ok} alt="done" onClick={() => updateItem(el.id, prop.name, type, prop.name[0], "product", el)} />
                                  </div>
                                  <div className={styles.show} id={`show-product-${prop.name[0]}-${el.id}`}>
                                    <p>{prop.value}</p>
                                    <img src={edit} alt="edit" onClick={() => showEdit(el.id, prop.name[0], "product")} />
                                  </div>
                                </div>
                              })
                            }
                            <div className={styles.name}>
                              <div className={styles.hidden} id={`hidden-product-i-${el.id}`} style={{ display: 'none' }}>
                                <div className={styles.imgBlock}>
                                  <div className={styles.popup__file} style={photoList.length < 1 ? { display: 'flex' } : { display: "none" }}>
                                    <input
                                      type="file"
                                      id={`inp-product-i-${el.id}`}
                                      onChange={(e) => {
                                        handleFileChange(e);
                                      }}
                                    />
                                    <label htmlFor={`inp-product-i-${el.id}`}>
                                      <img src={file} alt="" />
                                    </label>
                                  </div>
                                  {
                                    photoList.map((el, index) => {
                                      return <img src={photoList[index]} alt='' className={styles.doc} key={index} />
                                    })
                                  }
                                </div>
                                <img src={ok} alt="done" onClick={() => updateItem(el.id, 'image', type, "i", "product", el)} />
                              </div>
                              <div className={styles.show} id={`show-product-i-${el.id}`}>
                                <img className={styles.image} src={`${process.env.REACT_APP_IMG_URL}${el.image}`} alt="img" />
                                <img src={edit} alt="edit" onClick={() => showEdit(el.id, "i", "product")} />
                              </div>
                            </div>
                          </div>
                        }
                      })
                      :
                      <div>В этой категории нет товаров</div>
                    }
                  </div>
                }))
                :
                <div>Нет категорий</div>
              :
              <></>
      }
    </div>
  )
}

export default List