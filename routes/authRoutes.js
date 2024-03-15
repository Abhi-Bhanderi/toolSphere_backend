import express from 'express'
const router = express.Router()

import {
   google,
   signUp,
   login,
   refreshToken,
} from '../controller/authController.js'
import {
   deleteUser,
   getAllUser,
   getMe,
   updateUser,
} from '../controller/userController.js'

import { protect, restrictTo } from '../middleware/authMiddleware.js'
// Authentication routes
router.post('/google/signin', google)
router.post('/signup', signUp)
router.post('/login', login)
router.post('/refreshToken/', refreshToken)

// User routes
router.get('/user/all', protect, restrictTo('admin'), getAllUser)
router.get('/user/profile/data', protect, getMe)
router.put('/user/update/:id', protect, restrictTo('admin'), updateUser)
router.delete('/user/delete/:id', protect, restrictTo('admin'), deleteUser)

export default router
