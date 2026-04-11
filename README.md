# Zeronotes

End-to-end encrypted notes application with zero-knowledge architecture, domain-driven backend, and custom drag-and-drop grid.

![Zeronotes — masonry grid, labels, and dark UI](apps/frontend/public/screenshots/screenshot.png)

---

## Features

**Security**

- Zero-knowledge architecture — server never sees unencrypted data or decryption keys
- Client-side AES-GCM encryption with PBKDF2 key derivation (100,000 iterations)
- Wrapped data key pattern: password-derived KEK encrypts a random data key stored server-side
- Versioned encryption payload enables future algorithm upgrades without breaking old data

**User Experience**

- Google Keep-style masonry grid with drag-to-reorder
- Custom drag-and-drop engine built from scratch using browser pointer events
- Real-time layout reflow with CSS transforms for 60fps performance
- Instant search and filtering across notes

**Architecture**

- Domain-driven backend with clear separation of concerns (domain, repository, service layers)
- Monorepo structure with shared Zod schemas for end-to-end type safety
- Optimized state management using Zustand with memoized selectors
- PostgreSQL with `json_agg` for efficient relational queries

---

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Zustand for state management (centralized store with memoized selectors)
- TanStack Router for routing
- Tailwind CSS for styling
- Zod for runtime validation
- Vitest for unit testing
- Vite for build tooling

**Backend**

- Node.js + Express + TypeScript
- PostgreSQL with structured SQL queries
- JWT authentication (Jose library)
- Argon2 for password hashing
- Domain-driven design pattern (repositories, services, mappers)
- Jest + Supertest for integration testing

**Infrastructure**

- Monorepo managed by Turborepo + pnpm workspaces
- Shared `@zeronotes/shared` package for schemas and constants
- Migration tooling for database schema management

**Testing**

- Vitest for frontend unit tests
- Jest for backend integration tests
- Test coverage for encryption/decryption edge cases
- Integration tests covering auth flows and data persistence

---

## Architecture & Design Decisions

### Zero-Knowledge Encryption

Data is encrypted client-side before ever reaching the server. The backend stores encrypted blobs and has no access to decryption keys or user passwords. This architecture ensures that even with full database access, the server cannot decrypt user data.

**Implementation:**

1. **Password-derived KEK:** PBKDF2 derives a Key Encryption Key (KEK) from the user's password with 100,000 iterations and a unique salt
2. **Wrapped data key:** A random 256-bit AES key (the "data key") encrypts all note content. This data key is encrypted (wrapped) by the KEK and stored server-side
3. **Per-note encryption:** Each note is encrypted with AES-GCM using the data key with a unique IV per note
4. **Version field:** Encryption metadata includes a version field to support future algorithm upgrades without breaking old data

**Why this pattern:**

- The server stores the wrapped data key but cannot unwrap it without the user's password
- Password changes only require re-wrapping the data key, not re-encrypting all notes
- Lost passwords are unrecoverable by design (true zero-knowledge)

### Custom Drag-and-Drop

Rather than using react-beautiful-dnd or dnd-kit, I built a drag system from scratch to understand the underlying mechanics: pointer events, coordinate transforms, collision detection, and layout reflow.

**Implementation:**

- Mouse event listeners track drag state and calculate pointer position
- Collision detection uses grid position lookups from Zustand store
- Layout reflow triggers immediately on swap with CSS transform animations
- Anti-flicker logic prevents rapid re-ordering when notes shift under cursor

**Why custom:**

- Full control over animation performance (CSS transforms, no layout thrashing)
- Deeper understanding of browser event model and coordinate systems
- Smaller bundle size (no external dependency)
- Masonry grid calculations integrate cleanly with drag logic

### Domain-Driven Backend

The backend follows DDD principles with clear boundaries between layers:

- **Domain layer:** Business logic and entities (`domain/notes/`, `domain/auth/`)
- **Repository layer:** Data access abstraction (SQL queries, no business logic)
- **Service layer:** Orchestration and use cases (coordinates repositories)
- **Mappers:** Translation between domain objects and database rows

**Example flow (creating a note):**

1. Route receives validated request → calls service
2. Service orchestrates: get min order → create note → add labels
3. Repository executes SQL queries and returns rows
4. Mapper transforms database row → domain Note object

This separation makes the codebase easier to test (mock repositories) and reason about as complexity grows. Each layer has a single responsibility.

### State Management Strategy

All application state lives in a single Zustand store with heavy use of memoized selectors. This eliminates prop drilling and reduces re-renders by isolating component subscriptions to specific slices.

**Key pattern:**

```typescript
// Selector only re-computes when specific slice changes
const sortedNotes = useStore(
  useCallback(
    (state) => state.notes.order.map((id) => state.notes.byId[id]),
    [],
  ),
);
```

