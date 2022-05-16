/* eslint-disable no-restricted-imports */
import { promises as fs, readdirSync } from 'fs'
import { difference, keys, uniq } from 'lodash-unified'
import { resolve, relative } from 'path'
import { EXTENSION_SOURCE, ROOT_PATH, walk } from '../utils'
import { getUsedKeys } from './ast'

export const LOCALE_PATH = resolve(EXTENSION_SOURCE, '../shared-ui/locales')
export const LOCALE_NAMES = readdirSync(LOCALE_PATH)
    .filter((name) => name.endsWith('.json'))
    .map((x) => x.slice(0, -5))

export function getMessagePath(name: string) {
    return resolve(LOCALE_PATH, name + '.json')
}

export function getLocaleRelativePath(...paths: string[]) {
    return relative(ROOT_PATH, resolve(LOCALE_PATH, ...paths))
}

export async function readMessages(name: string) {
    return JSON.parse(await fs.readFile(getMessagePath(name), 'utf-8'))
}

export async function writeMessages(name: string, messages: unknown) {
    await fs.writeFile(getMessagePath(name), JSON.stringify(messages, null, 4) + '\n', 'utf-8')
}

export async function findAllUsedKeys() {
    const usedKeys: string[] = []
    for await (const file of walk(EXTENSION_SOURCE, /\.(tsx?)$/)) {
        usedKeys.push(...getUsedKeys(await fs.readFile(file, 'utf-8')))
    }
    const en: Record<string, string> = await readMessages('en-US')
    const allKeys = keys(en)
    // Plural and context keys
    allKeys.forEach((key) => {
        const [, base] = key.match(/(.*?)\$\w+$/) ?? []
        if (base && usedKeys.includes(base)) {
            usedKeys.push(key)
        }
    })
    // Nested keys
    allKeys.forEach((key) => {
        if (!usedKeys.includes(key)) return
        const nestedExpList = en[key].match(/\$t\(.*?\)/g)
        if (!nestedExpList) return
        nestedExpList.forEach((nestedExp) => {
            const [, nestedKey] = nestedExp.match(/\$t\((.*?)\)/) ?? []
            if (nestedKey) {
                usedKeys.push(nestedKey)
            }
        })
    })
    return uniq(usedKeys)
}

export async function findAllUnusedKeys() {
    const en: Record<string, string> = await readMessages('en-US')
    const allKeys = keys(en)
    const usedKeys = await findAllUsedKeys()
    return difference(allKeys, usedKeys)
}
