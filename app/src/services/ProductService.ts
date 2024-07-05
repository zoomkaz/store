import { ApiClient } from "./Client"

export const GetAllProductsFilterMethod = async (
  categoryId?: number,
  brandId?: string,
  color?: string,
  weight?: string,
  price?: string,
  age?: string,
  stop?: boolean
) => {
  let resultAge: string[] = []
  if (age) {
    let tempAge = []
    let rowDefaultAge = age.split(',').sort((a, b) => +a - +b);
    let tempResult = []
    for (let i = 0; i <= +rowDefaultAge[rowDefaultAge.length - 1]; i++) {
      if (i <= +rowDefaultAge[rowDefaultAge.length - 1] && i >= +rowDefaultAge[0]) {
        tempResult.push(i.toString())
      }
    }
    for (let i = 0; i < tempResult.length; i++) {
      for (let j = 0; j < 99; j++) {
        tempAge.push(`${tempResult[i]}-${+tempResult[i] ? +tempResult[i] + j : j + 1}`)
      }
    }
    resultAge = [...age.split(','), ...tempAge]
  }
  return await ApiClient({
    method: 'POST',
    url: '/product/getall/filter',
    data: {
      ...(categoryId && { categoryId: categoryId }),
      ...(brandId && { brandId: brandId }),
      ...(color && { color: color }),
      ...(weight && { weight: weight }),
      ...(price && { price: price }),
      ...(age && { age: resultAge.join(',') }),
      stop: stop,
    }
  })
}

export const GetAllProductsMethod = async (categoryId?: number, brandId?: number, limit?: number, page?: number) => {
  return await ApiClient({
    url: categoryId ? `/product/getall/categoryId/${categoryId}` :
      brandId ? `/product/getall/brandId/${brandId}` :
        categoryId && brandId ? `/product/getall/categoryId/${categoryId}/brandId/${brandId}` :
          `/product/getAll`,
    params: {
      ...(limit && { limit: limit }),
      ...(page && { page: page }),
    }
  })
}

export const CreateProductMethod = async (
  name: string,
  price: number,
  categoryId: number,
  brandId: number,
  color: string,
  weight: string,
  image: File,
  age: string = '3-7',
  stop: boolean = false
) => {

  const props = {
    color: color,
    weight: weight,
    age: age,
    stop: stop,
  }

  return await ApiClient({
    method: 'POST',
    url: '/product/create',
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      name: name,
      price: price,
      categoryId: categoryId,
      brandId: brandId,
      image: image,
      props: JSON.stringify(props)
    }
  })
}

export const UpdateProductMethod = async (
  id: number,
  name?: string,
  price?: number,
  categoryId?: number,
  brandId?: number,
  color?: string,
  weight?: string,
  image?: File,
  age?: string,
  stop?: boolean
) => {

  const props = {
    ...(color && { color: color }),
    ...(weight && { weight: weight }),
    ...(age && { age: age }),
    stop: stop,
  }

  return await ApiClient({
    method: 'PUT',
    url: `/product/update/${id}`,
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      ...(name && { name: name }),
      ...(price && { price: price }),
      ...(categoryId && { categoryId: categoryId }),
      ...(brandId && { brandId: brandId }),
      ...(image && { image: image }),
      props: JSON.stringify(props)
    }
  })
}

export const DeleteProductMethod = async (id: number) => {
  return await ApiClient({
    method: "DELETE",
    url: `/product/delete/${id}`
  })
}