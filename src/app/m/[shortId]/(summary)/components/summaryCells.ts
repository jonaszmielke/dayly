import { type SummaryPerson } from './cells/summarySlot'

/** Everything the summary cells need from the page, shared by the day and hour grids. */
export type SummaryCellsState = {
    people: SummaryPerson[]
    selectedPersonId: number | null
    /** Key of the cell under the mouse; always null on the compact (mobile) layout. */
    hoveredKey: string | null
    /** Key of the cell whose detail sheet is open. */
    selectedKey: string | null
    isTouch: boolean
    onCellEnter: (key: string) => void
    onCellLeave: () => void
    onCellTap: (key: string) => void
}
