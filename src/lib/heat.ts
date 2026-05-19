export const HEAT_PALETTE = [
    '#FFFFFF',
    '#EDE3CE',
    '#D6C29F',
    '#B49866',
    '#7E6038',
    '#46311A',
] as const

export function pickHeat(count: number, total: number): string {
    if (total === 0 || count === 0) return HEAT_PALETTE[0]
    const ratio = count / total
    if (ratio <= 0) return HEAT_PALETTE[0]
    if (ratio < 0.2) return HEAT_PALETTE[1]
    if (ratio < 0.4) return HEAT_PALETTE[2]
    if (ratio < 0.6) return HEAT_PALETTE[3]
    if (ratio < 0.8) return HEAT_PALETTE[4]
    return HEAT_PALETTE[5]
}

export function pickFg(hex: string): string {
    if (!hex || hex[0] !== '#' || hex.length < 7) return '#161514'
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    return lum < 0.55 ? '#FAF6E8' : '#161514'
}
