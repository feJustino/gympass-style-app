import { CheckIn } from '@/generated/prisma'
import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'

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

    checkIn.validate_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
