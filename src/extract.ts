import { isRecord } from "./misc.js"

/**
 * walk {@link root} recursively while collecting all {@link T}s for which {@link pred} returnes a defined result
 *
 * @example
 * const root = {
 *   A: 1,
 *   b: 0,
 *   c: {
 *     99: [{A:2}, {e:"zero"}],
 *     A: 3
 *   }
 * }
 * function pred(k: string, v: any): number|undefined {
 *   if (k === 'A' && typeof v === 'number') { return v }
 *   return undefined
 * }
 * const result = extract<number>(root, pred)
 * // result === [1, 2, 3]
 */
export function extract<T>(
  root: unknown,
  pred: (k: string, v: any) => T|undefined
): T[] {

  function handleEntry([k,v]: [string,unknown]): T[] {
    const r = pred(k,v)
    return (r !== undefined) ? [r] : go(v)
  }

  function go(node: unknown): T[] {

    const ret =
        Array.isArray    (node) ? flatMapArr_(node, go)
      : isRecord(node) ? flatMapRec_(node, handleEntry)
      : [] // null, primitives, functions, other records
    return ret
  }

  return go(root)
}

function flatMapArr_<U,T>(
  xs: U[],
  fn: (x:U) => T[]
): T[] {
  return xs.flatMap(fn)
}

function flatMapRec_<T>(
  rec: Record<string,unknown>,
  fn : (t:[string,unknown]) => T[]
): T[] {
  return Object.entries(rec).flatMap(fn)
}
