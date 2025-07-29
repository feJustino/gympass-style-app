import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await app.inject({
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

    expect(response.statusCode).toEqual(201)
  })
})
