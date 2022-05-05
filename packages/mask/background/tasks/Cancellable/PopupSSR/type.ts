import type { LanguageOptions } from '@masknet/public-api'

export interface PopupSSR_Props {
    language: LanguageOptions
    currentFingerPrint: string | undefined
    hasPersona: boolean
    avatar: string | null
    nickname: string | undefined
    linkedProfilesCount: number
    // walletsCount: number
}
