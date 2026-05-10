import db from "../models/index.js"
import jwt from "jsonwebtoken"

export function setupSocket(io) {

  io.on("connection", (socket) => {

    console.log("🟢 Cliente conectado:", socket.id)

    // =========================
    // RECEBER MENSAGEM
    // =========================
    socket.on("mensagem", async (data) => {

      try {

        console.log("📩 RECEBIDO:", data)

        // aceita português e inglês
        const from =
          Number(data?.from || data?.de)

        const to =
          Number(data?.to || data?.para)

        const text =
          (data?.text || data?.texto)?.trim()

        console.log("📦 NORMALIZADA:", {
          from,
          to,
          text
        })

        // valida
        if (!from || !to || !text) {

          console.log("❌ Mensagem inválida")

          return
        }

        // salva no banco
        const msg = await db.Message.create({
          from,
          to,
          text
        })

        console.log("💾 SALVA:", msg)

        // envia mensagem limpa
        io.emit("novaMensagem", {
          id: msg.id,
          from: msg.from,
          to: msg.to,
          text: msg.text,
          createdAt: msg.createdAt
        })

      } catch (err) {

        console.error("❌ Erro socket:", err)

      }

    })

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {

      console.log("🔴 Cliente saiu:", socket.id)

    })

  })

}