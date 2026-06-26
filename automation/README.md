# Asset Maintenance — Playwright E2E Automation

Professional-grade end-to-end test automation for the Asset Maintenance System. **Localhost-first** design with production-ready patterns.

## 🎯 Quick Start

### Prerequisites
- PostgreSQL running on `localhost:5432`
- Spring Boot backend running on `localhost:8080`
- React frontend running on `localhost:3000`

### Setup (one-time)

```bash
cd automation
npm install
npm run seed              # Create test roles, users, and assets in DB
npm run test:auth         # Verify everything works (7 tests)
```

### Run Tests

```bash
npm run test:auth         # Login tests (7 tests) ✅ PASSING
npm run test:assets       # Asset list, search, filter (11 tests)
npm run test:tasks        # Task list, filter, details (7 tests)
npm run test:dashboard    # Dashboard views & navigation (10 tests)
npm run smoke             # All read-only tests (headless)
npm run smoke:headed      # All tests with browser visible
npm run test              # All tests
npm run test:debug        # Step through tests
npm run test:ui           # Interactive Playwright UI mode
npm run report            # View HTML report
```

---

## 📁 Folder Structure

```
automation/
├── .env.local                    ← Localhost URLs + test credentials (gitignored)
├── .env.example                  ← Template (safe to commit)
├── playwright.config.js          ← baseURL, global-setup, workers=1
├── package.json
│
├── config/
│   └── env.js                    ← Single source for all env vars
│
├── helpers/
│   ├── api-client.js             ← Fetch wrapper for Node (seed, setup)
│   └── auth-helper.js            ← getAuthToken() + injectAuthState()
│
├── fixtures/
│   ├── test-data.js              ← Seeded data + enums + constants
│   └── test-fixtures.js          ← Custom test with role-specific pages
│
├── pages/
│   ├── BasePage.js               ← goto, waitForNetworkIdle, expectUrl
│   ├── LoginPage.js              ← login form + error handling
│   ├── DashboardPage.js          ← All 3 dashboards + navbar
│   ├── AssetsPage.js             ← List, search, filter, CRUD buttons
│   ├── AssetFormPage.js          ← Create/edit form
│   ├── TasksPage.js              ← List, filter, view toggle
│   └── TaskDetailPage.js         ← Detail view + logs
│
├── setup/
│   ├── global-setup.js           ← Validates backend + credentials (runs once)
│   └── seed.js                   ← Idempotent DB seed script
│
└── tests/
    ├── 01-auth/
    │   └── login.spec.js         ← 7 tests: R1/R2/R3 + invalid + validation ✅
    ├── 02-assets/
    │   └── assets-list.spec.js   ← 11 tests: R4/R5/R6/R7 + public API
    ├── 03-tasks/
    │   └── tasks-list.spec.js    ← 7 tests: R8/R9/R10/R11
    └── 04-dashboard/
        └── dashboard.spec.js     ← 10 tests: R1/R2/R3 dashboards + nav
```

---

## 🧪 Testing Framework: Playwright E2E + Postman API

### Two Complementary Approaches

**Playwright E2E Tests** (Browser automation)
- Tests complete user workflows from UI perspective
- 34 tests covering read-only workflows
- Includes frontend rendering + API integration
- **Best for:** User acceptance testing, UI validation

**Postman API Tests** (Backend API testing)
- Tests raw API endpoints with HTTP requests
- 23 requests with 40+ assertions
- Covers auth, CRUD operations, and RBAC
- **Best for:** API contract testing, backend validation

Choose based on your testing goal:
- UI/UX validation → **Playwright**
- API reliability → **Postman**
- Both → Run both test suites

---

## 📮 Postman API Testing

### Quick Start (2 minutes)

1. Import collection and environment:
   ```
   postman/Asset-Maintenance-API.postman_collection.json
   postman/Asset-Maintenance-Local.postman_environment.json
   ```

