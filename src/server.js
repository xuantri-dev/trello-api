/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * 'A bit of fragrance clings to the hand that gives flowers!'
 */

import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
// Xử lí socket real-time với gói socket.io
// https://socket.io/docs/v4/tutorial/step-3
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  // Fix cái lỗi Cache from disk của ExpressJS
  // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
  app.use((req, res, next) => {
    res.set('Cache-Controll', 'no-store')
    next()
  })

  // Cấu hình Cookie Parser
  app.use(cookieParser())

  // xử lí CORS
  app.use(cors(corsOptions))

  // enable req.body json data
  app.use(express.json())

  // use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xửa lí lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo một cái server mới bọc thằng app của express để làm real-time với socket.io
  const server = http.createServer(app)
  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    // Gọi các socket tùy theo tính năng ở đây
    inviteUserToBoardSocket(socket)

    // ...vv
  })

  // Môi trường Production (cụ thể hiện tại là đang support Render.com)
  if (env.BUILD_MODE === 'production') {
    // Dùng server.listen thay vì dùng app.listen vì lúc này server đã bao gồm express app và đã config socket.io
    server.listen(process.env.PORT, () => {
      console.log(`3. Production: Hi ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`)
    })
  } else {
    // Môi trườngh Local Dev
    // Dùng server.listen thay vì dùng app.listen vì lúc này server đã bao gồm express app và đã config socket.io
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local Dev: Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port ${env.LOCAL_DEV_APP_PORT}`)
    })

  }
  // thực hiện các tác vụ cleanup trước khi dừng server
  // https://stackoverflow.com/q/14031763/8324172
  exitHook(() => {
    // console.log('4. Server is shutting down')
    CLOSE_DB()
    // console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Chỉ khi kết nối tới database thành công thì mới start server back-end lên
// Immediately-invoked / Anonymous Async Function (IIFE)
//IIFE Hàm bất đồng bộ tự gọi ngay lập tức (tức là tự gọi ngay khi chương trình chạy)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    // Khởi động server back-end sau khi connect database thành công
    START_SERVER()
  } catch (error) {
    // console.error(error)
    process.exit(0)
  }
})()

// // Chỉ khi kết nối tới database thành công thì mới start server back-end lên
// console.log('1. Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error)
//     process.exit(0)
//   })
