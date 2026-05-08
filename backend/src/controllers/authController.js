import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../models/index.js'

// ✅ REGISTER
export const register = async (req, res) => {

  const { nome, email, senha, telefone } = req.body

  try {

    const userExists = await db.User.findOne({
      where: { email }
    })

    if (userExists) {
      return res.status(400).json({
        error: 'Email já cadastrado'
      })
    }

    const hash = await bcrypt.hash(senha, 10)

    const user = await db.User.create({
      nome,
      email,
      senha: hash,
      telefone,
      role: 'cliente'
    })

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        nome: user.nome
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const { senha: _, ...userSafe } = user.toJSON()

    res.status(201).json({
      token,
      user: userSafe
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Erro ao cadastrar'
    })
  }
}

// ✅ LOGIN
export const login = async (req, res) => {

  const { email, senha } = req.body

  try {

    const user = await db.User.findOne({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      })
    }

    const match = await bcrypt.compare(
      senha,
      user.senha
    )

    if (!match) {
      return res.status(401).json({
        error: 'Senha inválida'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        nome: user.nome
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    const { senha: _, ...userSafe } = user.toJSON()

    res.json({
      token,
      user: userSafe
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Erro no login'
    })
  }
}

// ✅ LIST USERS
export const listUsers = async (req, res) => {

  try {

    const users = await db.User.findAll({
      attributes: {
        exclude: ['senha']
      }
    })

    res.json(users)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      error: 'Erro ao buscar usuários'
    })
  }
}

export const profile = async (
  req,
  res
) => {

  try {

    const user = await db.User.findByPk(
      req.user.id,
      {
        attributes: {
          exclude: ['senha']
        }
      }
    )

    res.json(user)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Erro ao buscar perfil'
    })

  }

}