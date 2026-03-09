# Test-Driven Development (TDD)

This project uses **test-driven development**: write a failing test first, then implement the minimum code to pass, then refactor.

## Rule: Test first

- **New behavior:** Add or update a test that defines the expected behavior *before* implementing it (Red → Green → Refactor).
- **Bug fix:** Add a regression test that fails with the current code, then fix the code so the test passes.
- **Before committing:** Run the full test suite for the area you changed (frontend and/or backend). All tests must pass.

## Frontend (Next.js)

- **Runner:** [Vitest](https://vitest.dev/)
- **Component tests:** [React Testing Library](https://testing-library.com/react)
- **Path alias:** `@/` → `src/`

### Commands

From the **`frontend/`** directory:

```bash
npm install
npm run test        # watch mode
npm run test:run    # single run (CI)
npm run test:ui     # Vitest UI
```

### Where to put tests

- **Option A:** Next to source: `src/components/ReportCard.test.tsx`
- **Option B:** Colocated: `src/components/__tests__/ReportCard.test.tsx`

Tests are matched by `**/*.{test,spec}.{ts,tsx}` (see `frontend/vitest.config.ts`).

### TDD loop (frontend)

1. **Red:** Add or update a test in a `*.test.tsx` or `*.spec.ts` file; run `npm run test` and see it fail.
2. **Green:** Implement or change code in the component/module until the test passes.
3. **Refactor:** Improve code while keeping tests green.

### Example

```tsx
// ReportCard.test.tsx
it('renders who and when', () => {
  render(<ReportCard who="FTC" when="Use for scams." href="/" label="Report" />);
  expect(screen.getByText(/FTC/)).toBeInTheDocument();
});
```

---

## Backend (FastAPI)

- **Runner:** [pytest](https://pytest.org/)
- **Client:** [FastAPI TestClient](https://fastapi.tiangolo.com/tutorial/testing/) (Starlette)

### Commands

From the **`backend/`** directory:

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
pytest
```

- `pytest -v` — verbose  
- `pytest tests/test_main.py` — run one file  
- `pytest -k "health"` — run tests whose name contains "health"

### Where to put tests

- **`backend/tests/`** — all tests live here.
- **`conftest.py`** — shared fixtures (e.g. `client` for `TestClient`).
- **`test_*.py`** — test modules.

### TDD loop (backend)

1. **Red:** Add a test in `tests/test_*.py` (e.g. `def test_create_report_returns_201(client):`); run `pytest` and see it fail.
2. **Green:** Implement the route or logic in `app/` until the test passes.
3. **Refactor:** Improve code while keeping tests green.

### Example

```python
# tests/test_main.py
def test_health_returns_ok(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

---

## CI

- **Frontend:** Run `cd frontend && npm run test:run` in your pipeline.
- **Backend:** Run `cd backend && pip install -r requirements.txt -r requirements-dev.txt && pytest` in your pipeline.

Add these to GitHub Actions (or your CI) so TDD stays enforced on every push. Fix any failing tests before merging.
