import express from 'express'
import db from '../models/index.js'

const router = express.Router()

router.get('/usuarios', async (req, res) => {

    try {

        const usuarios = await db.User.findAll({

            attributes: [
                'id',
                'nome',
                'telefone',
                'role'
            ]

        })

        res.json(usuarios)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            erro: 'Erro ao buscar usuários'
        })

    }

})

router.delete('/usuarios/:id', async (req, res) => {

    try {

        const { id } = req.params

        const usuario = await db.User.findByPk(id)

        if (!usuario) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            })

        }

        await usuario.destroy()

        res.json({
            mensagem: 'Usuário excluído com sucesso'
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            erro: 'Erro ao excluir usuário'
        })

    }

})
export default router