import { useId } from 'react'
import { redirect } from 'next/navigation'

const findRoom = async (formData: FormData) => {
    'use server'
    const code = formData.get('code')
    if (typeof code !== 'string' || !code.trim()) return
    redirect(`/m/${code.trim().toLowerCase()}`)
}

export const RoomCodeCard = () => {
    const inputId = useId()

    return (
        <div
            className="bg-white border-2 border-ink p-4.5 lg:p-5.5"
            style={{ boxShadow: '6px 6px 0 #161514' }}
        >
            <div className="mb-3.5 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center bg-ink text-paper-2 font-mono text-[11px] font-semibold tracking-[0.04em] px-2 py-0.75 leading-none">
                    01
                </span>
                <label
                    htmlFor={inputId}
                    className="font-sans text-[16px] font-extrabold tracking-[-0.005em]"
                >
                    Try the code again
                </label>
            </div>

            <form
                action={findRoom}
                className="grid gap-2.5"
                style={{ gridTemplateColumns: '1fr auto' }}
            >
                <input
                    id={inputId}
                    type="text"
                    name="code"
                    placeholder="ROOM-CODE"
                    className="bg-paper border-thin border-ink px-4 py-3.5 font-mono text-[18px] lg:text-[20px] font-semibold uppercase tracking-[0.16em] placeholder:text-ink/35 placeholder:font-medium outline-none focus:bg-white min-w-0"
                    required
                />
                <button
                    type="submit"
                    className="px-4 lg:px-5.5 bg-ink text-paper-2 border-thin border-ink shadow-brutal-sm press-effect font-sans text-[13px] lg:text-[14px] font-extrabold tracking-[0.08em] inline-flex items-center gap-2"
                >
                    <span>Find</span>
                    <span aria-hidden="true">→</span>
                </button>
            </form>

            <p className="mt-3 font-mono text-[10.5px] tracking-[0.08em] text-ink/55">
                <b className="text-ink font-bold">Tip.</b> Meetings have 8 character alpha-numeric
                codes <code className="text-ink/70">AB12DE34</code>.
            </p>
        </div>
    )
}
