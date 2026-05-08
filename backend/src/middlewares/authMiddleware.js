import jwt from 'jsonwebtoken'

export const verifyToken = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers.authorization

  // SEM TOKEN
  if (!authHeader) {

    return res.status(401).json({
      error: 'Sem token'
    })

  }

  const parts =
    authHeader.split(' ')

  // FORMATO INVÁLIDO
  if (parts.length !== 2) {

    return res.status(401).json({
      error: 'Formato inválido'
    })

  }

  const token = parts[1]

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    return next()

  } catch (error) {

    return res.status(401).json({
      error:
        'Token inválido ou expirado'
    })

  }

}