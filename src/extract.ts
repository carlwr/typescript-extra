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
        Array.isArray(node)      ? node.flatMap(go)
      : node===null              ? []
      : typeof node === 'object' ? Object.entries(node).flatMap(handleEntry)
      : []
    return ret
  }

  return go(root)
}
