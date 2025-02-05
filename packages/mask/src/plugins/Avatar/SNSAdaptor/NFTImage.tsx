import { makeStyles } from '@masknet/theme'
import { ERC721TokenDetailed, isSameAddress } from '@masknet/web3-shared-evm'
import classNames from 'classnames'
import { SelectedIcon } from '../assets/selected'

const useStyles = makeStyles()((theme) => ({
    imgBackground: {
        position: 'relative',
        margin: theme.spacing(1.25, 1, 1.25, 1.5),
        borderRadius: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 20,
        height: 20,
        color: theme.palette.primary.main,
    },
    image: {
        width: 97,
        height: 97,
        objectFit: 'cover',
        borderRadius: '100%',
        boxSizing: 'border-box',
        '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
        },
    },
    selected: {
        border: `1px solid ${theme.palette.primary.main}`,
    },
}))

interface NFTImageProps {
    token: ERC721TokenDetailed
    selectedToken?: ERC721TokenDetailed
    onChange: (token: ERC721TokenDetailed) => void
    showBadge?: boolean
}

function isSameNFT(a: ERC721TokenDetailed, b?: ERC721TokenDetailed) {
    return (
        isSameAddress(a.contractDetailed.address, b?.contractDetailed.address) &&
        a.contractDetailed.chainId === b?.contractDetailed.chainId &&
        a.tokenId === b?.tokenId
    )
}

export function NFTImage(props: NFTImageProps) {
    const { token, onChange, selectedToken, showBadge = false } = props
    const { classes } = useStyles()

    return (
        <div className={classes.imgBackground}>
            <img
                onClick={() => onChange(token)}
                src={token.info.imageURL}
                className={classNames(classes.image, isSameNFT(token, selectedToken) ? classes.selected : '')}
            />
            {showBadge && isSameNFT(token, selectedToken) ? <SelectedIcon className={classes.icon} /> : null}
        </div>
    )
}
