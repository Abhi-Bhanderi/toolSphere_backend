/* eslint-disable no-unused-vars */
import AppError from '../utils/appError.js'

const sendErrorDev = (res, err) => {
   res.status(err.statusCode).json({
      status: false,
      statusCode: err.statusCode,
      message: err.message,
      error_stack: err.stack,
      error: err,
   })
}

const sendErrorProd = (res, err) => {
   // Operational, trusted error: send message to client
   if (err.isOperational) {
      res.status(err.statusCode).json({
         status: false,
         statusCode: err.statusCode,
         message: err.message,
         isOperational: true,
      })
   }
   // Programming or any other unknown error: don't leak information to client
   else {
      console.error('ERROR', err)
      res.status(500).json({
         status: false,
         statusCode: 500,
         message: 'Something went very wrong!',
      })
   }
}

const handleCastErrorDB = (err) => {
   const message = `Invalid ${err.path}: ${err.value}`
   return new AppError(400, message)
}
const handleDuplicateFieldDB = (err) => {
   const value = err.errmsg.match(/\{(.+?)\}/)[0]
   const message = `Duplicate Field value ${value}, Please use another value`
   return new AppError(400, message)
}

const handleValidationErrDB = (err) => {
   const errors = Object.values(err.errors).map((el) => el.message)
   const message = `Invalid input data: ${errors}`
   return new AppError(400, message)
}

export default (err, req, res, next) => {
   err.statusCode = err.statusCode || 500

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(res, err)
   } else if (process.env.NODE_ENV === 'production') {
      // let error = { ...err };

      if (err.name === 'CastError') err = handleCastErrorDB(err)
      if (err.code === 11000) err = handleDuplicateFieldDB(err)
      if (err.name === 'ValidationError') err = handleValidationErrDB(err)
      sendErrorProd(res, err)
   }
}
