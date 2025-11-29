# 🔍 Project Audit Report - JDM Heaven

## Critical Issues Found

### 1. ⚠️ DUPLICATE Sanity Client Files
**Issue:** Two Sanity client files exist with conflicting exports:
- `src/lib/sanity.ts` - exports `sanityClient`, `urlFor`, `handleSanityError`
- `src/lib/sanity-client.ts` - exports same functions but with different implementations

**Impact:** 
- Files import from different sources causing inconsistencies
- `handleSanityError` is async in `sanity-client.ts` but sync in `sanity.ts`
- `cms.ts` imports from `sanity-client` but `sync` files import from `sanity`

**Files Affected:**
- `src/lib/cms.ts` → imports from `sanity-client`
- `src/lib/cms-client.ts` → imports from `sanity-client`
- `src/lib/sync/sanity-to-supabase.ts` → imports from `sanity`
- `src/components/cms/*` → mixed imports

**Fix:** Consolidate into single `sanity.ts` file

---

### 2. ⚠️ DUPLICATE CMS Files
**Issue:** Two CMS API files:
- `src/lib/cms.ts` - exports `cms` object
- `src/lib/cms-client.ts` - exports `cmsClient` object

**Impact:** Confusion about which to use, potential duplicate code

**Fix:** Consolidate or clearly document which to use

---

### 3. ⚠️ Missing Dependency
**Issue:** `@sanity/client` not explicitly in `package.json` dependencies
- Currently installed via `@sanity/cli` (dev dependency)
- Should be in main dependencies for production builds

**Fix:** Add `@sanity/client` to dependencies

---

### 4. ⚠️ Async/Sync Mismatch
**Issue:** `handleSanityError` in `sanity-client.ts` is `async` but called synchronously:
```typescript
// In cms.ts line 40:
const errorResult = handleSanityError(error); // Called without await
```

But in `sanity-client.ts`:
```typescript
export const handleSanityError = async (error: any) => { // Async function
```

**Impact:** Errors not handled correctly, potential runtime issues

**Fix:** Make `handleSanityError` synchronous or await it properly

---

### 5. ⚠️ Inconsistent Imports
**Issue:** Files import Sanity from different sources:
- Some use: `from '../sanity'`
- Others use: `from '../sanity-client'`
- Some use: `from '@/lib/sanity'`
- Others use: `from '@/lib/sanity-client'`

**Impact:** Potential runtime errors, confusion

**Fix:** Standardize all imports to use `@/lib/sanity`

---

### 6. ⚠️ Missing TypeScript Types
**Issue:** Edge Function uses Deno types which TypeScript doesn't recognize
- Expected for Deno runtime, but causes linting errors
- Should be excluded from TypeScript checking

**Fix:** Add `supabase/functions/**` to `tsconfig.json` exclude

---

### 7. ⚠️ API Syntax Error
**Issue:** In `src/lib/api.ts` line 65, there's a syntax issue:
```typescript
.select(`
  *,
  car:cars(*)
`);  // Missing closing backtick?
```

**Fix:** Verify syntax is correct

---

## Medium Priority Issues

### 8. ⚠️ Environment Variable Inconsistencies
- Some files check for `VITE_SANITY_PROJECT_ID`
- Others check for `SANITY_STUDIO_PROJECT_ID`
- Should be consistent

### 9. ⚠️ Dataset Name Inconsistency
- Config uses `car-inventory`
- Some places use `production`
- Should be consistent

### 10. ⚠️ Missing Error Handling
- Some API calls don't have proper error handling
- Missing try-catch blocks in some async functions

---

## Low Priority Issues

### 11. ⚠️ Code Duplication
- Similar error handling code in multiple places
- Could be extracted to utilities

### 12. ⚠️ Missing Type Definitions
- Some `any` types that could be properly typed
- Missing return types on some functions

---

## Configuration Issues

### ✅ Build Configuration
- Vite config: ✅ Good
- TypeScript config: ✅ Good
- Path aliases: ✅ Configured correctly

### ✅ Deployment Configuration
- Vercel: ✅ Configured
- Netlify: ✅ Configured
- Both have proper routing and headers

---

## Next Steps

1. Fix duplicate Sanity client files
2. Fix async/sync mismatch
3. Add missing dependencies
4. Standardize imports
5. Fix TypeScript configuration
6. Test all connections

