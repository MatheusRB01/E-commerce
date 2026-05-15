import app from './src/app.js'

import dotenv from 'dotenv'

import http from 'node:http'

import fs from "fs"

import path from "path"

import userRoutes
  from "./src/routes/user.router.js"

import { Server }
  from 'socket.io'

import db
  from './src/models/index.js'

import {
  setupSocket
}

from './src/socket/chat.js'

// ====================================
// ENV
// ====================================

dotenv.config()

// ====================================
// ROTAS
// ====================================

app.use(
  "/usuarios",
  userRoutes
)

// ====================================
// UPLOADS
// ====================================

const uploadDir =
  "./uploads"

// ====================================
// PORT
// ====================================

const PORT =
  process.env.PORT || 3000

// ====================================
// SERVER HTTP
// ====================================

const server =
  http.createServer(app)

// ====================================
// SOCKET.IO
// ====================================

const io =
  new Server(server, {

    cors: {

      origin: "*"

    }

  })

// ====================================
// SOCKET SETUP
// ====================================

setupSocket(io)

// ====================================
// DATABASE
// ====================================

await db.sequelize.sync()

// ====================================
// START SERVER
// ====================================

server.listen(PORT, () => {

  console.log(

    `Servidor rodando na porta ${PORT} 🚀`

  )

})