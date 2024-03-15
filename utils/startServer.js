import connectDB from '../config/db.js'

const startServer = (app, port) => {
   connectDB(process.env.MONGO_PASS)
      .then(() => {
         app.listen(port, () => {
            if (process.env.NODE_ENV === 'development') {
               console.log(
                  `Development build of app is running on port:`.cyan,
                  `http://localhost:${port}`.bold.cyan
               )
            } else {
               if (process.env.NODE_ENV === 'production') {
                  console.log(
                     `Production build of app is running on port:`.cyan,
                     `${port}`.bold.cyan
                  )
               }
            }
         })
      })
      .catch(() => {
         console.log('Error While Connecting to the Database...'.red)
         process.exit()
      })
}

export default startServer
