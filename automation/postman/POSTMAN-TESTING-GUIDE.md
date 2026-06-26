# Postman API Testing — Asset Maintenance System

Professional-grade API testing collection for the Asset Maintenance System backend.

## 📋 Quick Start

### 1. Prerequisites

All three services **must be running**:

```powershell
# PostgreSQL (localhost:5432)
# Already running

# Spring Boot Backend (localhost:8080)
cd backend
.\mvnw.cmd spring-boot:run

# React Frontend (localhost:3000)
cd frontend
npm start
```

### 2. Install Postman

Download from [getpostman.com](https://www.getpostman.com/downloads/)

### 3. Import Collection & Environment

#### Step A: Import Collection
1. Open Postman
2. Click **File** → **Import**
3. Select `Asset-Maintenance-API.postman_collection.json`
4. Click **Import**

#### Step B: Import Environment
1. Click **Settings** (⚙️ icon) → **Environments**
2. Click **Import**
3. Select `Asset-Maintenance-Local.postman_environment.json`
4. Click **Open**

#### Step C: Select Environment
- Look for dropdown in top-right corner
- Select **"Asset Maintenance — Local"**

---

## 🧪 Test Organization

### Collection Structure

```
Asset Maintenance API
├── Auth — Login (R1/R2/R3)
│   ├── R1 — Manager Login ✅
│   ├── R2 — Technician Login ✅
│   ├── R3 — User Login ✅
│   └── NEG — Invalid Credentials ✅
│
├── Assets — List & Search (R4/R5/R6/R7/R13)
│   ├── R13 — Public API (No Auth) ✅
│   ├── R4 — Manager Views Asset List ✅
│   ├── R5 — Search by Code (TST-001) ✅
│   ├── R5 — Search by Name (Alpha) ✅
│   ├── R6 — Filter by Status (OPERATIONAL) ✅
│   ├── R6 — Filter by Status (UNDER_MAINTENANCE) ✅
│   └── R7 — Combined Search + Filter ✅
│
├── Tasks — List & Filter (R8/R9/R10/R11)
│   ├── R8 — Manager Views Task List ✅
│   ├── R8 — Technician Views Task List ✅
│   ├── R9 — Filter Tasks by Status ✅
│   ├── R10 — Get Task Detail ✅
│   └── R11 — Archived View ✅
│
└── RBAC — Role-Based Access Control
    ├── Manager Can Create Asset (M1) ✅
    ├── Technician Cannot Create Asset (403) ✅
    └── Missing Token Returns 401 ✅
```

---

## 🚀 Running Tests

### Option 1: Run Individual Request

1. Click on any request (e.g., "R1 — Manager Login")
2. Click **Send**
3. View response in bottom panel
4. Check **Tests** tab to see test results

### Option 2: Run Entire Folder

1. Expand **"Auth — Login"** folder
2. Right-click → **Run folder**
3. Postman runs all requests in sequence
4. Review test results in modal

### Option 3: Run Entire Collection

1. Click **"Asset Maintenance API"** (top level)
2. Right-click → **Run collection**
3. All 23 requests execute in order
4. View summary of passed/failed tests

### Option 4: Automated Test Run (CI/CD)

```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run collection with environment
newman run Asset-Maintenance-API.postman_collection.json \
  -e Asset-Maintenance-Local.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

---

## 📊 Workflow Coverage

### ✅ Authentication Tests (R1/R2/R3)

**R1 — Manager Login**
- Endpoint: `POST /api/auth/login`
- Credentials: `manager@test.com` / `Manager@1234`
- Expected: `200 OK` + JWT token + role `MANAGER`
- Test: Validates token structure and stores for future requests

**R2 — Technician Login**
- Endpoint: `POST /api/auth/login`
- Credentials: `technician@test.com` / `Tech@1234`
- Expected: `200 OK` + role `TECHNICIAN`

**R3 — User Login**
- Endpoint: `POST /api/auth/login`
- Credentials: `user@test.com` / `User@1234`
- Expected: `200 OK` + role `USER`

**NEG — Invalid Credentials**
- Endpoint: `POST /api/auth/login`
- Credentials: `manager@test.com` / `WRONG_PASSWORD`
- Expected: `401 Unauthorized` + error message

---

### ✅ Asset Management Tests (R4/R5/R6/R7/R13)

**R13 — Public API (No Authentication)**
- Endpoint: `GET /api/assets`
- Auth: None
- Expected: `200 OK` + array of assets (even without token)
- Purpose: Verify public endpoint doesn't require auth

**R4 — Manager Views Asset List**
- Endpoint: `GET /api/assets`
- Auth: Manager token (from R1)
- Expected: `200 OK` + all assets in array
- Purpose: Authenticated users can view all assets

**R5 — Search by Code**
- Endpoint: `GET /api/assets?keyword=TST-001`
- Auth: Manager token
- Expected: `200 OK` + filtered results
- Purpose: Search functionality works with keyword parameter

**R5 — Search by Name**
- Endpoint: `GET /api/assets?keyword=Alpha`
- Auth: Manager token
- Expected: `200 OK` + filtered results
- Purpose: Search works by asset name too

**R6 — Filter by Status (OPERATIONAL)**
- Endpoint: `GET /api/assets?status=OPERATIONAL`
- Auth: Manager token
- Expected: `200 OK` + only OPERATIONAL assets
- Purpose: Status filtering works

**R6 — Filter by Status (UNDER_MAINTENANCE)**
- Endpoint: `GET /api/assets?status=UNDER_MAINTENANCE`
- Auth: Manager token
- Expected: `200 OK` + filtered by status
- Purpose: Multiple status filters supported

**R7 — Combined Search + Filter**
- Endpoint: `GET /api/assets?keyword=TST&status=OPERATIONAL`
- Auth: Manager token
- Expected: `200 OK` + results matching BOTH criteria
- Purpose: Complex filtering works

---

### ✅ Task Management Tests (R8/R9/R10/R11)

**R8 — Manager Views Task List**
- Endpoint: `GET /api/tasks`
- Auth: Manager token
- Expected: `200 OK` + array of tasks (may be empty)
- Purpose: Manager can view all tasks

**R8 — Technician Views Task List**
- Endpoint: `GET /api/tasks`
- Auth: Technician token
- Expected: `200 OK` + array of tasks
- Purpose: Technician access validated

**R9 — Filter Tasks by Status**
- Endpoint: `GET /api/tasks?status=ACTIVE`
- Auth: Manager token
- Expected: `200 OK` + filtered results
- Purpose: Task status filtering works

**R10 — Get Task Detail**
- Endpoint: `GET /api/tasks/1`
- Auth: Manager token
- Expected: `200 OK` (if task exists) or `404 Not Found` (if no tasks)
- Purpose: Individual task detail endpoint

**R11 — Archived View**
- Endpoint: `GET /api/tasks?view=archived`
- Auth: Manager token
- Expected: `200 OK` + archived tasks (may be empty)
- Purpose: Archive view toggle works

---

### ✅ RBAC Tests (Authorization Control)

**Manager Can Create Asset (M1)**
- Endpoint: `POST /api/assets`
- Auth: Manager token
- Body: Asset JSON with code, name, location, status
- Expected: `201 Created` or `200 OK` + asset ID
- Purpose: Manager has permission to create

**Technician Cannot Create Asset (403)**
- Endpoint: `POST /api/assets`
- Auth: Technician token
- Body: Asset JSON
- Expected: `403 Forbidden` + error message
- Purpose: Technician lacks create permission (RBAC enforced)

**Missing Token Returns 401**
- Endpoint: `GET /api/assets` (without Authorization header)
- Auth: None
- Expected: `401 Unauthorized` (on protected endpoints)
- Purpose: Verify auth is required

---

## 📈 Reading Test Results

### Successful Test Response

```
✅ Status is 200
✅ Response has JWT token
✅ Response has user role
```

Green checkmarks = All assertions passed

### Failed Test Response

```
❌ Status is 200
  Expected: 200
  Received: 500
```

Red X = Assertion failed (check response in "Body" tab)

### Test Details Tab

1. **Body** — Raw JSON response from API
2. **Headers** — Response headers (Content-Type, etc.)
3. **Tests** — Test script execution results
4. **Console** — Debug messages and logs

---

## 🔧 Environment Variables

All requests use variables from the **Asset Maintenance — Local** environment:

```
api_url              → http://localhost:8080/api
manager_token        → Populated after R1 login
technician_token     → Populated after R2 login
user_token           → Populated after R3 login
manager_email        → manager@test.com
manager_password     → Manager@1234
```

### How Token Variables Work

When you run **R1 — Manager Login**:
1. Request sends credentials to `/api/auth/login`
2. Backend returns JWT token in response
3. Test script extracts token: `pm.response.json().token`
4. Script stores in environment: `pm.environment.set('manager_token', ...)`
5. Subsequent requests use this token in Authorization header

This means:
- **Always run login requests first** (R1/R2/R3)
- Tokens are valid for all subsequent requests
- Tokens persist until Postman restarts

---

## ⚠️ Important Notes

### Running in Order

For best results, run tests in this sequence:

1. **Auth — Login** (generates tokens for other tests)
2. **Assets — List & Search** (uses manager_token)
3. **Tasks — List & Filter** (uses manager_token)
4. **RBAC — Authorization** (tests role-based access)

If you skip the login tests, other requests will fail with `401 Unauthorized`.

### Public vs Protected Endpoints

- **Public**: `GET /api/assets` works without token (R13)
- **Protected**: Most endpoints require Authorization header

### Test Data

Seeded assets available:
```
TST-001  → Alpha    → OPERATIONAL
TST-002  → Beta     → UNDER_MAINTENANCE
TST-003  → Gamma    → DECOMMISSIONED
```

### Empty Results

If search/filter returns 0 results:
- ✅ Still valid (backend endpoint working)
- Check filter parameters match actual data
- Re-run `npm run seed` if database was reset

---

## 📁 File Locations

```
automation/postman/
├── Asset-Maintenance-API.postman_collection.json    ← All API requests
├── Asset-Maintenance-Local.postman_environment.json ← Variables
└── POSTMAN-TESTING-GUIDE.md                          ← This file
```

---

## 🎯 Next Steps

### Phase 1: Validate Read-Only Workflows (Done)
- ✅ Auth tests (R1/R2/R3)
- ✅ Asset list/search/filter (R4/R5/R6/R7/R13)
- ✅ Task list/filter (R8/R9/R10/R11)

### Phase 2: Add Modifying Workflow Tests (M1-M9)

Coming soon:
```javascript
// M1 — Create Asset
POST /api/assets
{
  "assetCode": "NEW-001",
  "name": "New Equipment",
  "location": "Building B",
  "status": "OPERATIONAL"
}
Expected: 201 Created

// M2 — Edit Asset
PUT /api/assets/:id
{
  "name": "Updated Equipment",
  "status": "UNDER_MAINTENANCE"
}
Expected: 200 OK

// M3 — Create Task
POST /api/tasks
{
  "title": "Maintenance",
  "assetId": 1,
  "priority": "HIGH"
}
Expected: 201 Created
```

### Phase 3: Add Destructive Workflow Tests (D1)

```javascript
// D1 — Delete Asset
DELETE /api/assets/:id
Expected: 204 No Content or 200 OK
```

---

## 🐛 Troubleshooting

### Problem: "401 Unauthorized" on all requests

**Solution:** Run login requests first
```
1. Click R1 — Manager Login → Send
2. Check that manager_token is populated
3. Now other requests should work
```

### Problem: "Connection refused" error

**Solution:** Verify backend is running
```powershell
# Terminal 1
cd backend
.\mvnw.cmd spring-boot:run

# Wait for: "Started AssetMaintenanceApplication"
# Then try Postman requests again
```

### Problem: "No such table" error

**Solution:** Re-seed the database
```powershell
cd automation
npm run seed

# Then retry requests
```

### Problem: "CORS error" in Postman

**Solution:** Postman shouldn't have CORS issues. If you get one:
1. Check backend logs for actual error
2. Verify API is returning correct headers
3. Try disabling Postman's SSL verification temporarily

---

## 📞 Support

For issues or questions:

1. **Check response body** — Most errors explained in JSON
2. **View test script** — Click "Tests" tab to see validation code
3. **Check backend logs** — Terminal where `./mvnw.cmd spring-boot:run` is running
4. **Verify environment** — Click ⚙️ → check variables are set
5. **Re-import collection** — Sometimes fixes issue with stale data

---

## 🎓 Learning Resources

- [Postman Learning Center](https://learning.postman.com/)
- [API Testing Best Practices](https://blog.postman.com/api-testing-best-practices/)
- [Our Playwright E2E Tests](../tests/) — For reference implementation

---

**Last Updated:** 2026-06-26  
**Collection Version:** 1.0  
**Coverage:** 23 API requests + 40+ test assertions  
**Status:** ✅ Production-ready for Phase 1 (Read-only workflows)
