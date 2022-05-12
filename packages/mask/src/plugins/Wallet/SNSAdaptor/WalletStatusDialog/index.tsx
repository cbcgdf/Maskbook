import { useCallback } from 'react'
import { DialogActions, DialogContent, Typography } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import { makeStyles } from '@masknet/theme'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { InjectedDialog } from '@masknet/shared'
import { CrossIsolationMessages, isDashboardPage } from '@masknet/shared-base'
import { NetworkPluginID } from '@masknet/web3-shared-base'
import { useChainIdValid } from '@masknet/plugin-infra/web3'
import { WalletStatusBox } from '../../../../components/shared/WalletStatusBox'
import { useI18N } from '../../../../utils'
import { WalletMessages } from '../../messages'
import { ApplicationBoard } from '../../../../components/shared/ApplicationBoard'

const useStyles = makeStyles()((theme) => ({
    content: {
        padding: theme.spacing(2, 3, 3),
    },
    footer: {
        fontSize: 12,
        textAlign: 'left',
        padding: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        justifyContent: 'flex-start',
    },
    address: {
        fontSize: 16,
        marginRight: theme.spacing(1),
        display: 'inline-block',
    },
    subTitle: {
        fontSize: 18,
        lineHeight: '24px',
        fontWeight: 600,
        marginBottom: 11.5,
        color: theme.palette.text.primary,
    },
}))

export interface WalletStatusDialogProps {}

export function WalletStatusDialog(props: WalletStatusDialogProps) {
    const { t } = useI18N()

    const { classes } = useStyles()
    const chainIdValid = useChainIdValid(NetworkPluginID.PLUGIN_EVM)

    // #region remote controlled dialog logic
    const { open, closeDialog: _closeDialog } = useRemoteControlledDialog(
        WalletMessages.events.walletStatusDialogUpdated,
    )

    const closeDialog = useCallback(() => {
        _closeDialog()
        CrossIsolationMessages.events.requestComposition.sendToLocal({
            reason: 'timeline',
            open: false,
        })
    }, [])
    // #endregion

    return (
        <InjectedDialog title="Mask Network" open={open} onClose={closeDialog} maxWidth="sm">
            <DialogContent className={classes.content}>
                <Typography className={classes.subTitle}>{t('wallets')}</Typography>
                <WalletStatusBox />
                {!isDashboardPage() && (
                    <>
                        <Typography className={classes.subTitle}>{t('applications')}</Typography>
                        <ApplicationBoard />
                    </>
                )}
            </DialogContent>
            {!chainIdValid ? (
                <DialogActions className={classes.footer}>
                    <ErrorIcon color="secondary" fontSize="small" sx={{ marginRight: 1 }} />
                    <Typography color="secondary" variant="body2">
                        {t('plugin_wallet_wrong_network_tip')}
                    </Typography>
                </DialogActions>
            ) : null}
        </InjectedDialog>
    )
}
