import { ApiClient } from "./Client"

export const GetAllCategoriesMethod = async () => {
  return await ApiClient({
    url: '/category/getall'
  })
}

export const GetOneCategoryMethod = async (id: number) => {
  return await ApiClient({
    url: `/category/getone/${id}`,
  })
}

export const CreateCategoryMethod = async (name: string, filters: string, image: File) => {
  return await ApiClient({
    method: 'POST',
    url: '/category/create',
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      name: name,
      filters: filters,
      image: image
    }
  })
}

export const DeleteCategoryMethod = async (id: number) => {
  return await ApiClient({
    method: 'DELETE',
    url: `/category/delete/${id}`,
    params: {
      id: id
    }
  })
}

export const UpdateCategoryMethod = async (id: number, name?: string, filters?: string, image?: File) => {
  return await ApiClient({
    method: "PUT",
    url: `/category/update/${id}`,
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      ...(name && { name: name }),
      ...(filters && { filters: filters }),
      ...(image && { image: image })
    }
  })
}