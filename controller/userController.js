import asyncHandler from 'express-async-handler'
import User from '../model/userModel.js'
import { deleteOne, getAll, updateOne } from './factoryHandler.js'

export const getMe = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.id)
   res.status(200).json({
      status: true,
      code: 200,
      data: user,
   })
})

export const getAllUser = getAll(User)
export const updateUser = updateOne(User)
export const deleteUser = deleteOne(User)
