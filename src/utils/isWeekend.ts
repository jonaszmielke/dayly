export const isWeekend = (iso: string): boolean => {
    const d = new Date(iso + 'T00:00:00')
    const dow = d.getDay()
    return dow === 0 || dow === 6
}
