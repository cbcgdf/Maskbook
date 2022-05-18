import type { Plugin } from '@masknet/plugin-infra'
import { RiskWarningState } from '@masknet/plugin-infra/web3'
import { RiskWanring } from '@masknet/web3-providers'
import { formatEthereumAddress } from '@masknet/web3-shared-evm'

export class RiskWarning extends RiskWarningState {
    constructor(context: Plugin.Shared.SharedContext) {
        super(context, {
            formatAddress: formatEthereumAddress,
        })
    }

    override async approve(address: string, pluginID?: string | undefined) {
        await RiskWanring.approve(address, pluginID)
        super.approve(address)
    }
}