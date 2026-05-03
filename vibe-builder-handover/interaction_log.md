# VibeBuilder Interaction Log

This log tracks the development and stabilization milestones for the VibeBuilder project. It is designed to be updated with each new session.

## 📝 Session: VibeBuilder Stabilization (May 2026)
**Primary Goal**: Resolve GraphQL regressions and stabilize the Site Builder publication workflow.

### 🛠️ Timeline & Milestones

| Interaction | Goal | Outcome | Status |
| :--- | :--- | :--- | :--- |
| **01** | Fix GraphQL 400 Errors | Identified array-wrapped scalars in mutations. Converted to direct scalar types. | ✅ Fixed |
| **02** | Correct Site Retrieval | Fixed mismatched site extraction in `use-live-site` hook to handle legacy array data. | ✅ Fixed |
| **03** | Solve Save Persistence | Discovered manual save was overwriting with stale data. Linked save to live editor state. | ✅ Fixed |
| **04** | Fix Live Site Layout | Corrected centering and theme styling in `LiveRendererPage`. | ✅ Fixed |
| **05** | Standardize Filters | Replaced complex manual JSON filters with robust `ItemId` targeting. | ✅ Fixed |
| **06** | Data Flattening | Implemented universal normalization for page slugs and names to prevent matching errors. | ✅ Fixed |

### 🚀 Key Technical Decisions
- **Scalar-Strict Mutations**: Enforced non-array types for all Boolean/String inputs to satisfy the Selise Blocks Gateway.
- **ItemId Priority**: Switched from slug-based filtering to `ItemId` filtering for all update operations to ensure 100% record accuracy.
- **Ultra-Permissive Reads**: Implemented fallback checks for multiple backend field names (`getVibePages`, `VibePages`, etc.) to ensure resilience against schema changes.

---

## ➕ Future Interactions
*Use the template below to add new interaction records.*

### 📝 Session: [Name] ([Date])
**Goal**: [Primary Objective]

| Interaction | Goal | Outcome | Status |
| :--- | :--- | :--- | :--- |
| **XX** | [Feature/Bug] | [Description of change] | [Status] |

---
*End of Log*
