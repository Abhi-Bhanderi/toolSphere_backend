import JWT from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../model/userModel.js'
import AppError from '../utils/appError.js'

export const protect = asyncHandler(async (req, res, next) => {
   if (
      !req.headers.authorization &&
      !req.headers.authorization.startsWith('Bearer')
   ) {
      return next(
         new AppError(
            401,
            'You are not Logged in, So you do not have permission to perform this action!'
         )
      )
   }

   let token
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = JWT.verify(token, process.env.JWT_SECRET)
      // console.log(decoded);
      if (!decoded.id) {
         return res.status(404).json({
            status: false,
            code: 404,
            message: 'No Id found in token',
         })
      }
      // Get user from the token
      req.user = await User.findById(decoded.id)

      next()
   }
})

export const restrictTo = (...roles) => {
   return (req, res, next) => {
      // roles = [ 'admin' ]. If role is not defined then it will be 'user' by default
      if (!roles.includes(req.user.role)) {
         return next(
            new AppError(
               403,
               'You do not have permission to perform this action!'
            )
         )
      }
      next()
   }
}
