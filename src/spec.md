# Specification

## Summary
**Goal:** Pivot Diamond Scout to a diamond assessment app where authenticated users can record diamonds (carat/value notes), view estimates safely, and connect out to buyer platforms.

**Planned changes:**
- Add persistent backend data models for per-user diamond assessment records (id, owner Principal, createdAt, optional photo reference string, optional carat, optional estimated value, notes) with access control by Principal and upgrade-safe storage.
- Implement authenticated backend APIs to create, list, fetch, and update the caller’s diamond records, with clear errors for unauthenticated access and cross-user access attempts.
- Add a new “Diamonds” UI area: create diamond records, show “My Diamonds” list, and provide a record detail view displaying carat and “Estimated value” in English.
- Add an optional client-side-only photo attach and observation/notes capture flow, with explicit UI copy that outputs are estimates and do not verify physical authenticity.
- Add a “Buyers” section: fetch a curated buyer-platform list (name + external URL) from the backend, render it in the UI, and open links in a new tab.
- Add a “Copy summary” action on diamond details to copy a plain-English summary including carat and estimated value (when available).
- Update authenticated header and public welcome branding to diamond-focused name/tagline/imagery, while keeping the existing Credits page content in English intact.

**User-visible outcome:** Signed-in users can create and manage diamond assessment records (with optional photo and notes), see clearly labeled estimated carat/value, browse external buyer platforms, and copy a diamond summary to contact buyers; the app branding reflects the diamond-focused purpose.
