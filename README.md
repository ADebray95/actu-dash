# Actuary Dashboard

Motor insurance portfolio analytics dashboard — built by AI for a workshop demo.

**Live:** https://adebray95.github.io/actu-dash/

## What it does

Upload a fabricated motor insurance XLSX (two sheets: `insured_year` + `claims`) and explore:

- **KPI cards** — total premium, total incurred, S/P ratio, average claim cost
- **S/P ratio by year** — bar chart with premium/incurred and 100% breakeven line
- **Segmentation** — premium vs incurred by province, gender, car type, fuel type, or use type
- **Claims table** — paginated, sortable claims detail

## Run locally

```bash
pnpm install
pnpm dev
```

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.

## Adding features (workshop demo)

```bash
# List open feature requests
gh issue list

# In Claude Code terminal:
# "Implement issue #3: add a scatter chart of frequency vs severity by province"
# Claude edits the code, you push, the site updates in ~60s
```

See `CLAUDE.md` for the data schema and component guide.