2. Select environment: **"Asset Maintenance — Local"**

3. Run login requests first to populate tokens:
   - R1 — Manager Login
   - R2 — Technician Login
   - R3 — User Login

4. Run any other requests (they'll use tokens from step 3)

### Postman Files

- **Collection**: `postman/Asset-Maintenance-API.postman_collection.json` (23 requests)
- **Environment**: `postman/Asset-Maintenance-Local.postman_environment.json` (variables)
- **Full Guide**: `postman/POSTMAN-TESTING-GUIDE.md` (detailed docs)
- **Quick Ref**: `postman/QUICK-REFERENCE.md` (one-page cheat sheet)

### Test Coverage

Same workflows as Playwright, but at API level:
- **Auth**: Login all 4 roles (R1/R2/R3 + NEG cases)
- **Assets**: List, search, filter (R4/R5/R6/R7/R13)
- **Tasks**: List, filter, detail (R8/R9/R10/R11)
- **RBAC**: Authorization control (403/401 responses)

### Running Automated Tests

```bash
# Use Newman CLI for CI/CD integration
npm install -g newman

newman run postman/Asset-Maintenance-API.postman_collection.json \
  -e postman/Asset-Maintenance-Local.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

---

## 🧪 Test Coverage

### Module 01: Authentication (7 tests) ✅ PASSING

**Workflows tested:**
- **R1** — Manager login → redirected to `/manager`
- **R2** — Technician login → redirected to `/technician`
- **R3** — User login → redirected to `/user`
- **Negative cases** — Invalid credentials, empty fields

**Key concepts:**
- Full browser login (not mocked) with real JWT
- Error banner assertions
- HTML5 field validation

---

### Module 02: Asset Management (11 tests)

**Workflows tested:**
- **R4** — List all assets (all roles can view)
- **R5** — Search assets by keyword
- **R6** — Filter assets by status
- **R7** — Combined search + filter
- **R13** — Public API endpoint (no auth required)
- **RBAC** — Manager sees Create button, others don't

**Key concepts:**
- Role-based UI differences
- Network idle wait for async loads
- Empty state handling
- Filter reset

---

### Module 03: Task Management (7 tests)

**Workflows tested:**
- **R8** — List all tasks (all roles)
- **R9** — Filter by status / priority, switch view modes
- **R10** — Open task detail, see activity logs
- **R11** — Archived view toggle

**Key concepts:**
- View mode switching (active/archived)
- URL state management
- Detail page loading

---

### Module 04: Dashboard (10 tests)

**Workflows tested:**
- **R1** — Manager dashboard with metrics
- **R2** — Technician dashboard
- **R3** — User dashboard
- **Navigation** — Between dashboard and main sections
- **Logout** — From any page

**Key concepts:**
- Post-login redirect validation
- Navbar presence and functionality
- Cross-page navigation

---

## 🔐 Test Credentials

All created by `npm run seed`:

```
MANAGER       manager@test.com       / Manager@1234
TECHNICIAN    technician@test.com    / Tech@1234
USER          user@test.com          / User@1234
ADMIN         admin@test.com         / Admin@1234
```

All passwords are BCrypt-hashed (Spring-compatible).

---

## 🎭 Authentication Strategy

### Strategy 1: Full UI Login (tests labeled "R1", "R2", "R3")

Used for testing the login flow itself.

```javascript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(email, password);
```

**Characteristics:**
- Slower (full browser navigation + form submission)
- Tests JWT generation + redirect logic
- Best for: Login tests only

### Strategy 2: Injected Auth (most other tests)

Uses custom Playwright fixture `managerPage`, `technicianPage`, etc.

```javascript
test('assets page as manager', async ({ managerPage }) => {
  const assetsPage = new AssetsPage(managerPage);
  await assetsPage.goto();  // Already authenticated in localStorage
});
```

**Characteristics:**
- Fast (bypasses login UI, injects JWT via `addInitScript`)
- Still validates backend auth (calls real `/api/auth/login`)
- Best for: all workflows except login tests

---

## 📝 Page Objects

All page objects inherit from `BasePage` and provide:

- **Navigation**: `goto(path)`, `waitForNetworkIdle()`
- **Assertions**: `expectLoaded()`, `expectUrl()`, `expectToast()`
- **Interactions**: Role-specific methods (e.g., `AssetsPage.searchByKeyword()`)

### Example: AssetsPage

```javascript
async expectLoaded()
async expectAssetsVisible(min = 1)
async getAssetCardCount()
async searchByKeyword(keyword)
async filterByStatus(status)
async clearFilters()
async expectCreateButtonVisible()
async clickCreateAsset()
async clickEditOnCard(index)
async clickDeleteOnCard(index)  // ⚠️ DESTRUCTIVE
```

---

## 🛠️ Configuration

### `.env.local`

```dotenv
BASE_URL=http://localhost:3000
API_URL=http://localhost:8080/api

DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_maintenance
DB_USER=postgres
DB_PASSWORD=12345

TEST_MANAGER_EMAIL=manager@test.com
TEST_MANAGER_PASSWORD=Manager@1234
# ... other test credentials
```

### `playwright.config.js`

Key settings:

```javascript
workers: 1                          // Serial execution on localhost
fullyParallel: false               // Stable for DB interactions
actionTimeout: 15_000              // 15s per action
navigationTimeout: 30_000          // 30s per page load
trace: 'retain-on-failure'         // Debug artifacts
screenshot: 'only-on-failure'
video: 'retain-on-failure'
globalSetup: './setup/global-setup.js'
```

---

## 🚀 Continuous Integration

For CI environments, adjust these env vars:

```bash
export CI=true
export RETRIES=1
export WORKERS=1
```

Then:

```bash
npm run smoke:ci  # Optimized for CI
```

---

## ⚠️ Known Constraints

1. **Database isolation:** Tests share the same DB. For destructive tests (delete, update), coordinate via seeded test data.
2. **State management:** Tests run sequentially (`workers: 1`) to avoid auth state conflicts.
3. **Async timing:** All major operations use `waitForNetworkIdle()` to handle React re-renders.
4. **Feature completeness:** Modifying workflows (M1, M2, M3, D1) not yet automated — awaiting design review.

---

## 📊 Test Results Format

```
Running 35 tests using 1 worker

  ✓  01-auth › R1: Manager login redirects to /manager (4.5s)
  ✓  02-assets › R4: Manager sees assets list on /assets (3.2s)
  ...

35 passed (5m 22s)

To open last HTML report run:
  npx playwright show-report
```

---

## 🔍 Debugging

### View test execution

```bash
npm run test:headed    # Runs with browser visible
```

### Step through tests

```bash
npm run test:debug     # Opens Playwright Inspector
```

### Interactive UI mode

```bash
npm run test:ui        # Web-based test runner
```

### View test artifacts

```bash
npm run report         # Opens HTML report with screenshots/videos/traces
```

---

## 📚 Next Steps

### Phase 2: Modifying Workflows

After mentor approval:

- **M1** — Create asset
- **M2** — Edit asset
- **M3** — Create task
- **M4-M8** — Full task lifecycle (assign → start → complete → confirm → close)

### Phase 3: Integration Tests

- API-level tests (bypass UI, call endpoints directly)
- Cross-browser testing (Firefox, Safari)
- Performance testing (load time assertions)

---

## 📞 Support

For issues or questions about the test automation:

1. Check the logs: `npm run test:headed`
2. View report: `npm run report`
3. Verify setup: `node -e "require('./setup/global-setup.js')()"`
4. Re-seed DB: `npm run seed`

---

**Last updated:** 2026-06-26  
**Test framework:** Playwright 1.61  
**Node version:** 18+  
**DB:** PostgreSQL 18+
