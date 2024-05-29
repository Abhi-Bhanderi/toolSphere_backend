// Package imports
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import 'colors'

const app = express()
dotenv.config()

// File imports
import startServer from './utils/startServer.js'
import toolRoutes from './routes/toolRoutes.js'
import globalErrorHandler from './controller/errorController.js'
import AppError from './utils/appError.js'
import reviewRoutes from './routes/reviewRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Security:- Adding Additional HTTP Header to request
app.use(helmet())

// Getting log for upcoming request in terminal
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}
// For Cross site sharing
// Use the CORS middleware with the custom options
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true,
   })
)


// For Limiting request per each IP
const RateLimiter = rateLimit({
   max: 300,
   windowMs: 60 * 60 * 1000,
   message: 'Too many request from this IP, please try again in 1 hour!',
})

app.use('/api', RateLimiter)

// Body Parser, reading json data from body
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Tool sanitization against NoSql query injections
app.use(mongoSanitize())

// Tool sanitization again XSS (Cors Site Scripting Attacks).
app.use(xss())

// Prevent Parameter Pollution
app.use(hpp())

app.use('/api/tools', toolRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/auth', authRoutes)

// Throw error for Unhandled routes
app.all('*', (req, res, next) => {
   next(new AppError(404, `Can't find ${req.originalUrl} on this server`))
})

// Global Error handler (Every failed req comes in this Middleware)
app.use(globalErrorHandler)

// Starting the server
const port = 8080 || process.env.PORT
startServer(app, port)
