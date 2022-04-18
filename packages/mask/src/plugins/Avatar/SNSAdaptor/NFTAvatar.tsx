import { useCallback, useState } from 'react'
import { uniqBy } from 'lodash-unified'
import { WalletMessages } from '@masknet/plugin-wallet'
import { useRemoteControlledDialog } from '@masknet/shared-base-ui'
import { makeStyles, useStylesExtends } from '@masknet/theme'
import { ChainId, useChainId, useImageChecker } from '@masknet/web3-shared-evm'
import { Box, Button, Skeleton, Typography } from '@mui/material'
import { useI18N } from '../../../utils'
import { EthereumChainBoundary } from '../../../web3/UI/EthereumChainBoundary'
import { AddNFT } from './AddNFT'
import { NFTImage } from './NFTImage'
import { useAccount, useNonFungibleAssets, useWeb3State, Web3Plugin } from '@masknet/plugin-infra/web3'
import { ReversedAddress } from '@masknet/shared'
import { IteratorCollectorStatus } from '@masknet/web3-shared-base'

const useStyles = makeStyles()((theme) => ({
    root: {},
    title: {
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 14,
        alignItems: 'center',
    },
    account: {
        display: 'flex',
        alignItems: 'center',
    },
    galleryItem: {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 4,
        padding: theme.spacing(1),
    },
    gallery: {
        display: 'flex',
        flexFlow: 'row wrap',
        height: 150,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    button: {
        textAlign: 'center',
        paddingTop: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    setNFTAvatar: {},
    skeleton: {
        width: 97,
        height: 97,
        objectFit: 'cover',
        borderRadius: '100%',
        boxSizing: 'border-box',
        padding: 6,
        margin: theme.spacing(0.5, 1),
    },
    skeletonBox: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    error: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
    },
    changeButton: {
        fontSize: 14,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: theme.spacing(1),
        gap: 16,
    },
}))

export interface NFTAvatarProps extends withClasses<'root'> {
    onChange: (token: Web3Plugin.NonFungibleAsset) => void
    hideWallet?: boolean
}

export function NFTAvatar(props: NFTAvatarProps) {
    const { onChange, hideWallet } = props
    const classes = useStylesExtends(useStyles(), props)
    const account = useAccount()
    const chainId = useChainId()
    const [selectedToken, setSelectedToken] = useState<Web3Plugin.NonFungibleAsset | undefined>()
    const [open_, setOpen_] = useState(false)
    const [collectibles_, setCollectibles_] = useState<Web3Plugin.NonFungibleAsset[]>([])
    const { t } = useI18N()
    const { Utils } = useWeb3State()
    const { data: collectibles, status } = useNonFungibleAssets(account, ChainId.Mainnet)

    const onClick = useCallback(async () => {
        if (!selectedToken) return
        onChange(selectedToken)
        setSelectedToken(undefined)
    }, [onChange, selectedToken])

    const onAddClick = useCallback((token: Web3Plugin.NonFungibleAsset) => {
        setSelectedToken(token)
        setCollectibles_((tokens) => uniqBy([token, ...tokens], (x) => `${x.contract?.address}_${x.tokenId}`))
    }, [])

    const { openDialog: openSelectProviderDialog } = useRemoteControlledDialog(
        WalletMessages.events.selectProviderDialogUpdated,
    )

    const LoadStatus = Array.from({ length: 8 })
        .fill(0)
        .map((_, i) => (
            <div key={i} className={classes.skeletonBox}>
                <Skeleton animation="wave" variant="rectangular" className={classes.skeleton} />
            </div>
        ))
    const Retry = (
        <Box className={classes.error}>
            <Typography color="textSecondary">{t('dashboard_no_collectible_found')}</Typography>
            {/* // TODO: add retry */}
            <Button className={classes.button} variant="text" onClick={() => {}}>
                {t('plugin_collectible_retry')}
            </Button>
        </Box>
    )
    return (
        <>
            <Box className={classes.root}>
                <Box className={classes.title}>
                    <Typography variant="body1" color="textPrimary">
                        {t('nft_list_title')}
                    </Typography>
                    {account ? (
                        <Typography variant="body1" color="textPrimary" className={classes.account}>
                            {t('nft_wallet_label')}: <ReversedAddress address={account} size={4} />
                            {!hideWallet ? (
                                <Button
                                    variant="text"
                                    onClick={openSelectProviderDialog}
                                    size="small"
                                    className={classes.changeButton}>
                                    {t('nft_wallet_change')}
                                </Button>
                            ) : null}
                        </Typography>
                    ) : null}
                </Box>
                <EthereumChainBoundary hiddenConnectButton chainId={chainId}>
                    <Box className={classes.galleryItem}>
                        <Box className={classes.gallery}>
                            {status !== IteratorCollectorStatus.done && collectibles.length === 0
                                ? LoadStatus
                                : status === IteratorCollectorStatus.error ||
                                  (collectibles.length === 0 && collectibles_.length === 0)
                                ? Retry
                                : uniqBy(
                                      [...collectibles_, ...collectibles],
                                      (x) => `${x.contract?.address}_ ${x.tokenId}`,
                                  ).map((token: Web3Plugin.NonFungibleAsset, i) => (
                                      <NFTImageCollectibleAvatar
                                          key={i}
                                          token={token}
                                          selectedToken={selectedToken}
                                          setSelectedToken={setSelectedToken}
                                      />
                                  ))}
                        </Box>
                        <Box className={classes.buttons}>
                            <Button variant="outlined" size="small" onClick={() => setOpen_(true)}>
                                {t('nft_button_add_collectible')}
                            </Button>

                            <Button variant="contained" size="small" onClick={onClick} disabled={!selectedToken}>
                                {t('nft_button_set_avatar')}
                            </Button>
                        </Box>
                    </Box>
                </EthereumChainBoundary>
            </Box>
            <AddNFT open={open_} onClose={() => setOpen_(false)} onAddClick={onAddClick} />
        </>
    )
}
interface NFTImageCollectibleAvatarProps {
    token: Web3Plugin.NonFungibleAsset
    setSelectedToken: React.Dispatch<React.SetStateAction<Web3Plugin.NonFungibleAsset | undefined>>
    selectedToken?: Web3Plugin.NonFungibleAsset
}

function NFTImageCollectibleAvatar({ token, setSelectedToken, selectedToken }: NFTImageCollectibleAvatarProps) {
    const { classes } = useStyles()
    const { value: isImageToken, loading } = useImageChecker(token.info?.imageURL)
    if (loading)
        return (
            <div className={classes.skeletonBox}>
                <Skeleton animation="wave" variant="rectangular" className={classes.skeleton} />
            </div>
        )
    return isImageToken ? <NFTImage token={token} selectedToken={selectedToken} onChange={setSelectedToken} /> : null
}
