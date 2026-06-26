# Postman Testing — Quick Reference

## Setup (First Time Only)

```
1. Open Postman
2. File → Import → Asset-Maintenance-API.postman_collection.json
3. File → Import → Asset-Maintenance-Local.postman_environment.json
4. Select environment dropdown: "Asset Maintenance — Local"
5. Done! Ready to test
```

---

## Running Tests

### Single Request
1. Click request (e.g., "R1 — Manager Login")
2. Click **Send**
3. View results in response panel

### Entire Folder
1. Right-click folder (e.g., "Auth — Login")
2. Click **Run folder**
3. Watch test run in new window

### Full Collection
1. Click **Asset Maintenance API** (top)
2. Right-click → **Run collection**
3. Or: Click **Run** button if visible

---

## Test Order (Important!)

**Always run in this sequence:**

1. **Auth — Login**
   - R1 — Manager Login (generates manager_token)
   - R2 — Technician Login (generates technician_token)
   - R3 — User Login (generates user_token)

2. **Assets — List & Search**
   - Use tokens from step 1

3. **Tasks — List & Filter**
   - Use tokens from step 1

4. **RBAC — Authorization**
   - Final validation tests

---

## Test Credentials

```
Manager:
  Email: manager@test.com
  Password: Manager@1234
  Role: MANAGER

Technician:
  Email: technician@test.com
  Password: Tech@1234
  Role: TECHNICIAN

User:
  Email: user@test.com
  Password: User@1234
  Role: USER

Admin:
  Email: admin@test.com
  Password: Admin@1234
  Role: ADMIN
```

---

## API Base URL

```
http://localhost:8080/api
```

Make sure backend is running on port 8080!

---

## Common Issues

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Run R1 login first |
| Connection refused | Start backend: `.\mvnw.cmd spring-boot:run` |
| No tests appear in response | Check internet (tests require npm packages) |
| Empty results on search | Data might be empty; re-run `npm run seed` |
| Environment variables empty | Re-import environment file |

---

## Interpreting Results

✅ Green checkmark = Test passed
❌ Red X = Test failed

Click **Tests** tab to see:
- Which assertions passed/failed
- Expected vs actual values
- Error messages

---

## Keyboard Shortcuts

- **Ctrl+S** — Save current request
- **Ctrl+Enter** — Send request
- **Alt+C** — Open console
- **Shift+Ctrl+L** — Sidebar toggle

---

## File Locations

```
automation/postman/
├── Asset-Maintenance-API.postman_collection.json
├── Asset-Maintenance-Local.postman_environment.json
└── POSTMAN-TESTING-GUIDE.md (full guide)
```

---

## Workflow IDs Tested

**Read-Only (R):**
- R1, R2, R3: Login workflows ✅
- R4: View asset list ✅
- R5: Search assets ✅
- R6: Filter assets ✅
- R7: Combined search + filter ✅
- R8: View task list ✅
- R9: Filter tasks ✅
- R10: View task detail ✅
- R11: Archive view ✅
- R13: Public API ✅

**Modifying (M):**
- M1: Create asset (basic test) ✅

**Authorization (RBAC):**
- Manager create asset ✅
- Technician cannot create (403) ✅
- Missing token (401) ✅

---

## Running Automated Tests (Newman CLI)

```bash
# Install Newman globally
npm install -g newman

# Run tests
newman run Asset-Maintenance-API.postman_collection.json \
  -e Asset-Maintenance-Local.postman_environment.json \
  --reporters cli,json

# Output saved to results.json
```

---

## Need Help?

1. See full guide: `POSTMAN-TESTING-GUIDE.md`
2. Check backend logs: Terminal running `spring-boot:run`
3. View raw response: Click **Body** tab after sending request
4. Inspect test code: Click **Tests** tab
5. Check console: **View** → **Show Postman Console** (Ctrl+Alt+C)

---

**Version:** 1.0  
**Created:** 2026-06-26  
**Status:** ✅ Ready to use
