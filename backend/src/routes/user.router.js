import express from "express"

import db from "../models/index.js"

const router =
  express.Router()

router.get(
  "/",
  async (req, res) => {

    try {

      const usuarios =

        await db.User.findAll({

          attributes: [
            "id",
            "nome",
            "email",
            "role"
          ],

          where: {

            role: "cliente"

          }

        })

      res.json(usuarios)

    } catch (error) {

      console.error(error)

      res.status(500).json({

        error:
          "Erro ao buscar usuários"

      })

    }

  }
)

export default router