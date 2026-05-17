import db from "../models/index.js"

import { Op }
  from "sequelize"

import jwt
  from "jsonwebtoken"

const usuariosOnline = new Map()

export function setupSocket(io) {

  // ====================================
  // AUTH SOCKET
  // ====================================

  io.use((socket, next) => {

    try {

      const token =
        socket.handshake.auth.token

      if (!token) {

        return next(
          new Error("Token ausente")
        )

      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        )

      socket.user = decoded

      console.log(
        "✅ SOCKET USER:",
        socket.user
      )

      next()

    } catch (error) {

      console.error(error)

      next(
        new Error("Token inválido")
      )

    }

  })

  // ====================================
  // CONNECTION
  // ====================================

  io.on("connection", socket => {

    const userId =
      socket.user.id

    const role =
      socket.user.role

    console.log(
      `🟢 ${role} conectado`
    )

    usuariosOnline.set(
      userId,
      {
        socketId: socket.id,
        role
      }
    )

    console.log(
      "👥 ONLINE:",
      [...usuariosOnline.keys()]
    )

    function enviarClientesOnline() {

      const clientes =
        [...usuariosOnline.entries()]

          .filter(([id, user]) => {

            return (
              user.role === "user" ||
              user.role === "client" ||
              user.role === "cliente"
            )

          })

          .map(([id]) => Number(id))

      io.to("admin").emit(
        "clientesOnline",
        clientes
      )

    }

    enviarClientesOnline()
    // ====================================
    // ROOM USER
    // ====================================

    socket.join(
      `user:${userId}`
    )

    // ====================================
    // ROOM ADMIN
    // ====================================

    if (role === "admin") {

      socket.join("admin")

    }

    // ====================================
    // NOVA MENSAGEM
    // ====================================

    socket.on(
      "mensagem",
      async data => {

        try {

          const from =
            userId

          let to =
            Number(
              data?.to ||
              data?.para
            )

          const text =
            (
              data?.text ||
              data?.texto
            )?.trim()

          // ====================================
          // CLIENTE → ADMIN
          // ====================================

          if (
            role === "cliente"
          ) {

            to = 1

          }

          // ====================================
          // VALIDAÇÃO
          // ====================================

          if (
            !to ||
            !text
          ) {

            return

          }

          // ====================================
          // SALVAR
          // ====================================

          const msg =
            await db.Message.create({

              from,

              to,

              text

            })

          // ====================================
          // PAYLOAD
          // ====================================

          const payload = {

            id: msg.id,

            from: msg.from,

            to: msg.to,

            text: msg.text,

            createdAt:
              msg.createdAt

          }

          // ====================================
          // DESTINATÁRIO
          // ====================================

          io.to(
            `user:${to}`
          ).emit(
            "novaMensagem",
            payload
          )

          // ====================================
          // REMETENTE
          // ====================================

          io.to(
            `user:${from}`
          ).emit(
            "novaMensagem",
            payload
          )

        } catch (error) {

          console.error(error)

        }

      }
    )

    // ====================================
    // HISTÓRICO
    // ====================================

    socket.on(
      "buscarMensagens",
      async usuarioId => {

        try {

          const mensagens =
            await db.Message.findAll({

              where: {

                [Op.or]: [

                  {

                    from: userId,

                    to: usuarioId

                  },

                  {

                    from: usuarioId,

                    to: userId

                  }

                ]

              },

              order: [
                ["createdAt", "ASC"]
              ]

            })

          socket.emit(
            "historicoMensagens",
            mensagens
          )

        } catch (error) {

          console.error(error)

        }

      }
    )

    // ====================================
    // OFFLINE
    // ====================================

    socket.on(
      "disconnect",
      () => {

        console.log(
          "🔴 Desconectado"
        )

        usuariosOnline.delete(userId)

        enviarClientesOnline()

      }
    )
    enviarClientesOnline()
  }

  )
}