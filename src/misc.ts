import { rm } from "node:fs/promises";

/**
 * A non-empty array
 */
export type NonEmpty<T> = [T, ...T[]]

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined


/**
 * Cached, lazy, single-flight evaluation of a promise.
 *
 * A rejected promise is cached as well, i.e. no re-attempts (failures are assumed to be permanent).
 */
export function memoized<T>(f: () => Promise<T>): () => Promise<T> {
  let p: Promise<T> | null = null;
  return () => p ?? (p = f())
}


/**
 * whether the elements of {@link xs} are unique, in the `===` sense
 *
 * O(n)
 * (if the hash tables behave, and they should for primitives)
 * (constants likely not too great)
*/
export function allUnique<T extends Primitive>(xs: T[]): boolean {
  return new Set(xs).size === xs.length
}


/**
 * Map over non-empty array while preserving the type as non-empty
 */
export function mapNonEmpty<T,U>(
  xs: readonly [T,...T[]],
  fn: (x: T) => U
): [U,...U[]] {
  const mapped = xs.map(fn)
  return mapped as [U,...U[]]
}

/**
 * Map over non-empty array with a function that returns a non-empty array, and return a flattened non-empty array
 */
export function flatmapNonEmpty<T,U>(
  xs: readonly [T,...T[]],
  fn: (x: T) => [U,...U[]]
): [U,...U[]] {
  const mapped = xs.map(fn)
  const flattened = mapped.flat()
  return flattened as [U,...U[]]
}


/**
 * Stateful iterator yielding the elements of {@link xs}.
 *
 * When the last element is reached, calls will continue to return that element indefinitely.
 *
 * @example
 * const next = drain([1, 2, 3]);
 * next(); // => 1
 * next(); // => 2
 * next(); // => 3
 * next(); // => 3
 * next(); // => 3 (returns 3 forever)
 */
export function drain<T>(xs: [T,...T[]]): () => T {
  let state: [T,...T[]] = xs
  return () => {
    if (hasAtleastTwo(state)) {
      const [x0,...xs_rest] = state
      state = xs_rest
      return x0
    }
    return state[0]
  }
}

/**
 * return the `i`th element of `xs`, or throw if `i` is out of bounds
 */
export function safeIndex<T>(xs: readonly [T, ...T[]], i: number): T {
  if (i<0 || i>=xs.length) {
    throw new Error(`index ${i} out of bounds for array of length ${xs.length}`)
  }
  return xs[i] as T
}

export function mapFilterAsync<T, U>(
  xs: readonly T[],
  f: (x: T) => Promise<U|null|undefined>
): Promise<U[]> {
  return Promise.all(xs.map(f)).then(results => results.filter(isDefined));
}

export function mapAsync<T, U>(
  xs: readonly T[],
  f: (x: T) => Promise<U>
): Promise<U[]> {
  return Promise.all(xs.map(f));
}

export async function partitionAsync<A, B extends boolean>(
  items: readonly A[],
  pred: (a: A) => Promise<B>
): Promise<readonly [A[], A[]]> {
  const results = await Promise.all(items.map(pred));

  const yes: A[] = [];
  const no : A[] = [];

  for (let i = 0; i < items.length; i++) {
    (results[i] ? yes : no).push(items[i] as A);
  }
  return [yes, no] as const;
}

/**
 * remove a substring from the beginning of a string; throw if {@link str} does not start with {@link first}
 *
 * @example
 * withoutFirstSubstring('e', 'ego') // => 'go'
 */
export function withoutFirstSubstring(first: string, str: string) {
  if (!str.startsWith(first))
    throw new Error(`expected "${str}" to start with "${first}"`)
  return str.slice(first.length)
}

export function isDefined<T>(x: T|null|undefined): x is NonNullable<T> {
  return x != null;
}

export function isEmpty<T>(xs: readonly T[]): xs is [] {
  return xs.length === 0
}

export function isNonEmpty<T>(xs: readonly T[]): xs is [T, ...T[]] {
  return xs.length >= 1;
}

export function isSingle<T>(xs: readonly T[]): xs is [T] {
  return xs.length === 1;
}

export function hasAtleastTwo<T>(xs: readonly T[]): xs is [T, T, ...T[]] {
  return xs.length >= 2;
}

export function assertNever(_: never): never {
  throw new Error("unhandled variant");
}

/**
 * whether the argument is a {@link Record}
 */
export function isRecord<K extends keyof any>(value: unknown): value is Record<string,K> {
  if (
       typeof value !== 'object'
    || value === null
    || Array.isArray(value)
  )
    return false

  return (Object.getOwnPropertySymbols(value).length === 0)
}

/**
 * remove a file or directory recursively; ignore errors
 */
export async function rm_rf(path: string): Promise<void> {
  return rm(path, {recursive: true}).catch(() => {})
}

/**
 * return the match of the regex, or throw if no match
 */
export function getMatch(re: RegExp, str: string): string {
  const matches = str.match(re) || []
  if (matches===null || !isNonEmpty(matches))
    throw new Error(`regex /${re.source}/ did not match '${str}' exactly once`)
  return matches[0]
}

/**
 * the `.trim()` method as a function
 *
 * `trim(str) <=> str.trim()`
 */
export function trim(str: string): string {
  return str.trim()
}
