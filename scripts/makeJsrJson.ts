#!/usr/bin/env node

import { writeFile } from 'node:fs/promises'
import { pkgJson } from './pkgJson.js'

const jsrConfig = {
  name: pkgJson.name,
  version: pkgJson.version,
  license: pkgJson.license,
  exports: './mod.ts',
  publish: {
    include: [
      'LICENSE',
      'README.md',
      'mod.ts',
      'src/**/*.ts',
    ],
  },
}

async function main(): Promise<void> {
  await writeFile('jsr.json', `${JSON.stringify(jsrConfig, null, 2)}\n`, 'utf8')
  console.info('synced jsr.json')
}

main().catch(console.error)
