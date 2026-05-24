import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs))
}

export const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || ''

export const appShortUrl = () => process.env.NEXT_PUBLIC_APP_URL_SHORT || ''

export const appVersion = () => process.env.NEXT_PUBLIC_APP_VERSION || ''
