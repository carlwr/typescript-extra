import { fc, test } from '@fast-check/vitest'
import { describe, expect } from 'vitest'
import { cached, cachedUnary, memoized } from '../src/misc.js'


describe('memoized', () => {

  test.prop([fc.anything()])('caches any resolved value; f called once', async (x) => {
    let n = 0
    const get = memoized(() => { n++; return Promise.resolve(x) })
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


describe('cached', () => {

  test.prop([fc.anything()])('caches any value; f called once', (x) => {
    let n = 0
    const get = cached(() => { n++; return x })
    expect(get()).toBe(x)
    expect(get()).toBe(x)
    expect(n).toBe(1)
  })

  test('throw not cached — retries until success', () => {
    let n = 0
    const get = cached(() => {
      if (n++ < 2) throw new Error('fail')
      return 'ok'
    })
    expect(() => get()).toThrow('fail')
    expect(() => get()).toThrow('fail')
    expect(get()).toBe('ok')
    expect(get()).toBe('ok')
    expect(n).toBe(3)
  })

})


describe('cachedUnary', () => {

  const anyKey = fc.oneof(fc.anything(), fc.constant(NaN))

  test.prop([anyKey, fc.anything()])('caches any value per key; f called once', (k, v) => {
    let n = 0
    const get = cachedUnary((_: unknown) => { n++; return v })
    expect(get(k)).toBe(v)
    expect(get(k)).toBe(v)
    expect(n).toBe(1)
  })

  test('throw not cached — retries until success', () => {
    let n = 0
    const get = cachedUnary((_: string) => {
      if (n++ < 2) throw new Error('fail')
      return 'ok'
    })
    expect(() => get('a')).toThrow('fail')
    expect(() => get('a')).toThrow('fail')
    expect(get('a')).toBe('ok')
    expect(get('a')).toBe('ok')
    expect(n).toBe(3)
  })

})
