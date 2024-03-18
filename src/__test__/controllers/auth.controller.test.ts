import { afterEach } from 'node:test'
import AuthController from '~/controllers/auth.controller'
import jest from 'jest'

afterEach(() => {
  jest.restoreAllMocks()
})
