import { makeStyles } from '@masknet/theme'
import { isSameAddress, useAccount } from '@masknet/web3-shared-evm'
import { Button, DialogContent, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { InjectedDialog } from '@masknet/shared'
import { InputBox } from '../../../extension/options-page/DashboardComponents/InputBox'
import { useI18N } from '../../../utils'
import { createNFT } from '../utils'
import type { Web3Plugin } from '@masknet/plugin-infra'

const useStyles = makeStyles()((theme) => ({
    root: {},
    addNFT: {
        position: 'absolute',
        right: 20,
        top: 10,
    },
    input: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    message: {
        '&:before': {
            content: '""',
            marginRight: theme.spacing(0.5),
            borderLeft: '2px solid',
        },
    },
}))
export interface AddNFTProps {
    onClose: () => void
    onAddClick: (token: Web3Plugin.NonFungibleAsset) => void
    open: boolean
}
export function AddNFT(props: AddNFTProps) {
    const { t } = useI18N()
    const { classes } = useStyles()
    const [address, setAddress] = useState('')
    const [tokenId, setTokenId] = useState('')
    const [message, setMessage] = useState('')
    const { onClose, open, onAddClick } = props
    const account = useAccount()

    const onClick = useCallback(async () => {
        if (!address) {
            setMessage(t('nft_input_address_label'))
            return
        }
        if (!tokenId) {
            setMessage(t('nft_input_tokenid_label'))
            return
        }

        createNFT(address, tokenId)
            .then((token) => {
                if (!token || !isSameAddress(token?.info.owner, account)) {
                    setMessage(t('nft_owner_hint'))
                    return
                }

                onAddClick(token)
                handleClose()
            })
            .catch((error) => setMessage(t('nft_owner_hint')))
    }, [tokenId, address, onAddClick, onClose])

    const onAddressChange = useCallback((address: string) => {
        setMessage('')
        setAddress(address)
    }, [])
    const onTokenIdChange = useCallback((tokenId: string) => {
        setMessage('')
        setTokenId(tokenId)
    }, [])

    const handleClose = () => {
        setMessage('')
        onClose()
    }

    return (
        <InjectedDialog title={t('nft_add_dialog_title')} open={open} onClose={handleClose}>
            <DialogContent>
                <Button className={classes.addNFT} variant="contained" size="small" onClick={onClick}>
                    {t('nft_add_button_label')}
                </Button>
                <div className={classes.input}>
                    <InputBox label="Input Contract Address" onChange={(address) => onAddressChange(address)} />
                </div>
                <div className={classes.input}>
                    <InputBox label="Token ID" onChange={(tokenId) => onTokenIdChange(tokenId)} />
                </div>
                {message ? (
                    <Typography color="error" className={classes.message}>
                        {message}
                    </Typography>
                ) : null}
            </DialogContent>
        </InjectedDialog>
    )
}
