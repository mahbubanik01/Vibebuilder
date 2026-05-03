# VibeBuilder Source Code Index

This document provides a comprehensive map of the VibeBuilder codebase, categorized by module and architectural layer. Use these links to navigate the core logic.

## 🏗️ Core Architecture
- **App Entry**: [App.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/App.tsx)
- **Routing**: [app-routes.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/routes/app-routes.tsx)
- **Global Layout**: [main-layout.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/layout/main-layout/main-layout.tsx)
- **GraphQL Client**: [graphql-client.ts](file:///c:/Users/HP/Downloads/vibebuilder/src/lib/graphql-client.ts)

## 🌐 Site Builder Module (`src/modules/site-builder/`)
The flagship module for visual site creation and live publishing.
- **Editor Workspace**: [editor-page.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/components/editor-page.tsx)
- **Site List**: [site-list-page.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/components/site-list-page.tsx)
- **Live Engine**: [live-renderer-page.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/components/live-renderer-page.tsx)
- **Section Renderer**: [section-renderer.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/components/section-renderer.tsx)
- **Editor Logic Hook**: [use-site-editor.ts](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/hooks/use-site-editor.ts)
- **Cloud Service**: [site-builder.service.ts](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/site-builder/services/site-builder.service.ts)

## 💼 Business Modules (`src/modules/`)
- **Invoices**: [invoices/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/invoices/)
- **Finance**: [finance/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/finance/)
- **File Manager**: [file-manager/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/file-manager/)
- **Inventory**: [inventory/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/inventory/)
- **Task Manager**: [task-manager/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/task-manager/)
- **Chat & Email**: [chat/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/chat/) | [email/](file:///c:/Users/HP/Downloads/vibebuilder/src/modules/email/)

## 🧠 State & Data Layer (`src/state/`)
- **Authentication**: [auth/](file:///c:/Users/HP/Downloads/vibebuilder/src/state/store/auth/)
- **Query Hooks**: [query-client/hooks.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/state/query-client/hooks.tsx)
- **Global UI Store**: [store/](file:///c:/Users/HP/Downloads/vibebuilder/src/state/store/)

## 🎨 UI Kit & Styles
- **Component Library**: [ui-kit/](file:///c:/Users/HP/Downloads/vibebuilder/src/components/ui-kit/)
- **Global Styles**: [index.css](file:///c:/Users/HP/Downloads/vibebuilder/src/index.css)
- **Theme Configuration**: [theme-provider.tsx](file:///c:/Users/HP/Downloads/vibebuilder/src/styles/theme/theme-provider.tsx)

---
*Note: This index covers the active development branch and stabilized components as of May 2026.*
