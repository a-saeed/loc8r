import mongoose from 'mongoose'
import colors from 'colors'
import 'dotenv/config'

//configure production database
let URI = process.env.URI     
if (process.env.NODE_ENV === 'production')
    URI = process.env.PRODUCTION_URI     

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res)=>console.log('> Connected...'.bgCyan))
    .catch(err => console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red))

    /* ---------------------- close the mongoose connection --------------------- */

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`mongoose disconnected through ${msg} `);
        callback()
    })
}

process.once('SIGUSR2', () => { //for nodemon restarts
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2')
    } )
})
process.on('SIGINT', () => {  //for app termination
    gracefulShutdown('app termination', () => {
        process.exit(0);
    } )
})
process.on('SIGTERM', () => {  //for heroku app termination
    gracefulShutdown('heroku app shutdown', () => {
        process.exit(0);
    } )
})
