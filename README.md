# Contentful Next.js Page Studio

This repository contains the completed engineering sprint implementation for a lightweight Page Studio built with Next.js (App Router), Redux Toolkit, and Contentful.

## 1. Problem Framing
The core problem was building an in-house landing page editor that leverages a headless CMS (Contentful) for data storage, but provides a seamless, localized WYSIWYG-lite editing experience. The system needed to strictly decouple the CMS schema from the application rendering layer via an adapter, enforce Role-Based Access Control (RBAC), and guarantee safe versioning through Semantic Versioning (SemVer). 

## 2. Key Decisions and Trade-offs
- **Adapter + Registry Pattern**: Decided to isolate Contentful API logic strictly into `contentfulClient.ts`. The UI does not know what Contentful is. A Component Registry was chosen over heavy `eval()` or massive switch statements to ensure the renderer is type-safe and easily extensible.
- **Redux for State**: Redux Toolkit + Redux Persist was selected for the Studio Editor. While React Context is simpler, Redux provides predictable deterministic state updates for complex drag-and-drop operations, prop-editing, and persistent draft storage across reloads.
- **Publishing as an API route**: Used a standard `/api/publish` endpoint instead of Server Actions because it provides a cleaner boundary for REST-like JSON payload hashing, idempotency, and middleware protection.

## 3. Assumptions
- Contentful environment variables are correctly populated and the two Content Types (`page`, `section`) are strictly adhered to.
- Vercel deployment will have a persistent storage mechanism. Currently, releases are saved to the local file system (`releases/`) for the sprint, which works locally but is ephemeral in a serverless environment.
- The `slug` is used as the primary lookup identifier across both preview and studio routes.

## 4. What is not included and why
- **Deep JSON Form Builder**: Prop editing is limited to Hero and CTA components. Building a recursive JSON schema-to-form UI (like Formik) was out of scope for the sprint's time constraints.
- **Authentication Provider**: True authentication (Auth0, NextAuth) is omitted. RBAC is mocked via a local `/dev/set-role` cookie setter to prove the middleware routing logic.
- **Remote Snapshot DB**: File-system-based snapshots are used instead of S3/Postgres to keep the repository setup lightweight without requiring external database provisioning.

---

## 5. Architecture Overview
This application uses a unique adapter + registry pattern.
- **Contentful Adapter (`contentfulClient.ts`)**: This is the strict boundary between the external CMS and our application. It fetches raw data, maps it, and immediately validates it against Zod schemas. 
- **Section Registry (`sectionRegistry.ts`)**: Instead of hardcoding components, we map type strings to React components. The `SectionRenderer` dynamically resolves and renders these components, falling back to an `UnsupportedSection` if a type is missing. 

## 6. Redux Slice Responsibilities
- **`draftPageSlice`**: Manages the localized draft state of the page being edited in the Studio. It handles reordering, adding, removing, and updating sections. This slice uses `redux-persist`.
- **`uiSlice`**: Manages purely visual editor states, such as the currently selected section in the properties panel.
- **`publishSlice`**: Tracks the asynchronous publish operation (idle, publishing, done, error) and stores the latest published version and timestamp.

## 7. Contentful Model
The Contentful Space relies on two primary Content Types:
- **`page`**: Contains a `pageId`, `slug`, `title`, and a Reference array field named `sections`.
- **`section`**: Contains a `sectionId`, `type` (e.g., 'hero', 'cta'), and a JSON field `props` which flexibly holds any component-specific data (like text, images, or configuration).

## 8. Publish + SemVer Logic
When a publisher attempts to publish, the server performs a diff between the currently published page and the incoming draft:
- **Patch**: No sections were added or removed, but the `props` JSON of at least one section changed.
- **Minor**: A new section was added to the page.
- **Major**: An existing section was removed from the page, or the type of an existing section was changed.
The system enforces idempotency by hashing the page structure. If the hash matches the latest snapshot, the publish request is skipped. Snapshots are saved to `releases/[slug]/[version].json`.

## 9. Accessibility Approach
Accessibility is treated as a foundational requirement adhering to WCAG 2.2 AAA guidelines:
- Global CSS is configured to respect `prefers-reduced-motion` settings.
- Inputs and buttons have aria-labels mapped.
- We integrated an automated Playwright accessibility check using `@axe-core/playwright`. The test visits the preview page, runs Axe, asserts zero critical violations, and generates an `a11y-report.json` artifact in the CI pipeline.
