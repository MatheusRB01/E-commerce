import db from "../models/index.js"
import { Op } from "sequelize"

const Message = db.Message

export const getMessages =
async (req, res) => {

  try {

    const userId =
      Number(req.params.userId)

    const adminId =
      Number(req.params.adminId)

    const messages =
      await Message.findAll({

        where: {

          [Op.or]: [

            {
              from: userId,
              to: adminId
            },

            {
              from: adminId,
              to: userId
            }

          ]

        },

        order: [["createdAt", "ASC"]]

      })

    res.json(messages)

  } catch (error) {

    console.error(error)

    res.status(500).json({

      success: false,

      message:
        "Erro ao buscar mensagens"

    })

  }

}

export const getConversations =
async (req, res) => {

  try {

    const conversations =
      await Message.findAll({

        order: [["createdAt", "DESC"]]

      })

    res.json(conversations)

  } catch (error) {

    console.error(error)

    res.status(500).json({

      error:
        "Erro ao buscar conversas"

    })

  }

}