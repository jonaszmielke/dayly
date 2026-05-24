import type { Response as PrismaResponse } from '@/generated/prisma/client'

export type Response = Pick<PrismaResponse, 'id' | 'userName' | 'days'>

export type Person = {
    id: number
    name: string
    availSet: Set<string>
    daysCount: number
}
