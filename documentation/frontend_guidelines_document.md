# Frontend Guideline Document: FaceReader-AI

This document outlines the frontend architecture, design principles, technologies, and best practices used in the FaceReader-AI starter template. It’s written in clear, everyday language so anyone—technical or not—can understand how the frontend is set up and why.

## 1. Frontend Architecture

**Frameworks and Libraries**
- **Next.js 15 (App Router & Turbopack):** Our main framework. It handles routing, server-side rendering (SSR), server components, and file-based organization.
- **React 19:** The UI library powering components and interactivity.
- **TypeScript:** Ensures type safety across code, reducing bugs and improving maintainability.
- **Tailwind CSS:** Utility-first styling for rapid, consistent design.
- **shadcn/ui (built on Radix UI):** A collection of unstyled, accessible components (buttons, inputs, cards, tables) that we style with Tailwind.
- **next-themes:** Manages dark/light mode switching via CSS variables.

**How It Supports Scalability, Maintainability, and Performance**
- **Modular File Structure:** Separate folders for pages (`/app`), components (`/components`), utilities (`/lib`), and database logic (`/db`). This clear separation makes it easy to find and extend code.
- **Server Components:** Offloads rendering to the server, reducing bundle size on the client and improving load times.
- **Type Safety:** TypeScript catches errors at compile time, making large codebases easier to maintain.
- **Utility-First CSS:** Tailwind generates only the CSS you use, keeping stylesheets small and performance high.
- **Turbopack:** Speeds up local builds and development server refreshes.

## 2. Design Principles

**Key Principles**
- **Usability:** Interfaces are intuitive and focused on user tasks (sign-in, dashboard navigation, data display).
- **Accessibility:** All components follow WCAG standards. We use Radix UI’s accessibility primitives plus semantic HTML and ARIA attributes.
- **Responsiveness:** Layouts adapt to mobile, tablet, and desktop. We leverage Tailwind’s responsive utilities to adjust grids, typography, and spacing.
- **Consistency:** Shared design tokens (colors, spacing, typography) ensure a unified look across screens.

**Applying These Principles**
- **Button and Form Patterns:** Consistent padding, focus states, and error handling across all forms.
- **Navigation:** A fixed sidebar on larger screens, collapsible or hidden on small devices to maximize content space.
- **Feedback:** Loading indicators on data fetches, clear error messages on authentication failures, and success states after actions.

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS (Utility-First):** We write class names that map directly to design rules (e.g., `bg-primary text-white px-4 py-2`).
- **BEM-Like Naming for Custom CSS:** When writing custom styles, we follow a simple BEM (Block__Element--Modifier) pattern inside component-scoped `.module.css` or within Tailwind’s `@apply` blocks.

**Theming**
- **CSS Variables:** Defined in `globals.css`:
  - `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--error`.
- **next-themes:** Switches these variables between light and dark modes.

**Visual Style**
- **Modern Flat with Glassmorphism Accents:** Clean interfaces, subtle glassmorphic panels on dashboards for depth.
- **Color Palette**
  - Primary: #4F46E5 (indigo)
  - Secondary: #10B981 (emerald)
  - Accent: #F59E0B (amber)
  - Background (light): #FFFFFF
  - Background (dark): #1F2937
  - Foreground (text light): #111827
  - Foreground (text dark): #F9FAFB
  - Error: #EF4444 (red)

**Typography**
- **Font Family:** Inter, sans-serif
- **Sizing Scale:** `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, etc., following Tailwind conventions.

## 4. Component Structure

**Organization**
- **`/components/ui`:** Low-level building blocks from shadcn/ui. Each component (button, input, table) is wrapped and styled with Tailwind.
- **`/components`:** Higher-level components combining UI primitives (e.g., `AuthButtons`, `ThemeToggle`, `AppSidebar`, `SectionCards`, `ChartAreaInteractive`, `DataTable`).

**Reusability**
- Components accept props for labels, data, event handlers, and styling overrides.
- Shared utility functions (e.g., `cn` for conditional class names) live in `/lib/utils.ts`.

**Benefits of Component-Based Architecture**
- **Maintainability:** Fix or update one component in `/components/ui` and all usages reflect the change.
- **Clarity:** Each component does one thing and is easy to test.
- **Consistency:** Shared components ensure uniform look and feel.

## 5. State Management

**Approach**
- **Local State with React Hooks:** `useState`, `useEffect` for simple component-level state (form inputs, toggle states).
- **Context for Global UI State:** `next-themes` provides a ThemeContext. We can add more contexts (e.g., UserContext) if needed.

**Sharing State Across Components**
- **Server-Side Data:** Authentication and user session state live in Next.js server components and are passed down via props.
- **Client-Side Data:** For complex client-side caching (e.g., live dashboards), we recommend integrating React Query or SWR in future iterations.

## 6. Routing and Navigation

**Routing**
- **Next.js App Router:** File-based routing under `/app`. Each folder with `page.tsx` becomes a route (`/sign-in`, `/dashboard`, etc.).
- **Layouts:** `layout.tsx` files define shared wrappers (headers, footers, sidebars) for nested routes.

**Navigation Structure**
- **Public Routes:** Landing page (`/`), `/sign-in`, `/sign-up`.
- **Protected Routes:** `/dashboard` and nested pages. Route guards redirect unauthenticated users to `/sign-in`.
- **Sidebar Navigation:** Lists dashboard sections. Collapses on small screens.

## 7. Performance Optimization

**Built-In Next.js Features**
- **Server Components & SSR:** Minimizes client bundle size and speeds up first load.
- **Turbopack:** Faster bundling in development.
- **Image Optimization:** Use `next/image` for automatic resizing and format selection.

**Additional Strategies**
- **Code Splitting & Dynamic Imports:** Lazy-load heavy components (e.g., charts) with `next/dynamic`.
- **Tree Shaking & PurgeCSS:** Tailwind’s purge removes unused CSS.
- **Asset Optimization:** Compress images, serve fonts via CDN.

## 8. Testing and Quality Assurance

**Unit Testing**
- **Framework:** Jest with React Testing Library.
- **Targets:** Pure functions (`/lib`), UI components (`/components/ui`).

**Integration Testing**
- **Framework:** React Testing Library or Jest’s integration setups.
- **Targets:** Component interactions, form submissions, API client (`/lib/auth-client.ts`).

**End-to-End Testing**
- **Framework:** Cypress or Playwright.
- **Targets:** Critical flows—sign-up, sign-in, dashboard access, theme toggle.

**Linting & Formatting**
- **ESLint:** Enforce code style and catch errors early.
- **Prettier:** Consistent formatting across all files.

## 9. Conclusion and Overall Frontend Summary

The FaceReader-AI frontend combines modern frameworks (Next.js 15, React 19, TypeScript) with a utility-first styling approach (Tailwind CSS) and accessible components (shadcn/ui). Its modular architecture—clear folder structure, component reuse, and server components—ensures scalability and maintainability. Design principles like usability, accessibility, and responsiveness guide every UI decision, while built-in performance optimizations (SSR, Turbopack, code splitting) deliver a fast user experience.

By following these guidelines:
- Developers can onboard quickly and understand where to add or modify code.
- Designers can trust that colors, typography, and spacing remain consistent.
- Product owners can be confident the app will perform well on any device.

This foundation is ready to extend with AI features, advanced state management, or custom business logic—allowing teams to focus on innovation rather than boilerplate setup.