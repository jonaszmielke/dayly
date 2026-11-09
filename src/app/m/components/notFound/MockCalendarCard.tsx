import { MockCalendarGrid } from './MockCalendarGrid'
import { MockCalendarHeader } from './MockCalendarHeader'

/** Decorative empty calendar with a 404 stamp. Hidden from screen readers. */
export const MockCalendarCard = () => (
    // overflow-visible so the rotated tape isn't clipped
    <div aria-hidden="true" className="relative self-stretch mt-4 lg:mt-0 overflow-visible">
        <div
            className="relative bg-white border-2 border-ink w-full overflow-visible"
            style={{ transform: 'rotate(0.4deg)', boxShadow: '10px 10px 0 #161514' }}
        >
            <Tape />
            <MockCalendarHeader />
            <MockCalendarGrid />
            <NotFoundStamp />
        </div>
    </div>
)

const Tape = () => (
    <div
        className="absolute -top-4 left-7 bg-ink text-paper font-mono text-[10.5px] font-semibold uppercase tracking-[0.2em] px-3 py-[6px] z-[2] whitespace-nowrap"
        style={{ transform: 'rotate(-2deg)', boxShadow: '3px 3px 0 #7e6038' }}
    >
        DAYLY · ROOM · not found
    </div>
)

const NotFoundStamp = () => (
    <div
        className="absolute pointer-events-none whitespace-nowrap text-center bg-danger text-paper border-[3px] border-ink"
        style={{
            top: '38%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-6deg)',
            padding: '12px 20px 14px',
            boxShadow: '6px 6px 0 #161514',
        }}
    >
        <div className="font-sans text-[32px] lg:text-[44px] font-extrabold leading-[0.9] tracking-[0.04em]">
            404
        </div>
        <div className="font-mono text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.24em] mt-[6px] text-paper/80">
            NO SUCH ROOM
        </div>
    </div>
)
