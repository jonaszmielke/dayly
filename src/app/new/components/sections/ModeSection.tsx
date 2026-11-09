import { CreateSection } from '../CreateSection'
import { ModeCard } from '../ModeCard'
import { MeetingMode } from '@/generated/prisma/enums'

// Highlighted squares in each mode card's 7×2 preview glyph.
const DAYS_GLYPH_CELLS = [2, 5, 7, 8, 9, 12]
const HOURS_GLYPH_CELLS = [3, 4, 5, 10, 11]

type ModeSectionProps = {
    mode: MeetingMode
    onModeChange: (mode: MeetingMode) => void
}

export const ModeSection = ({ mode, onModeChange }: ModeSectionProps) => (
    <CreateSection number="02" title="Meeting Mode" hint="HOW DO WE PICK?">
        <div className="grid grid-cols-2 gap-4">
            <ModeCard
                active={mode === MeetingMode.DAYS}
                onClick={() => onModeChange(MeetingMode.DAYS)}
                title="Day-only"
                desc="Pick full days you're free"
                glyphCells={DAYS_GLYPH_CELLS}
            />
            <ModeCard
                active={mode === MeetingMode.HOURS}
                onClick={() => onModeChange(MeetingMode.HOURS)}
                title="By Hour"
                desc="Pick specific time slots"
                glyphCells={HOURS_GLYPH_CELLS}
            />
        </div>
    </CreateSection>
)
