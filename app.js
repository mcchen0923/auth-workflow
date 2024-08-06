const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const nodeMediaServer = require('node-media-server')
const connectDB = require('./db/connect')

const { checkUser } = require('./middleware/authMiddleware')
const authRouter = require('./routes/authRoutes')
const chanRouter = require('./routes/chanRoutes')
const uploadRouter = require('./routes/uploadRoutes')

const { startNMS, handleStreamEvents } = require('./services/ffmpegService')

require('dotenv').config()

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/hls', express.static(path.join(__dirname, 'hls')))

app.get('*', checkUser)
app.use('/', authRouter)
app.use('/', chanRouter)
app.use('/uploads', uploadRouter)

// 錯誤處理路由
app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    startNMS()
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error)
  }
}

start()

io.on('connection', (socket) => {
  const hostname = socket.handshake.query.hostname

  if (hostname) {
    socket.join(hostname)
    socket.emit('message', `welcome to ${hostname}'s room`)

    socket.on('chat message', (msg) => {
      console.log('Message received:', msg)
      io.to(hostname).emit('reveivemessage', msg)
    })
  }
  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
