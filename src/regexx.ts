/**
 * Create a regular expression from a template literal while stripping whitespaces, tabs and newlines.
 *
 * This allows writing regexes on multiple lines with indentation, similar to the `(?x)` flag of e.g. PCRE2 and oniguruma.
 *
 * **NOT TESTED**
 *
 * @example
 * const re = regexx`
 *   (?<s>^
 *     (?<h>^#.*?\n)?
 *     (?<c>(?:^(?!#).*\n)+)
 *   )
 * `.with('gm')
 */
export function regexx(
  strings  : TemplateStringsArray,
  ...values: unknown[]
): {
  with     : (flags?: string) => RegExp
  source   : string
} {
  const source = strings.reduce((acc,str,i) =>
    acc + str + (values[i] || ''), ''
  ).replace(/\s+/g, '')

  return {
    source: source,
    with  : (flags='') => new RegExp(source, flags)
  }
}
