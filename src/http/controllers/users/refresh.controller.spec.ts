import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to refresh a token', async () => {
    await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      },
    })

    const authResponse = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'john@example.com',
        password: '123456',
      },
    })

    const setCookieHeader = authResponse.headers['set-cookie']

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      payload: {
        email: 'john@example.com',
        password: '123456',
      },
      headers: {
        cookie: setCookieHeader,
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toEqual({ token: expect.any(String) })
    expect(response.cookies).toEqual([
      expect.objectContaining({ name: 'refreshToken' }),
    ])
  })
})
