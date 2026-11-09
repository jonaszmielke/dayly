export const BurgerButton = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        className="flex items-center justify-center size-9  bg-white border-2 border-ink font-sans text-[20px] font-bold leading-none"
        style={{ boxShadow: '3px 3px 0 #161514' }}
        onClick={onClick}
        aria-label="Open menu"
    >
        ≡
    </button>
)
