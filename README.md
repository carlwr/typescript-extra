# typescript-extra

Personal helpers and convenience functions for TypeScript.

## Installation

```bash
npm install @carlwr/typescript-extra
```

## API


### `allUnique`

```ts
function allUnique<T>(xs: T[]): boolean
```
whether the elements of `xs` are unique, in the `===` sense

O(n)
(if the hash tables behave, and they should for primitives)
(constants likely not too great)

### `assertNever`

```ts
function assertNever(_: never): never
```


### `drain`

```ts
function drain<T>(xs: NonEmpty<T>): () => T
```
Stateful iterator yielding the elements of `xs`.

When the last element is reached, calls will continue to return that element indefinitely.

example:

```ts
const next = drain([1, 2, 3]);
next(); // => 1
next(); // => 2
next(); // => 3
next(); // => 3
next(); // => 3 (returns 3 forever)
```

### `extract`

```ts
function extract<T>(root: unknown, pred: (k: string, v: any) => undefined | T): T[]
```
walk `root` recursively while collecting all `T`s for which `pred` returnes a defined result

example:

```ts
const root = {
  A: 1,
  b: 0,
  c: {
    99: [{A:2}, {e:"zero"}],
    A: 3
  }
}
function pred(k: string, v: any): number|undefined {
  if (k === 'A' && typeof v === 'number') { return v }
  return undefined
}
const result = extract<number>(root, pred)
// result === [1, 2, 3]
```

### `flatmapNonEmpty`

```ts
function flatmapNonEmpty<T, U>(xs: readonly [T, T], fn: (x: T) => [U, ...U[]]): [U, ...U[]]
```
Map over non-empty array with a function that returns a non-empty array, and return a flattened non-empty array

### `getMatch`

```ts
function getMatch(re: RegExp, str: string): string
```
if the regex matches the string exactly once, return the match; otherwise throw

### `hasAtleastTwo`

```ts
function hasAtleastTwo<T>(xs: readonly T[]): xs is [T, T, ...T[]]
```


### `isDefined`

```ts
function isDefined<T>(x: undefined | null | T): x is NonNullable<T>
```


### `isEmpty`

```ts
function isEmpty<T>(xs: readonly T[]): xs is []
```


### `isNonEmpty`

```ts
function isNonEmpty<T>(xs: readonly T[]): xs is [T, ...T[]]
```


### `isRecord`

```ts
function isRecord<K>(value: unknown): value is Record<string, K>
```
whether the argument is a Record

### `isSingle`

```ts
function isSingle<T>(xs: readonly T[]): xs is [T]
```


### `mapAsync`

```ts
function mapAsync<T, U>(xs: readonly T[], f: (x: T) => Promise<U>): Promise<U[]>
```


### `mapFilterAsync`

```ts
function mapFilterAsync<T, U>(xs: readonly T[], f: (x: T) => Promise<undefined | null | U>): Promise<U[]>
```


### `mapNonEmpty`

```ts
function mapNonEmpty<T, U>(xs: readonly [T, T], fn: (x: T) => U): [U, ...U[]]
```
Map over non-empty array while preserving the type as non-empty

### `memoized`

```ts
function memoized<T>(f: () => Promise<T>): () => Promise<T>
```
Cached, lazy, single-flight evaluation of a promise.

A rejected promise is cached as well, i.e. no re-attempts (failures are assumed to be permanent).

### `partitionAsync`

```ts
function partitionAsync<A, B>(items: readonly A[], pred: (a: A) => Promise<B>): Promise<readonly [A[], A[]]>
```


### `rm_rf`

```ts
function rm_rf(path: string): Promise<void>
```
remove a file or directory recursively; ignore errors

### `safeIndex`

```ts
function safeIndex<T>(xs: readonly [T, T], i: number): T
```
return the `i`th element of `xs`, or throw if `i` is out of bounds

### `trim`

```ts
function trim(str: string): string
```
the `.trim()` method as a function

`trim(str) <=> str.trim()`

### `withoutFirstSubstring`

```ts
function withoutFirstSubstring(first: string, str: string): string
```
remove a substring from the beginning of a string; throw if `str` does not start with `first`

example:

```ts
withoutFirstSubstring('e', 'ego') // => 'go'
```