import axios from "axios"
import { ApiClient } from "./Client";


export const GeoMethod = async (lat: number, lon: number) => {
  try {
    const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`);
    return res.data.city
  } catch (error) {
    console.error(error);
    return 'Нет данных'
  }
}

export const GetAllCitiesMethod = async () => {
  return await ApiClient({
    url: '/pickup/getall/cities'
  })
}

export const GetAllPointsMethod = async (code: number) => {
  return await ApiClient({
    url: '/pickup/getall/points',
    params: {
      code: code
    }
  })
}