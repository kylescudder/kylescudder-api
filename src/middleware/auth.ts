import { verify } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('x-auth-token')
    if (!token) {
      return res
        .status(401)
        .json({ msg: 'No authentication token, access denied' })
    }
    const verified = verify(token, process.env.JWT_SECRET as string)
    if (!verified) {
      return res
        .status(401)
        .json({ msg: 'Token verification failed, authorization denied' })
    }
    req.user = verified
    return next()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
};
module.exports = auth
