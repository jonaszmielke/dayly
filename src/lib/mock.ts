import { MeetingMode } from '@prisma/client'
import { dateRange } from './dates'

export const MOCK_MEETING = {
    id: 'mock-id',
    shortId: 'mock',
    mode: MeetingMode.DAYS,
    name: 'PRAGUE TRIP',
    startDate: new Date('2026-06-12T00:00:00'),
    endDate: new Date('2026-07-26T00:00:00'),
    deadline: new Date('2026-05-31T00:00:00'),
    createdAt: new Date('2026-05-01T00:00:00'),
    updatedAt: new Date('2026-05-01T00:00:00'),
}

const now = new Date('2026-05-01T00:00:00')

export const MOCK_RESPONSES = [
    {
        id: 'r1',
        meetingId: 'mock-id',
        userName: 'Tomáš',
        days: [
            ...dateRange('2026-06-13', '2026-06-21'),
            ...dateRange('2026-07-04', '2026-07-12'),
        ].map((d) => new Date(d + 'T00:00:00')),
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'r2',
        meetingId: 'mock-id',
        userName: 'Marta',
        days: [
            ...dateRange('2026-06-20', '2026-06-28'),
            ...dateRange('2026-07-03', '2026-07-07'),
        ].map((d) => new Date(d + 'T00:00:00')),
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'r3',
        meetingId: 'mock-id',
        userName: 'Klára',
        days: [
            ...dateRange('2026-06-20', '2026-06-26'),
            ...dateRange('2026-07-18', '2026-07-26'),
        ].map((d) => new Date(d + 'T00:00:00')),
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'r4',
        meetingId: 'mock-id',
        userName: 'Jakub',
        days: [
            ...dateRange('2026-06-14', '2026-06-22'),
            ...dateRange('2026-07-11', '2026-07-19'),
        ].map((d) => new Date(d + 'T00:00:00')),
        createdAt: now,
        updatedAt: now,
    },
    {
        id: 'r5',
        meetingId: 'mock-id',
        userName: 'Eva',
        days: [
            ...dateRange('2026-06-20', '2026-06-28'),
            ...dateRange('2026-07-15', '2026-07-26'),
        ].map((d) => new Date(d + 'T00:00:00')),
        createdAt: now,
        updatedAt: now,
    },
]
