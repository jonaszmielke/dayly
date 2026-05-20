import { customAlphabet } from 'nanoid'

// Avoid ambiguous chars (0/O, 1/l/I) for easier sharing
const alphabet = '23456789abcdefghjkmnpqrstuvwxyz' as const
export const generateMeetingId = customAlphabet(alphabet, 8)
