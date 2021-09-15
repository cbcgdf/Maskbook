/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type ClaimSuccess = ContractEventLog<{
    id: string
    claimer: string
    claimed_token_id: string
    token_address: string
    0: string
    1: string
    2: string
    3: string
}>
export type CreationSuccess = ContractEventLog<{
    total_tokens: string
    id: string
    name: string
    message: string
    creator: string
    creation_time: string
    token_address: string
    packet_number: string
    duration: string
    token_ids: string[]
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
    7: string
    8: string
    9: string[]
}>
export type RefundSuccess = ContractEventLog<{
    id: string
    token_address: string
    remaining_balance: string
    remaining_token_ids: string[]
    bit_status: string
    0: string
    1: string
    2: string
    3: string[]
    4: string
}>

export interface NftHappyRedPacket extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): NftHappyRedPacket
    clone(): NftHappyRedPacket
    methods: {
        check_availability(pkt_id: string | number[]): NonPayableTransactionObject<{
            token_address: string
            balance: string
            total_pkts: string
            expired: boolean
            claimed_id: string
            bit_status: string
            0: string
            1: string
            2: string
            3: boolean
            4: string
            5: string
        }>

        check_claimed_id(id: string | number[]): NonPayableTransactionObject<string>

        check_erc721_remain_ids(id: string | number[]): NonPayableTransactionObject<{
            bit_status: string
            erc721_token_ids: string[]
            0: string
            1: string[]
        }>

        check_ownership(
            erc721_token_id_list: (number | string | BN)[],
            token_addr: string,
        ): NonPayableTransactionObject<boolean>

        claim(
            pkt_id: string | number[],
            signedMsg: string | number[],
            recipient: string,
        ): NonPayableTransactionObject<string>

        create_red_packet(
            _public_key: string,
            _duration: number | string | BN,
            _seed: string | number[],
            _message: string,
            _name: string,
            _token_addr: string,
            _erc721_token_ids: (number | string | BN)[],
        ): NonPayableTransactionObject<void>

        initialize(): NonPayableTransactionObject<void>

        refund(id: string | number[]): NonPayableTransactionObject<void>
    }
    events: {
        ClaimSuccess(cb?: Callback<ClaimSuccess>): EventEmitter
        ClaimSuccess(options?: EventOptions, cb?: Callback<ClaimSuccess>): EventEmitter

        CreationSuccess(cb?: Callback<CreationSuccess>): EventEmitter
        CreationSuccess(options?: EventOptions, cb?: Callback<CreationSuccess>): EventEmitter

        RefundSuccess(cb?: Callback<RefundSuccess>): EventEmitter
        RefundSuccess(options?: EventOptions, cb?: Callback<RefundSuccess>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'ClaimSuccess', cb: Callback<ClaimSuccess>): void
    once(event: 'ClaimSuccess', options: EventOptions, cb: Callback<ClaimSuccess>): void

    once(event: 'CreationSuccess', cb: Callback<CreationSuccess>): void
    once(event: 'CreationSuccess', options: EventOptions, cb: Callback<CreationSuccess>): void

    once(event: 'RefundSuccess', cb: Callback<RefundSuccess>): void
    once(event: 'RefundSuccess', options: EventOptions, cb: Callback<RefundSuccess>): void
}