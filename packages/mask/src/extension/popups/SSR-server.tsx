// ! This file is used during SSR. DO NOT import new files that does not work in SSR

import { Suspense } from 'react'
import {
    FacebookColoredIcon,
    InstagramColoredIcon,
    MindsIcon,
    TwitterColoredIcon,
    OpenSeaColoredIcon,
} from '@masknet/icons'
import { i18NextInstance, updateLanguage, EnhanceableSite, PopupRoutes } from '@masknet/shared-base'
import { once, noop } from 'lodash-unified'
import { TssCacheProvider, MaskThemeProvider } from '@masknet/theme'
import { CacheProvider } from '@emotion/react'
import { renderToString } from 'react-dom/server'
import createCache from '@emotion/cache'
import createEmotionServer from '@emotion/server/create-instance'
import { initReactI18next } from 'react-i18next'
import { addMaskI18N } from '../../../shared-ui/locales/languages'
import type { PopupSSR_Props } from '../../../background/tasks/Cancellable/PopupSSR/type'
import { StaticRouter } from 'react-router-dom/server'
import { PopupFrame } from './components/PopupFrame'
import { PersonaHomeUI } from './pages/Personas/Home/UI'
import { usePopupFullPageTheme } from '../../utils/theme/useClassicMaskFullPageTheme'

const init = once(() =>
    i18NextInstance.init().then(() => {
        addMaskI18N(i18NextInstance)
        initReactI18next.init(i18NextInstance)
    }),
)
export async function render(props: PopupSSR_Props) {
    await init()
    updateLanguage(props.language)
    const muiCache = createCache({ key: 'css' })
    const tssCache = createCache({ key: 'tss' })
    const tssServer = createEmotionServer(tssCache)
    const muiServer = createEmotionServer(muiCache)

    const html = renderToString(
        <CacheProvider value={muiCache}>
            <TssCacheProvider value={tssCache}>
                <PopupSSR {...props} />
            </TssCacheProvider>
        </CacheProvider>,
    )
        .replaceAll('href="/', 'href="#/')
        .replaceAll('href="#/dashboard', 'href="/dashboard')
    const muiCSS = muiServer.constructStyleTagsFromChunks(muiServer.extractCriticalToChunks(html))
    const tssCSS = tssServer.constructStyleTagsFromChunks(tssServer.extractCriticalToChunks(html))
    return { html, css: muiCSS + tssCSS }
}

const SOCIAL_MEDIA_ICON_MAPPING: Record<string, React.ReactNode> = {
    [EnhanceableSite.Facebook]: <FacebookColoredIcon />,
    [EnhanceableSite.Twitter]: <TwitterColoredIcon />,
    [EnhanceableSite.Instagram]: <InstagramColoredIcon />,
    [EnhanceableSite.Minds]: <MindsIcon />,
    [EnhanceableSite.OpenSea]: <OpenSeaColoredIcon />,
}
const DEFINED_SITES = [
    EnhanceableSite.Facebook,
    EnhanceableSite.Twitter,
    EnhanceableSite.Instagram,
    EnhanceableSite.Minds,
    EnhanceableSite.OpenSea,
]
function PopupSSR(props: PopupSSR_Props) {
    function useTheme() {
        return usePopupFullPageTheme(props.language)
    }
    return (
        <StaticRouter location={PopupRoutes.Personas}>
            <MaskThemeProvider useTheme={useTheme} CustomSnackbarOffsetY={0} useMaskIconPalette={() => 'light'}>
                <Suspense fallback={null}>
                    <PopupFrame>
                        <Suspense fallback={null}>
                            <PersonaHomeUI
                                accountsCount={2}
                                fetchProofsLoading
                                onEdit={noop}
                                onRestore={noop}
                                walletsCount={0}
                                onCreatePersona={noop}
                            />
                        </Suspense>
                    </PopupFrame>
                </Suspense>
            </MaskThemeProvider>
        </StaticRouter>
    )
}
