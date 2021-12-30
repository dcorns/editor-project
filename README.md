## See after10 branch for latest version
## Repository structure

We follow the monorepo pattern:

- [apps](apps) contains executable and deployable packages:
  - [frontend](apps/frontend) contains the user facing Next.JS app.
  - [backend](apps/backend) contains the backend express app.

## How to run the system

Start the dev server on [http://localhost:3000](http://localhost:3000) by running **`npm run dev`** in the root folder.

## Type checking and linting

Each app has a `check` script that runs the linting and typechecking. Run it in all apps from the root by running: `npm run check --workspaces`.
