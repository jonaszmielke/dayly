import { Response as PrismaResponse } from '@prisma/client'

export type Response = Pick<PrismaResponse, 'id' | 'userName' | 'days'>

export type Person = {
    id: number
    name: string
    availSet: Set<string>
    daysCount: number
}
