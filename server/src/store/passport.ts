import { Strategy, ExtractJwt } from 'passport-jwt'

import db from '~/models'

export const applyPassportStrategy = (passport: any) => {
  const options: any = {}
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  options.secretOrKey = process.env.ACCESS_TOKEN_SECRET
  passport.use(
    new Strategy(options, async (jwtPayload, done) => {
      const user = await db.User.findById(jwtPayload._id)
      if (user) {
        return done(null, user)
      }
      return done(null, false)
    })
  )
}
