import express from 'express'
import PickupController from '../controllers/Pickup.js'

const router = new express.Router()

router.get('/getall/cities', PickupController.getAllCities)
router.get('/getall/points', PickupController.getAllPoints)

export default router