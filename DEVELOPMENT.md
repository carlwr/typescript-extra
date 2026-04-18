## Development

### Set-up

```bash

# clone the repo:
git clone carlwr/typescript-extra
cd typescript-extra

# install dependencies:
pnpm install

```

### Maintenance

```bash
# bump all dependencies and verify the package still packs cleanly
pnpm up --latest && pnpm run publish:dry
```

### JSR

```bash
# precondition: have the Deno CLI installed and on PATH
# no separate `deno install` / `deno cache` step is required

# sync jsr.json from package.json:
pnpm run jsr:sync

# run the meaningful Deno/JSR checks:
pnpm run lint:jsr
pnpm run qa:jsr

# optional: inspect generated docs locally
pnpm run doc:jsr |& less

# dry-run publish only:
pnpm run publish:jsr:dry

# publish with interactive web auth:
pnpm run publish:jsr
```
