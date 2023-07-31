import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const createToken = (id, email, role) => {
  return jwt.sign(
    {
      id,
      email,
      role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    },
    secret
  )
}

const isTokenValid = (bearerToken) => {
  const tokenValue = bearerToken.split(' ')[1]
  return jwt.verify(tokenValue, secret, (err, data) => {
    if (err) {
      return {
        err: true,
        data: err
      }
    }

    if (data) {
      return {
        err: false,
        data: data
      }
    }
  })
}

export { secret, isTokenValid, createToken }
