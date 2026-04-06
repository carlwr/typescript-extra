import * as pkg from './pkgJson.js'

const preamble =
`# ${pkg.name}

${pkg.pkgJson.description}

Links:
* Github: [\`carlwr/typescript-extra\`](https://github.com/carlwr/typescript-extra)
* npm: [\`@carlwr/typescript-extra\`](https://www.npmjs.com/package/@carlwr/typescript-extra)
* JSR: [\`@carlwr/typescript-extra\`](https://jsr.io/@carlwr/typescript-extra)

## Installation

\`\`\`bash
# one of:
npm install ${pkg.pkgJson.name}
pnpm dlx jsr add ${pkg.pkgJson.name}

# run checks and tests:
npm qa
\`\`\`

---

## API
`

export default preamble
