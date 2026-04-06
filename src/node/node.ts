import { rm } from 'node:fs/promises'

/**
 * remove a file or directory recursively; ignore errors
 */
export function rm_rf(path: string): Promise<void> {
  return rm(path, {recursive: true}).catch(() => {})
}
