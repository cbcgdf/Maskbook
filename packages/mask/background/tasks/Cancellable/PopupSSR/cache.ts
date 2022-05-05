import { throttle } from 'lodash-unified'
import { MaskMessages } from '../../../../shared/messages'
import { InternalStorageKeys } from '../../../services/settings/utils'
import type { PopupSSR_Props } from './type'
import { getLanguagePreference } from '../../../services/settings'

export let cache: { html: string; css: string } = { html: '', css: '' }
export function startListen(
    render: (props: PopupSSR_Props) => Promise<{ html: string; css: string }>,
    signal: AbortSignal,
) {
    const task = throttle(
        async function task() {
            cache = await prepareData().then(render)
        },
        2000,
        { leading: true },
    )

    task()?.then(() => console.log('[Popup SSR] Page ready.'))
    MaskMessages.events.ownPersonaChanged.on(task, { signal })
    MaskMessages.events.createInternalSettingsUpdated.on(
        (event) => {
            if (event.initial) return
            if (event.key === InternalStorageKeys.currentPersona || event.key === InternalStorageKeys.language) task()
        },
        { signal },
    )
}

async function prepareData(): Promise<PopupSSR_Props> {
    const language = getLanguagePreference()

    return {
        language: await language,
    }
}
