# Postman Testing — Getting Started (Step-by-Step)

## 5-Minute Setup

### Step 1: Download & Open Postman

1. Go to [getpostman.com/downloads](https://www.getpostman.com/downloads)
2. Download and install for your OS
3. Open Postman (you'll see the main interface)

---

### Step 2: Import Collection

1. Click **File** (top-left menu)
2. Click **Import**
3. Click **Upload Files**
4. Navigate to: `automation/postman/`
5. Select: `Asset-Maintenance-API.postman_collection.json`
6. Click **Open**
7. Click **Import**

✅ You should now see folder structure on left side:
```
Asset Maintenance API
├── Auth — Login
├── Assets — List & Search
├── Tasks — List & Filter
└── RBAC — Authorization
```

---

### Step 3: Import Environment

1. Click **Settings** ⚙️ (bottom-left corner)
2. Click **Environments**
3. Click **Import**
4. Click **Upload Files**
5. Navigate to: `automation/postman/`
6. Select: `Asset-Maintenance-Local.postman_environment.json`
7. Click **Open**

✅ Environment imported

---

### Step 4: Select Environment

1. Look at **top-right** corner
2. There's a dropdown that says "No Environment"
3. Click it
4. Select **"Asset Maintenance — Local"**

✅ You should see: `Asset Maintenance — Local` displayed in top-right

---

## Running Your First Test

### Test 1: Login (Get JWT Token)

1. Expand **"Auth — Login"** folder on left
2. Click **"R1 — Manager Login"**
3. You'll see the request details:
   - **Method:** POST
   - **URL:** {{api_url}}/auth/login
   - **Body:** JSON with email and password
4. Click **Send** button (blue, top-right of request area)

**What you should see:**

```
✅ Status: 200 OK

Response Body (JSON):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "manager@test.com",
  "role": "MANAGER",
  "fullName": "Manager User"
}

Tests: 3/3 passed ✅
✓ Status is 200
✓ Response has JWT token
✓ Response has user role
```

**What this did:**
- Sent login credentials to backend
- Backend validated and returned JWT token
- Test script automatically stored token in environment
- Now you can use this token for other requests!

---

### Test 2: View Assets (Using Token)

1. Expand **"Assets — List & Search"**
2. Click **"R4 — Manager Views Asset List"**
3. Notice the header:
   ```
   Authorization: Bearer {{manager_token}}
   ```
   This automatically uses the token from Step 1
4. Click **Send**

**What you should see:**

```
✅ Status: 200 OK

Response Body (JSON):
[
  {
    "id": 1,
    "assetCode": "TST-001",
    "name": "Alpha",
    "location": "Building A",
    "status": "OPERATIONAL"
  },
  {
    "id": 2,
    "assetCode": "TST-002",
    "name": "Beta",
    "location": "Building B",
    "status": "UNDER_MAINTENANCE"
  },
  ...
]

Tests: 2/2 passed ✅
✓ Status is 200
✓ Response is array of assets
✓ Asset objects have required fields
```

**What this did:**
- Used manager token from previous login
- Called API to get all assets
- Backend returned list of assets
- Tests validated response structure

---

## Running All Tests at Once

### Option A: Run Single Folder

1. Right-click **"Auth — Login"** folder
2. Click **"Run Auth — Login"**
3. New window opens
4. Click **"Run Auth — Login"** button
5. Watch tests execute one-by-one

**Result:** All 4 auth tests run in sequence

---

### Option B: Run Entire Collection

1. Right-click **"Asset Maintenance API"** (top)
2. Click **"Run Asset Maintenance API"**
3. Config window appears (defaults are fine)
4. Click **"Run Asset Maintenance API"** button

**Result:** All 23 requests run in sequence

Expected output:
```
23 requests run
21 passed ✅
2 skipped (task tests, optional)

Summary:
├─ Auth: 4 passed
├─ Assets: 7 passed
├─ Tasks: 5 passed
└─ RBAC: 3 passed
```

---

### Option C: Run from Command Line

```bash
# Install Newman (if not already installed)
npm install -g newman

# Navigate to automation folder
cd automation

# Run all tests
newman run postman/Asset-Maintenance-API.postman_collection.json \
  -e postman/Asset-Maintenance-Local.postman_environment.json \
  --reporters cli

# Output will show:
# ✅ POST /auth/login — R1 — Manager Login
# ✅ GET /assets — R4 — Manager Views Asset List
# ... etc
# 
# 23 passed in 15 seconds
```

---

## Understanding Test Results

### Green Checkmark ✅

```
✓ Status is 200
```

Means: The assertion passed. The API returned the expected status code.

### Red X ❌

```
❌ Status is 200
   Expected: 200
   Received: 500
```

Means: The assertion failed. Something went wrong.

### How to Debug

If a test fails:

1. **Check Backend**
   ```
   Terminal running: .\mvnw.cmd spring-boot:run
   Look for error messages
   ```

2. **Check Response Body**
   - Click "Body" tab in Postman
   - See raw response from API
   - Look for error messages

3. **Check Test Script**
   - Click "Tests" tab
   - See what assertion failed
   - Read the test code

4. **Verify Environment**
   - Click ⚙️ Settings
   - Click Environments
   - Check that tokens are populated

5. **Re-seed Database**
   ```powershell
   cd automation
   npm run seed
   ```

---

## Common Scenarios

### Scenario 1: First Time Running

**Expected issue:** Requests fail with `401 Unauthorized`

**Solution:**
1. Run **R1 — Manager Login** first
2. Wait for success (should see JWT token in response)
3. Now try other requests
4. They'll use the token from R1

**Key:** Always run login requests first!

---

### Scenario 2: Tests Pass Locally, But Fail in CI/CD

**Possible causes:**
- Different database state
- Backend not started
- Network timeout
- Token expiration

**Solution:**
```bash
# Add to your CI pipeline:
1. Start backend
2. Wait for health check
3. Seed database
4. Run Newman tests
5. Parse results
```

---

### Scenario 3: Want to Test with Different Credentials

**Current flow:**
```
R1: Manager login → stores manager_token
R4: Uses manager_token
```

**To test as Technician:**
```
1. Run R2 — Technician Login
   This stores technician_token
2. Edit R4 request
3. Change header from: Bearer {{manager_token}}
   To: Bearer {{technician_token}}
4. Send R4 again
   Now using Technician token
```

---

## Keyboard Shortcuts

Make testing faster:

| Shortcut | Action |
|----------|--------|
| **Ctrl+S** | Save request |
| **Ctrl+Enter** | Send request |
| **Ctrl+K** | Open saved requests |
| **Cmd+K** | (Mac) Open saved requests |
| **Ctrl+Alt+C** | Open console |
| **Tab** | Autocomplete variables |

---

## Tips & Tricks

### 1. Use Console for Debugging

```
Ctrl+Alt+C (or Cmd+Alt+C on Mac)
```

Shows console with:
- Request details sent
- Response details received
- JavaScript console.log() output
- Error messages

### 2. View Request History

Click **History** (left sidebar) to see all requests you've ever sent.

### 3. Save Requests to Collection

After you modify a request, save it:
- Ctrl+S or right-click → Save

### 4. Use Collections in API Docs

Export as API documentation:
- Right-click collection
- Select "Generate Documentation"
- Share with team

### 5. Monitor Performance

Click **Body** tab → **Timeline** to see:
- Response time
- Download speed
- Network details

---

## File Locations

```
c:\Users\JainilShah\Downloads\asset-maintenance\automation\postman\
├── Asset-Maintenance-API.postman_collection.json      ← Import this
├── Asset-Maintenance-Local.postman_environment.json   ← Import this
├── POSTMAN-TESTING-GUIDE.md                            ← Full documentation
├── QUICK-REFERENCE.md                                  ← One-page cheat sheet
└── GETTING-STARTED.md                                  ← This file
```

---

## Next Steps

1. ✅ Complete steps 1-4 above
2. ✅ Run your first test (R1 Login)
3. ✅ Run a few requests
4. ✅ Try running entire folder
5. **Read:** `POSTMAN-TESTING-GUIDE.md` for more details
6. **Share:** Results with your mentor

---

## Getting Help

| Issue | Solution |
|-------|----------|
| Don't see requests | Refresh: F5 |
| 401 errors on everything | Run R1 login first |
| Connection refused | Start backend: `.\mvnw.cmd spring-boot:run` |
| Environment not working | Re-import environment file |
| Tests not showing | Scroll down in response panel |
| Can't find Quick Reference | See `QUICK-REFERENCE.md` in postman folder |

---

## You're Ready! 🚀

You now have everything needed to:
- ✅ Test API endpoints manually
- ✅ Run automated test suites
- ✅ Validate authentication and authorization
- ✅ Debug API issues
- ✅ Share results with team

**Next:** Show your mentor the results!

```bash
# Run full suite and save report
newman run postman/Asset-Maintenance-API.postman_collection.json \
  -e postman/Asset-Maintenance-Local.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export postman-results.html

# Open postman-results.html in browser to see nice report
```

---

**Questions?** Check `POSTMAN-TESTING-GUIDE.md` for detailed explanations.

**Ready to test?** Let's go! 🎯
