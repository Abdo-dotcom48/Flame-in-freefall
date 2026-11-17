# Flame in Freefall — Research Atlas

A frontend-only React + TypeScript prototype for exploring NASA low-gravity combustion research.
## Run locally

Requires Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Keep the terminal running while you use the local URL Vite prints. The `127.0.0.1` link only works while that dev-server process is alive. If the page stops responding, run `npm run dev` again; if port 5173 is occupied, Vite will print the alternate local URL it selected.

If npm is unavailable but dependencies are already installed, start the same server directly with:

```bash
node node_modules/vite/bin/vite.js --configLoader runner --host 127.0.0.1
```

For a production build:

```bash
npm run build
npm run preview
```

## Backend integration seam

The UI reads through `dataProvider`, exported from `src/data/index.ts`. The current binding points to `mockProvider` in `src/data/mockProvider.ts`.

When a backend is ready:

1. Add an `ApiDataProvider` in `src/data/apiProvider.ts` that implements the `DataProvider` interface from `src/data/types.ts`.
2. Have its methods call your backend and return the existing typed shapes. A simple REST contract could be `GET /investigations`, `GET /investigations/:id`, `GET /sources`, `GET /resources`, and `POST /scenarios/analyze`.
3. Make the scenario endpoint accept a `ScenarioInput` JSON body and return a `ScenarioResult` with its evidence source IDs. The interface also allows a `not-connected` result while analysis is unavailable.
4. Swap the `dataProvider` binding in `src/data/index.ts` from `mockProvider` to `ApiDataProvider` (optionally using a `VITE_API_BASE_URL` environment variable for the backend URL).

The interface includes investigation records, experimental conditions, sources, resources, and scenario results. Preserve `null` for conditions the source does not report. If the backend is hosted on another origin, configure CORS there to allow the frontend origin. Do not put private API keys in `VITE_` variables; those values are included in browser code.

Keep source URLs on each record, and use `null` for fields the source does not report. The explorer renders those values as “Not stated in linked source.”

## Evidence and prototype notes

- The investigation explorer contains a curated set of illustrative demo records. It is not a complete PSI export, and its display order is not a ranking.
- The resource library follows the challenge's ten-item resource list and opens external links in a new tab.
- The expected `outputs/Flame-in-Freefall-Reference/README.md` was not present in the workspace. Sources are linked to NASA pages and reports, NASA PSI, and the published challenge resource list.
- This independent prototype is not affiliated with or endorsed by NASA. It is not a validated fire prediction or engineering recommendation.
