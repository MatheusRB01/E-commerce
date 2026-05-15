import express from 'express'
import cors from 'cors'
import { produtoRoutes, authRoutes, adminRouters, chatRoutes, router} from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/produtos', produtoRoutes)
app.use('/auth', authRoutes)
app.use('/admin', adminRouters)
app.use('/chat', chatRoutes)
app.use('/router', router)



app.use('/uploads', express.static('uploads'))

export default app