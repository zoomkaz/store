import axios from 'axios'
import AppError from '../errors/AppError.js'
import authorization from '../services/authCdek.js';
import stringify from '../services/stringify.js';

const testingAPI = 'https://api.edu.cdek.ru/v2'
const productionAPI = 'https://api.cdek.ru/v2'

class Pickup {
  async getAllCities(req, res, next) {
    try {
      const tokenResponse = await authorization();
      const cities = await axios.get(
        `${testingAPI}/location/cities`,
        {
          params: {
            'country_codes': ['RU'],
            'size': '10000',
          },
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token ? tokenResponse.data.access_token : ''}`
          }
        }
      )
      res.json(JSON.parse(stringify(cities.data)))
    } catch (e) {
      next(AppError.badRequest(e.message))
    }
  }

  async getAllPoints(req, res, next) {
    const { code } = req.query
    try {
      if (!code) throw new Error('Не указан код населенного пункта')
      const tokenResponse = await authorization();
      const points = await axios.get(
        `${testingAPI}/deliverypoints`,
        // `${testingAPI}/offices`,
        {
          params: {
            'city_code': +code
            // 'cityid': +code
          },
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token ? tokenResponse.data.access_token : ''}`,
            "Content-Type": "application/json"
          }
        }
      )
      res.json(points)
    } catch (e) {
      next(AppError.badRequest(e.message))
    }
  }
}

export default new Pickup()