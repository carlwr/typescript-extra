import * as pkg from './pkgJson.js'

const preamble =
`# ${pkg.name}

${pkg.pkgJson.description}

Links:
* github: ${linkify(pkg.repoUrl)}
* npm: ${linkify(pkg.npmUrl)}

## Installation

\`\`\`bash
npm install ${pkg.pkgJson.name}

# run checks and tests:
npm qa
\`\`\`

---

## API
`

export default preamble

// to md link; link text: remove https?://
function linkify(url: string): string {
  const linkText = url.replace(/^https?:\/\//, '')
  return `[${linkText}](${url})`
}