Store structure is normalized (`byId` maps) with separate `order` arrays for O(1) lookups and efficient reordering.

### Monorepo with Shared Schemas

The `@zeronotes/shared` package contains Zod schemas used by both frontend and backend. This ensures:

- **Type safety:** TypeScript types inferred from schemas flow through entire stack
- **Runtime validation:** Server validates requests, client validates responses
- **Single source of truth:** Data structures defined once, used everywhere
- **Refactoring safety:** Schema changes break the build if frontend/backend diverge

**Example:**

```typescript
// packages/shared/schemas/notes.schema.ts
export const createNoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(500).optional(),
  // ...
});

export type CreateNoteBody = z.infer<typeof createNoteSchema>;
```

Both frontend and backend import `CreateNoteBody` type, ensuring consistency.

### PostgreSQL Query Optimization

The notes query uses `json_agg` to fetch all related labels in a single query rather than N+1 queries:

```sql
SELECT
  n.*,
  COALESCE(json_agg(l.id) FILTER (WHERE l.id IS NOT NULL), '[]'::json) as label_ids
FROM notes n
LEFT JOIN note_labels nl ON n.id = nl.note_id
LEFT JOIN labels l ON nl.label_id = l.id
WHERE n.user_id = $1
GROUP BY n.id
```

This reduces database round-trips from O(N) to O(1) when loading notes with labels.

---

## Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL (running locally or connection string)
- pnpm (recommended) or npm

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/amadeuio/zeronotes.git
   cd zeronotes
   pnpm install
   ```

2. **Set up database**

   ```bash
   # Create PostgreSQL database
   createdb zeronotes

   # Run migrations
   cd apps/backend
   pnpm migrate
   ```

3. **Configure environment variables**

   Create `apps/backend/.env`:

   ```bash
   DATABASE_URL=postgresql://user:password@localhost:5432/zeronotes
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

4. **Start development servers**

   ```bash
   # From project root (runs both frontend and backend)
   pnpm dev

   # Or separately:
   cd apps/frontend && pnpm dev  # http://localhost:5173
   cd apps/backend && pnpm dev   # http://localhost:3000
   ```

### Testing

```bash
# Run all tests
pnpm test

# Backend integration tests
pnpm test:b

# Frontend unit tests
pnpm test:f

# Watch mode
cd apps/backend && pnpm test:watch
```

---

## Project Structure

```
zeronotes/
├── apps/
│   ├── frontend/              # React application
│   │   ├── src/
│   │   │   ├── components/    # UI components (auth, notes, layout)
│   │   │   ├── store/         # Zustand store + memoized selectors
│   │   │   ├── crypto/        # Encryption utilities (AES-GCM, PBKDF2, key wrapping)
│   │   │   ├── hooks/         # Custom React hooks (useDrag, useNotes, useAuth)
│   │   │   ├── api/           # HTTP client functions
│   │   │   ├── routes/        # TanStack Router routes
│   │   │   └── utils/         # Helper functions
│   │   └── tests/
│   │
│   └── backend/               # Node.js API
│       ├── src/
│       │   ├── domain/        # Business logic by domain
│       │   │   ├── auth/      # Authentication (service, repository, mappers, routes)
│       │   │   ├── notes/     # Notes domain
│       │   │   ├── labels/    # Labels domain
│       │   │   └── bootstrap/ # Initial data loading
│       │   ├── middleware/    # Express middleware (auth, validation, rate limiting)
│       │   ├── utils/         # JWT, crypto, error handling
│       │   └── db/            # Database client + migrations
│       └── tests/
│
└── packages/
    └── shared/                # Shared types and schemas
        ├── schemas/           # Zod validation schemas
        └── constants/         # Encryption constants (iterations, versions)
```

---

## Reflections

### What Went Well

- The custom drag-and-drop system performs smoothly even with 100+ notes due to CSS transform optimizations
- Domain-driven backend structure made adding features easier over time (labels, pinning, archiving)
- Monorepo setup with shared schemas prevented many type mismatches and runtime errors
- Zero-knowledge encryption architecture forced clear thinking about data flow and security boundaries

### What I'd Do Differently

- **Offline support:** Would add service worker + IndexedDB for offline mode with sync on reconnect
- **Migration tooling:** Would invest more upfront in database migration versioning (currently manual SQL file)
- **Batch operations:** Reordering notes sends one request per drag. Would batch updates or use WebSocket for real-time sync

### Potential Next Steps

- Real-time collaboration using WebSockets + CRDT for conflict resolution
- Mobile app using React Native with shared business logic from monorepo
- End-to-end encrypted file attachments with chunked uploads
- Export/import functionality with encrypted backup files
- Rich text editing with Markdown support

---

**Built by [Amadeu Serras](https://github.com/amadeuio)**

Questions or feedback? Open an issue or reach out via [email](mailto:amadeuserras@gmail.com).
