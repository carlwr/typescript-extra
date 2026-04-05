import { fc, test } from '@fast-check/vitest'
import { describe, expect } from 'vitest'
import { cached, memoized } from '../src/misc.js'


describe('memoized', () => {

  test.prop([fc.anything()])('caches any resolved value; f called once', async (x) => {
    let n = 0
    const get = memoized(async () => { n++; return x })
    await expect(get()).resolves.toBe(x)
    await expect(get()).resolves.toBe(x)
    expect(n).toBe(1)
  })

  test.prop([fc.anything()])('caches rejection', async (x) => {
    let n = 0
    const get = memoized(() => { n++; return Promise.reject(x) })
    await expect(get()).rejects.toBe(x)
    await expect(get()).rejects.toBe(x)
    expect(n).toBe(1)
  })

  test('sync throw from f — not cached', async () => {
    let n = 0
    const get = memoized(() => {
      if (n++ < 1) throw new Error('sync')
      return Promise.resolve('ok')
    })
    expect(() => get()).toThrow('sync')
    await expect(get()).resolves.toBe('ok')
    await expect(get()).resolves.toBe('ok')
    expect(n).toBe(2)
  })

})
