import { Router } from "express"

import {

  getMessages,
  getConversations

} from "../controllers/chatController.js"

const router = Router()

router.get(
  "/conversas",
  getConversations
)

router.get(
  "/mensagens/:userId/:adminId",
  getMessages
)

export default router