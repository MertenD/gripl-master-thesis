# GRIPL Frontend

The GRIPL frontend is a Next.js web app that provides three views:

- **Sandbox** (`/`) — interactive BPMN editor where you can model or import process diagrams and run the GDPR classification pipeline against them. Critical activities are highlighted directly in the diagram; the LLM's reasoning is shown in a collapsible panel.
- **Labeling** (`/labeling`) — dataset management and annotation tool for building ground-truth datasets. Upload BPMN files, switch to labeling mode, and mark activities as GDPR-critical with optional justification text.
- **Evaluation** (`/evaluation`) — multi-model evaluation framework UI. Configure which LLMs and datasets to compare, run evaluations with live streaming progress, and analyse results from overall summary down to individual test cases with BPMN overlays.

An interactive Swagger API doc for the backend is available at `/api-docs`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | Radix UI + shadcn/ui |
| BPMN | bpmn.js (editor + rendering) |
| Charts | Recharts, ApexCharts |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

The app expects the backend to be running on `http://localhost:8080`. All `/api/*` requests are rewritten to the backend via the Next.js rewrite config. Set `NEXT_PUBLIC_API_BASE_URL` to override the backend URL at build time.

```bash
# Optional: point at a different backend
NEXT_PUBLIC_API_BASE_URL=https://gripl.merten.tech/api npm run build
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Backend base URL (default: `http://localhost:8080`). Baked in at build time. |

## API documentation

- **Deployed:** [https://gripl.merten.tech/api-docs](https://gripl.merten.tech/api-docs)
- **Local:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs) (requires backend running)
