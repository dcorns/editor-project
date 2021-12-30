## Repository structure

We follow the monorepo pattern:

- [apps](apps) contains executable and deployable packages:
  - [frontend](apps/frontend) contains the user facing Next.JS app.
  - [backend](apps/backend) contains the backend express app.

## How to run the system

Start the dev server on [http://localhost:3000](http://localhost:3000) by running **`npm run dev`** in the root folder.

## Type checking and linting

Each app has a `check` script that runs the linting and typechecking. Run it in all apps from the root by running: `npm run check --workspaces`.

##Updates
1) Persist data changes in realtime to firebase database
2) Broadcast changes to firebase database in realtime
3) Use database state as the source of truth for all clients
4) Feature 'Add Note' added and persisted in realtime to all clients (branch after10)
5) Feature 'Change Note Title' added. Changes to title are persisted to all clients in realtime (branch after10)

##Issues
1) Default note body is not displayed
2) Using isAstChange in Editor causes a managed state to un-managed state error
3) Clicking on note in noteList causes 4 calls to useNote