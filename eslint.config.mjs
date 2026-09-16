import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

/*
  Linting was set up late: the repo carried a `pnpm lint` that ran `next lint`,
  which Next 16 removed, so it had been failing on a missing directory rather
  than checking anything. The `eslint-disable-next-line @next/next/no-img-element`
  comments already scattered through the components were written against rules
  nothing was running.

  `core-web-vitals` rather than the bare config, because the rules it promotes
  from warning to error are the ones this project keeps tripping over — an
  <img> where next/image belongs is the whole reason next.config.ts has a proxy
  route and an allowlist.

  The TypeScript rule-set (`eslint-config-next/typescript`) is deliberately
  NOT here. tsc already runs in `pnpm typecheck` and catches the type errors;
  typescript-eslint's opinions on top of that are a separate argument to have,
  not something to smuggle in with a build fix.
*/
export default defineConfig([
  ...nextVitals,
  globalIgnores([
    // The defaults eslint-config-next ships, which spreading it discards.
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Ours: build output, fixtures and the extraction scratch.
    'test-results/**',
    'playwright-report/**',
    'archive/**',
    'outputs/**',
    /* The design prototype, kept for reference and never built or shipped.
       Linting it only ever reports on code nobody intends to change. */
    'Full prototype build complete/**',
  ]),
  {
    /*
      Playwright fixtures take a callback named `use`, and the React Hooks
      plugin reads any `use`-prefixed call as a hook — so `await use(page)`
      inside a fixture is flagged as a hook called outside a component. There
      is no React in the end-to-end suite at all, so the rules simply do not
      apply here.
    */
    files: ['e2e/**/*.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
])
