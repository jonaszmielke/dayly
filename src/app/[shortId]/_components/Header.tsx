import { Meeting } from '@prisma/client'

const MeetingHeader = ({ meeting }: { meeting: Meeting }) => {
    /* 
        header on summary page says: 12 JUN — 26 JUL 2026 • DAY MODE • 5 RESPONSES
        header on survey says: 12 JUN — 26 JUL 2026 • DAY MODE • RESPOND BY 31 MAY

        let's just do 12 JUN — 26 JUL 2026 • DAY MODE
        so that the header is the same on both pages and needs only data from meeting object
    */
    return <div>{meeting.name}</div>
}

export default MeetingHeader
