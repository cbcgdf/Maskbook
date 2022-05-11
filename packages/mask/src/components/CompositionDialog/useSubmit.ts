import { useCallback } from 'react'
import Services from '../../extension/service'
import { RedPacketMetadataReader } from '../../plugins/RedPacket/SNSAdaptor/helpers'
import { ImageTemplateTypes, socialNetworkEncoder } from '@masknet/encryption'
import { activatedSocialNetworkUI, globalUIState } from '../../social-network'
import { isTwitter } from '../../social-network-adaptor/twitter.com/base'
import { I18NFunction, useI18N } from '../../utils'
import { SteganographyTextPayload } from '../InjectedComponents/SteganographyTextPayload'
import type { SubmitComposition } from './CompositionUI'
import { useLastRecognizedIdentity } from '../DataSource/useActivatedUI'
import { isFacebook } from '../../social-network-adaptor/facebook.com/base'
import { ITO_MetadataReader } from '../../plugins/ITO/SNSAdaptor/helpers'
import { FileInfoMetadataReader } from '@masknet/plugin-file-service'
import type { Meta } from '@masknet/typed-message'

export function useSubmit(onClose: () => void, reason: 'timeline' | 'popup' | 'reply') {
    const { t: t } = useI18N()
    const whoAmI = useLastRecognizedIdentity()

    return useCallback(
        async (info: SubmitComposition) => {
            const { content, encode, target } = info
            const currentProfile = globalUIState.profiles.value?.[0].identifier

            const _encrypted = await Services.Crypto.encryptTo(content, target, whoAmI?.identifier ?? currentProfile)
            const encrypted = socialNetworkEncoder(activatedSocialNetworkUI.encryptionNetwork, _encrypted)
            const decoratedText = decorateEncryptedText(encrypted, t, content.meta)

            if (encode === 'image') {
                const defaultText = t('additional_post_box__steganography_post_pre', {
                    random: new Date().toLocaleString(),
                })
                if (decoratedText !== null) {
                    await pasteImage(decoratedText.replace(encrypted, ''), encrypted, 'eth', reason)
                } else {
                    await pasteImage(defaultText, encrypted, 'v2', reason)
                }
            } else {
                pasteTextEncode(decoratedText ?? t('additional_post_box__encrypted_post_pre', { encrypted }), reason)
            }
            onClose()
        },
        [t, whoAmI, onClose, reason],
    )
}

function pasteTextEncode(text: string, reason: 'timeline' | 'popup' | 'reply') {
    activatedSocialNetworkUI.automation.nativeCompositionDialog?.appendText?.(text, {
        recover: true,
        reason,
    })
}
async function pasteImage(
    relatedTextPayload: string,
    encrypted: string,
    template: ImageTemplateTypes,
    reason: 'timeline' | 'popup' | 'reply',
) {
    const img = await SteganographyTextPayload(template, encrypted)
    // Don't await this, otherwise the dialog won't disappear
    activatedSocialNetworkUI.automation.nativeCompositionDialog!.attachImage!(img, {
        recover: true,
        relatedTextPayload,
        reason,
    })
}

// TODO: Provide API to plugin to postprocess post content,
// then we can move these -PreText's and meta readrs into plugin's own context
function decorateEncryptedText(encrypted: string, t: I18NFunction, meta?: Meta) {
    const hasOfficalAccount = isTwitter(activatedSocialNetworkUI) || isFacebook(activatedSocialNetworkUI)
    const officalAccount = isTwitter(activatedSocialNetworkUI) ? t('twitter_account') : t('facebook_account')

    if (RedPacketMetadataReader(meta).ok) {
        return hasOfficalAccount
            ? t('additional_post_box__encrypted_post_pre_red_packet_twitter_official_account', {
                  encrypted,
                  account: officalAccount,
              })
            : t('additional_post_box__encrypted_post_pre_red_packet', { encrypted })
    } else if (ITO_MetadataReader(meta).ok) {
        return hasOfficalAccount
            ? t('additional_post_box__encrypted_post_pre_ito_twitter_official_account', {
                  encrypted,
                  account: officalAccount,
              })
            : t('additional_post_box__encrypted_post_pre_ito', { encrypted })
    } else if (FileInfoMetadataReader(meta).ok) {
        return hasOfficalAccount
            ? t('additional_post_box__encrypted_post_pre_file_service_twitter_official_account', {
                  encrypted,
                  account: officalAccount,
              })
            : t('additional_post_box__encrypted_post_pre_file_service', { encrypted })
    }
    return ''
}
