import expressAsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const isUserLogged = expressAsyncHandler(async (req, res, next) => {
   const authHeader = req.headers.authorization

   let userID
   if (authHeader) {
      const token = authHeader.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const { id } = decoded
      userID = id
      req.userID = userID
   }
   next()
})

export const pagination = expressAsyncHandler(async (req, res, next) => {
   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit) || 6
   req.page = page
   req.limit = limit
   req.skip = (req.page - 1) * req.limit * 1
   next()
})
