import app from './src/app.js'
import dotenv from 'dotenv'
import http from 'node:http'
import fs from "fs"
import path from "path"

import { Server } from 'socket.io'

import db from './src/models/index.js'

import { setupSocket }

from './src/socket/chat.js'

dotenv.config()

const uploadDir = "./uploads"


const PORT =
  process.env.PORT || 3000

const server =
  http.createServer(app)

const io =
  new Server(server, {
    cors: {
      origin: "*"
    }
  })

setupSocket(io)

// cria tabelas automaticamente
await db.sequelize.sync()

server.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT} 🚀`
  )

})