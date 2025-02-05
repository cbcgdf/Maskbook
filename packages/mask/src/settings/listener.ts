import { appearanceSettings, pluginIDSettings, languageSettings, currentPersonaIdentifier } from './settings'
import type { MaskSettingsEvents } from '@masknet/shared-base'
import {
    currentAccountSettings,
    currentChainIdSettings,
    currentNonFungibleAssetDataProviderSettings,
    currentNetworkSettings,
    currentFungibleAssetDataProviderSettings,
    currentProviderSettings,
    currentTokenPricesSettings,
} from '../plugins/Wallet/settings'
import { currentDataProviderSettings } from '../plugins/Trader/settings'
import type { InternalSettings } from './createSettings'

type ToBeListedSettings = { [key in keyof MaskSettingsEvents]: InternalSettings<MaskSettingsEvents[key]> }
export function ToBeListened(): ToBeListedSettings {
    return {
        appearanceSettings,
        pluginIDSettings,
        languageSettings,
        currentChainIdSettings,
        currentTokenPricesSettings,
        currentDataProviderSettings,
        currentProviderSettings,
        currentNetworkSettings,
        currentAccountSettings,
        currentFungibleAssetDataProviderSettings,
        currentNonFungibleAssetDataProviderSettings,
        currentPersonaIdentifier,
    }
}
