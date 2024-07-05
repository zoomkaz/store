import { ApiClient } from "./Client"

export const GetAllBrandsMethod = async () => {
  return await ApiClient({
    url: '/brand/getall'
  })
}

export const CreateBrandMethod = async (name: string, image: File) => {
  return await ApiClient({
    method: 'POST',
    url: '/brand/create',
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      name: name,
      image: image
    }
  })
}

export const DeleteBrandMethod = async (id: number) => {
  return await ApiClient({
    method: 'DELETE',
    url: `/brand/delete/${id}`,
    params: {
      id: id
    }
  })
}

export const UpdateBrandMethod = async (id: number, name?: string, image?: File) => {
  return await ApiClient({
    method: "PUT",
    url: `/brand/update/${id}`,
    headers: {
      "Content-type": 'multipart/form-data'
    },
    data: {
      ...(name && { name: name }),
      ...(image && { image: image })
    }
  })
}