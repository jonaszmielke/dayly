export const NotFoundIntro = () => (
    <>
        <h1
            className="font-sans font-extrabold leading-[0.86] tracking-[-0.045em] mb-2"
            style={{ fontSize: 'clamp(40px, 12vw, 88px)' }}
        >
            Nothing on the <em className="not-italic text-danger">calendar</em> here.
        </h1>

        <p className="font-sans text-[16px] lg:text-[18px] font-medium max-w-115 text-ink/72 leading-[1.4]">
            We couldn&apos;t find the survey you were looking for. The code might be mistyped, or
            the room may have expired.
        </p>
    </>
)
