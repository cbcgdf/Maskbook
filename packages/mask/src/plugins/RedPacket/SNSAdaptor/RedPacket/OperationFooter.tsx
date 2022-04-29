import { WalletMessages } from '@masknet/plugin-wallet'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { useAccount, useChainIdValid } from '@masknet/web3-shared-evm'
import { Box } from '@mui/material'
import ActionButton from '../../../../extension/options-page/DashboardComponents/ActionButton'
import { useI18N } from '../../../../utils'
import { EthereumWalletConnectedBoundary } from '../../../../web3/UI/EthereumWalletConnectedBoundary'
import { useStyles } from './useStyles'

interface OperationFooterProps {
    canClaim: boolean
    canRefund: boolean
    isClaiming: boolean
    isRefunding: boolean
    onShare?(): void
    onClaimOrRefund: () => void | Promise<void>
}
export function OperationFooter({
    canClaim,
    canRefund,
    isClaiming,
    isRefunding,
    onShare,
    onClaimOrRefund,
}: OperationFooterProps) {
    const { classes } = useStyles()
    const { t } = useI18N()
    const account = useAccount()
    const chainIdValid = useChainIdValid()

    // #region remote controlled select provider dialog
    const { openDialog: openSelectProviderDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectProviderDialogUpdated,
    )
    // #endregion

    const ObtainButton = () => {
        if (!canClaim && !canRefund) return null

        if (!account) {
            return (
                <ActionButton variant="contained" fullWidth size="large" onClick={openSelectProviderDialog}>
                    {t('plugin_wallet_connect_a_wallet')}
                </ActionButton>
            )
        }
        if (!chainIdValid) {
            return (
                <ActionButton disabled variant="contained" fullWidth size="large">
                    {t('plugin_wallet_invalid_network')}
                </ActionButton>
            )
        }
        const isLoading = isClaiming || isRefunding

        return (
            <ActionButton
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                variant="contained"
                size="large"
                onClick={onClaimOrRefund}>
                {canClaim
                    ? isClaiming
                        ? t('plugin_red_packet_claiming')
                        : t('plugin_red_packet_claim')
                    : isRefunding
                    ? t('plugin_red_packet_refunding')
                    : t('plugin_red_packet_refund')}
            </ActionButton>
        )
    }

    return (
        <EthereumWalletConnectedBoundary
            classes={{
                connectWallet: classes.connectWallet,
            }}>
            <Box className={classes.footer}>
                {canRefund ? null : (
                    <ActionButton variant="contained" fullWidth size="large" onClick={onShare}>
                        {t('share')}
                    </ActionButton>
                )}
                <ObtainButton />
            </Box>
        </EthereumWalletConnectedBoundary>
    )
}
