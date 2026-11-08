import { HEAT_PALETTE, pickFg, pickHeat } from '@/lib/heat'

export type SummaryPerson = {
    id: number
    name: string
    availSet: Set<string>
}

export type SlotStats = {
    freeCount: number
    total: number
    /** `null` when no person is selected: the slot shows the group count instead. */
    isSelectedPersonAvailable: boolean | null
    heat: string
    fg: string
}

const getSelectedPersonAvailability = (
    people: SummaryPerson[],
    key: string,
    selectedPersonId: number | null
): boolean | null => {
    if (selectedPersonId === null) return null
    const person = people.find((p) => p.id === selectedPersonId)
    return person?.availSet.has(key) ?? false
}

const getHeat = (
    freeCount: number,
    total: number,
    isSelectedPersonAvailable: boolean | null
): string => {
    if (isSelectedPersonAvailable === true) return HEAT_PALETTE[4]
    if (isSelectedPersonAvailable === false) return HEAT_PALETTE[0]
    return pickHeat(freeCount, total)
}

export const getSlotStats = (
    people: SummaryPerson[],
    key: string,
    selectedPersonId: number | null
): SlotStats => {
    const freeCount = people.filter((p) => p.availSet.has(key)).length
    const total = people.length
    const isSelectedPersonAvailable = getSelectedPersonAvailability(people, key, selectedPersonId)
    const heat = getHeat(freeCount, total, isSelectedPersonAvailable)

    return { freeCount, total, isSelectedPersonAvailable, heat, fg: pickFg(heat) }
}

export const getTipPeople = (people: SummaryPerson[], key: string) =>
    people.map((p) => ({ name: p.name, available: p.availSet.has(key) }))

export const getOutlineShadow = (isSelected: boolean, isHovered: boolean): string | undefined => {
    if (isSelected) return 'inset 0 0 0 2.5px #161514'
    if (isHovered) return 'inset 0 0 0 3px #161514'
    return undefined
}

export const getSlotAriaLabel = (heading: string, stats: SlotStats): string => {
    if (stats.isSelectedPersonAvailable === true) return `${heading}: available`
    if (stats.isSelectedPersonAvailable === false) return `${heading}: not available`
    return `${heading}: ${stats.freeCount} of ${stats.total} available`
}
