---
name: pods-architecture
description: "Design and scaffold frontend projects using PODS Architecture (code islands). Use when: creating a new frontend feature/module, structuring a scalable React/Astro/Vue/Angular project, deciding where to place a file, reviewing folder structure, migrating a flat structure to pods, enforcing pod isolation rules, or asking about feature-based folder organization."
argument-hint: "name of the feature or pod to scaffold (e.g. 'patient', 'invoice', 'blog-list')"
---

# PODS Architecture — Code Islands for Scalable Frontend Projects

Inspired by Ember.js. Groups all code belonging to a feature/domain into a single self-contained folder called a **pod**. Each pod is a code island: it owns its components, API layer, models, mappers, and business logic.

> Reference: [Lemoncode Front Structure Guide](https://github.com/Lemoncode/lemon-front-estructura/blob/main/guia/lemon-front-guide-en.md)

---

## When to Use

- Medium or large frontend projects with multiple features/domains
- Teams where multiple developers work in parallel
- Projects where finding a file has become difficult
- Any time you scaffold a new feature or domain module

**Not recommended for**: very simple landing pages, quick prototypes, or projects with 2–3 views.

---

## Project Top-Level Structure

```
src/
├── common/        # Generic UI components, utilities, validations (no domain knowledge)
├── common-app/    # (Optional) Reusable components tied to the domain
├── core/          # Cross-cutting: routes, auth, theme, global providers
├── layouts/       # Page layout wrappers
├── pages/         # Thin pages — only compose pods, handle URL params, choose layout
└── pods/          # Feature pods (one folder per domain/feature)
    ├── patient/
    ├── invoice/
    └── ...
```

---

## Pod Internal Structure

```
pods/<feature>/
├── api/
│   ├── <feature>.api-model.ts   # DTOs — types matching the API response shape
│   └── <feature>.api.ts         # HTTP calls (fetch / axios / etc.)
├── components/
│   └── <feature>-card.tsx       # Internal subcomponents (not exported outside the pod)
├── <feature>.business.ts        # Pure business logic — no framework dependencies
├── <feature>.mapper.ts          # Converts API models → ViewModels
├── <feature>.model.ts           # ViewModel — what the UI actually needs
├── <feature>.pod.tsx            # Main pod component (entry point)
└── index.ts                     # Public API — the ONLY export surface of the pod
```

> For Astro projects replace `.tsx` extensions with `.astro` where appropriate.

---

## File Responsibilities

| File             | Responsibility                                                 |
| ---------------- | -------------------------------------------------------------- |
| `*.api-model.ts` | TypeScript types matching the raw API response (DTOs)          |
| `*.api.ts`       | Functions that make HTTP calls; returns `api-model` types      |
| `*.model.ts`     | ViewModel — data shaped for the UI, not coupled to the API     |
| `*.mapper.ts`    | Pure functions converting `api-model` → `model`                |
| `*.business.ts`  | Domain rules, calculations, validations — framework-free       |
| `*.pod.tsx`      | Main component; orchestrates data fetching and subcomponents   |
| `components/`    | Private subcomponents used only within this pod                |
| `index.ts`       | Re-exports only what other parts of the app are allowed to use |

---

## The Four Golden Rules

### Rule 1 — A pod CANNOT import from another pod

```ts
// ❌ FORBIDDEN
import { PatientCard } from "@/pods/patient";

// ✅ ALLOWED — extract shared logic to common or common-app
import { Avatar } from "@/common/components/avatar";
```

Exception: a "container pod" may import the **main component** of a child pod, never its internals.

### Rule 2 — Duplication is better than coupling

If two pods have similar models, **copy, don't share**. Sharing breaks isolation. If you find yourself duplicating three or more times, extract to `common` or `common-app` — never at the expense of pod isolation.

### Rule 3 — Pages must be thin

A page file should only:

- Choose a layout
- Read URL parameters
- Compose pods

**No business logic, no API calls, no data transformation** in pages (except framework-specific SSG helpers like `getStaticPaths` in Astro).

### Rule 4 — core vs common

| Folder        | Contains                                                       |
| ------------- | -------------------------------------------------------------- |
| `core/`       | Routes, authentication, theme, global providers                |
| `common/`     | Generic UI components, utilities, validators (domain-agnostic) |
| `common-app/` | Reusable components that carry domain knowledge                |

---

## Scaffolding a New Pod (Step-by-Step)

1. **Create the folder** `src/pods/<feature>/`
2. **Define the ViewModel** in `<feature>.model.ts` — what the UI needs, nothing more
3. **Define the DTO** in `api/<feature>.api-model.ts` — mirror the API response
4. **Write the mapper** in `<feature>.mapper.ts` — pure function, no side effects
5. **Write business logic** in `<feature>.business.ts` — pure functions, no imports from `src/pods`
6. **Implement the API layer** in `api/<feature>.api.ts`
7. **Build the main component** in `<feature>.pod.tsx` — calls API, maps data, renders subcomponents
8. **Export public surface** in `index.ts` — only export what pages/layouts need

---

## Astro Example

```astro
---
// src/pages/index.astro  — THIN PAGE
import MainLayout from '@/layouts/main.layout.astro';
import HeroPod from '@/pods/hero/hero.pod.astro';
import BlogListPod from '@/pods/blog-list/blog-list.pod.astro';
import ContactFormPod from '@/pods/contact-form/contact-form.pod.astro';
---

<MainLayout title="Home">
  <HeroPod />
  <BlogListPod />
  <ContactFormPod />
</MainLayout>
```

---

## Benefits Summary

| Benefit             | Why                                                         |
| ------------------- | ----------------------------------------------------------- |
| Faster onboarding   | Everything for a feature lives in one folder                |
| Fewer git conflicts | Developers work in isolated pods                            |
| Safer changes       | Modifications to one pod cannot ripple into others          |
| Easier migrations   | Migrate pod by pod, not all at once                         |
| Cleaner tests       | Mappers, business logic, and API are independently testable |

---

## Anti-patterns to Avoid

- Importing internal files of a pod from outside (`@/pods/patient/patient.mapper`) — use `index.ts`
- Putting business logic in page files
- Sharing models between pods directly
- Creating a "utils" god-folder inside a pod for unrelated helpers
- Skipping `index.ts` and letting every file be public
