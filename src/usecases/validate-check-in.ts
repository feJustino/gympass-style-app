import { CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import dayjs from 'dayjs'

interface ValidateCheckInUseCaseRequest {
  checkinId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkinId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkinId)

    if (!checkIn) throw new ResourceNotFoundError()
    const todayDate = dayjs(new Date())

    const diffBetweenCheckinCreateAtMinutesAndNow = todayDate.diff(
      checkIn.create_at,
      'minutes',
    )

    const MAX_STANDIN_BY_CHECKIN_MINUTES = 20

    if (
      diffBetweenCheckinCreateAtMinutesAndNow >= MAX_STANDIN_BY_CHECKIN_MINUTES
    )
      throw new Error()

    checkIn.validate_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
