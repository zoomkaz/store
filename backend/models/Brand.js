import { Brand as BrandMapping } from './mapping.js'
import AppError from '../errors/AppError.js'
import FileService from '../services/File.js'

class Brand {
  async getAll() {
    const brands = await BrandMapping.findAll({
      order: [
        ['name', 'ASC'],
      ],
    })
    return brands
  }

  async getOne(id) {
    const brand = await BrandMapping.findByPk(id)
    if (!brand) {
      throw new Error('Бренд не найден в БД')
    }
    return brand
  }

  async create(data, image) {
    const { name } = data
    const exist = await BrandMapping.findOne({ where: { name } })
    if (exist) {
      throw new Error('Такой бренд уже есть')
    }
    const newImage = FileService.save(image) ?? '';
    if (!newImage) {
      throw new Error('Пустое изображение')
    }
    const brand = await BrandMapping.create({ name, image: newImage })
    return brand
  }

  async update(id, data, image = null) {
    const brand = await BrandMapping.findByPk(id)
    if (!brand) {
      throw new Error('Бренд не найден в БД')
    }
    const { name = brand.name } = data
    if (image) {
      FileService.delete(brand.image)
      const newImage = FileService.save(image) ?? '';
      await brand.update({ image: newImage })
    } else {
      await brand.update({ name })
    }
    return brand
  }

  async delete(id) {
    const brand = await BrandMapping.findByPk(id)
    if (!brand) {
      throw new Error('Бренд не найден в БД')
    }
    await brand.destroy()
    return brand
  }
}

export default new Brand()