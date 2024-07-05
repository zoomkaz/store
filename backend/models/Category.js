import { Category as CategoryMapping } from './mapping.js'
import AppError from '../errors/AppError.js'
import FileService from '../services/File.js'

class Category {
  async getAll() {
    const categories = await CategoryMapping.findAll({
      order: [
        ['name', 'ASC'],
      ],
    })
    return categories
  }

  async getOne(id) {
    const category = await CategoryMapping.findByPk(id)
    if (!category) {
      throw new Error('Категория не найдена в БД')
    }
    return category
  }

  async create(data, image) {
    const { name } = data
    const filters = data.filters.split(', ')
    const exist = await CategoryMapping.findOne({ where: { name } })
    const newImage = FileService.save(image) ?? '';
    if (exist) {
      throw new Error('Такая категория уже есть')
    }
    if (newImage === null) {
      throw new Error('Пустое изображение')
    }
    const category = await CategoryMapping.create({ name, filters, image: newImage })
    return category
  }

  async update(id, data, image = null) {
    const category = await CategoryMapping.findByPk(id)
    if (!category) {
      throw new Error('Категория не найдена в БД')
    }
    const { name = category.name } = data
    const { filters } = data
    let newFilters = filters ? filters.split(', ') : undefined
    if (image) {
      FileService.delete(category.image)
      const newImage = FileService.save(image) ?? '';
      await category.update({ image: newImage })
    } else {
      await category.update({ name, filters: newFilters })
    }
    return category
  }

  async delete(id) {
    const category = await CategoryMapping.findByPk(id)
    if (!category) {
      throw new Error('Категория не найдена в БД')
    }
    await category.destroy()
    return category
  }
}

export default new Category()