import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await app.inject({
      method: 'POST',
      url: '/gyms/create',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        title: 'Academia Node',
        description: 'Academia com pesos',
        phone: '19 99999-9999',
        latitude: -22.8360352,
        longitude: -47.202852,
      },
    })

    await app.inject({
      method: 'POST',
      url: '/gyms/create',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        title: 'Academia React',
        description: 'Academia com Aerobico',
        phone: '19 99999-9999',
        latitude: -22.8360352,
        longitude: -47.202852,
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/gyms/search',
      query: { query: 'Node' },
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toEqual(200)
    expect(response.json()).toHaveLength(1)
    expect(response.json()).toEqual([
      expect.objectContaining({
        title: 'Academia Node',
      }),
    ])
  })
})
