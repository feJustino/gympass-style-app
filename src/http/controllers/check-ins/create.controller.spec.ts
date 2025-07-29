import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Checkin Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gymResponse = await app.inject({
      method: 'POST',
      url: '/gyms',
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

    const { gym } = gymResponse.json()

    const response = await app.inject({
      method: 'POST',
      url: `/gyms/${gym.id}/check-ins`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        latitude: -22.8360352,
        longitude: -47.202852,
      },
    })

    expect(response.statusCode).toEqual(201)
  })
})
