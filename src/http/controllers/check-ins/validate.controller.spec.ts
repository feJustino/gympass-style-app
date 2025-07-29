import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Validate Checkin Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to validate to check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymResponse = await app.inject({
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
    const { gym } = gymResponse.json()

    const checkInResponse = await app.inject({
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
    const { checkIn } = checkInResponse.json()

    const response = await app.inject({
      method: 'PATCH',
      url: `/check-ins/${checkIn.id}/validate`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        latitude: -22.8360352,
        longitude: -47.202852,
      },
    })

    expect(response.statusCode).toEqual(204)

    const checkInPrisma = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkInPrisma.validate_at).toEqual(expect.any(Date))
  })
})
