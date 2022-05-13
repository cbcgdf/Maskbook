import bs58 from 'bs58'
import type { Transaction } from '@solana/web3.js'
import { injectedPhantomProvider } from '@masknet/injected-script'
import { PhantomMethodType, ProviderType } from '@masknet/web3-shared-solana'
import type { SolanaProvider } from '../types'
import { BaseInjectedProvider } from './BaseInjected'

export class PhantomProvider extends BaseInjectedProvider implements SolanaProvider {
    constructor() {
        super(ProviderType.Phantom, injectedPhantomProvider)
    }

    override signMessage(dataToSign: string) {
        return this.bridge.request<string>({
            method: PhantomMethodType.SIGN_MESSAGE,
            params: {
                message: new TextEncoder().encode(dataToSign),
                display: 'hex',
            },
        })
    }

    override signTransaction(transaction: Transaction) {
        return this.bridge.request<Transaction>({
            method: PhantomMethodType.SIGN_TRANSACTION,
            params: {
                mesasage: bs58.encode(transaction.serializeMessage()),
            },
        })
    }

    override async signTransactions(transactions: Transaction[]) {
        return this.bridge.request<Transaction[]>({
            method: 'signAllTransactions',
            params: {
                message: transactions.map((transaction) => {
                    return bs58.encode(transaction.serializeMessage())
                }),
            },
        })
    }
}
