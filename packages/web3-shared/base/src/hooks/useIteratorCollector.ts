import { useEffect, useState } from 'react'
import { useBoolean, useInterval } from 'react-use'
import { uniqBy } from 'lodash-unified'

export enum IteratorCollectorStatus {
    init = 'init',
    fetching = 'fetching',
    done = 'done',
    error = 'error',
}

export const useIteratorCollector = <T>(iterator?: AsyncIterableIterator<T[]>, distinctBy?: (data: T) => string) => {
    const [cache, setCache] = useState<{ data: T[]; status: IteratorCollectorStatus }>()
    const [isRunning, toggleIsRunning] = useBoolean(true)
    const [delay] = useState(1000)

    useEffect(() => {
        toggleIsRunning(true)
        const newData = {
            data: cache?.data ?? [],
            status: IteratorCollectorStatus.init,
        }
        setCache(newData)
    }, [iterator])

    useInterval(
        async () => {
            try {
                if (!iterator) return
                const result = await iterator.next()
                const { value, done } = result

                if (done) {
                    toggleIsRunning(false)
                } else {
                    const newData = {
                        data: uniqBy([...(cache?.data ?? []), ...value], (x) => (!distinctBy ? true : distinctBy(x))),
                        status: result.done ? IteratorCollectorStatus.done : IteratorCollectorStatus.fetching,
                    }
                    setCache(newData)
                }
            } catch {
                const exist = cache?.data ?? []
                const newData = {
                    data: exist,
                    status: IteratorCollectorStatus.error,
                }
                setCache(newData)
            }
        },
        isRunning && iterator ? delay : null,
    )

    return cache ?? { data: [], status: IteratorCollectorStatus.init }
}
