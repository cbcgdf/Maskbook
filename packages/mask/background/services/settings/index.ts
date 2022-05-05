import { LanguageOptions } from '@masknet/public-api'
import { getBrowserStorageUnchecked, InternalStorageKeys } from './utils'

export { __kv_storage_read__, __kv_storage_write__ } from './kv-storage'
export async function getLanguagePreference(): Promise<LanguageOptions> {
    const raw = String(await getBrowserStorageUnchecked(InternalStorageKeys.language))

    if (Object.values(LanguageOptions).some((x) => x === raw)) return raw as LanguageOptions
    return LanguageOptions.__auto__
}
