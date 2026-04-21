# Zeronotes

A full-stack notes app inspired by Google Keep rebuilt from scratch with a focus on security, performance, and engineering rigour.

> **What makes this different:** the drag-and-drop is custom-built with no libraries, and the encryption is a direct Web Crypto API implementation, not a wrapper around someone else's abstraction.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

---

## What it does

Zeronotes is a drag-and-drop notes app where your data is encrypted before it ever leaves your device. The server stores ciphertext: it has no access to your notes.

- Create, edit, pin, and organise notes in a masonry grid
- Drag and drop to reorder (smooth, physics-feel, no jank)
- Notes are end-to-end encrypted: only you can read them
- Full authentication flow with JWT-based auth

---

## Technical highlights

### Custom drag-and-drop engine

Most projects reach for `react-beautiful-dnd` or `dnd-kit`. I didn't.

The engine is built on pointer events, CSS transforms, and a position-tracking algorithm that handles reflow in a masonry grid. It matches Google Keep's behaviour (items shift smoothly as you drag, snapping into place on release) without a single drag-and-drop dependency.

This was the original challenge that started the project: _can I reproduce this interaction from first principles?_

```
Pointer events → position delta → CSS transform (no layout reflow)
                                      ↓
                               Reorder algorithm → grid reflow on drop
```

### End-to-end encryption

Encryption is implemented directly using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) — no third-party crypto library.

- **Key derivation:** PBKDF2 with a random salt, derived from the user's password
- **Encryption:** AES-GCM with a unique IV per note
- **What the server sees:** ciphertext + encryption metadata (e.g. salt, wrapped key, IVs/version) — never the plaintext, never the key

The key is derived client-side on login and never transmitted. Server compromise does not expose note content.

```
password + salt → PBKDF2 → CryptoKey
                                ↓
plaintext + IV → AES-GCM encrypt → ciphertext  →  stored in DB
```

### Architecture

Monorepo structured around Domain-Driven Design principles:

```
zeronotes/
├── apps/
│   ├── frontend/          # React + TypeScript frontend
│   └── backend/          # Node.js + Express + TypeScript backend
├── packages/
│   └── shared/       # Shared types, validation schemas
└── turbo.json        # Turborepo pipeline
```

- **Frontend:** React, TypeScript, Zustand for state, Tailwind CSS for styling
- **Backend:** Node.js, Express, TypeScript, structured SQL queries (no ORM)
- **Auth:** JWT via the Jose library with rate limiting
- **Monorepo:** pnpm workspaces + Turborepo
- **Testing:** Integration and unit tests covering edge cases — not just happy paths

---

## Stack

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | React, TypeScript, Zustand, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript             |
| Database | PostgreSQL (raw SQL)                     |
| Auth     | JWT (Jose)                               |
| Crypto   | Web Crypto API — AES-GCM, PBKDF2         |
| Monorepo | pnpm workspaces, Turborepo               |
| Testing  | Jest (Backend), Vitest (Frontend)        |

---

## Running locally

```bash
# Clone and install
git clone https://github.com/amadeuserras/zeronotes
cd zeronotes
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/backend/.env.test.example apps/backend/.env.test
cp apps/frontend/.env.example apps/frontend/.env

# Run database migrations
pnpm --filter @zeronotes/backend migrate

# Start both apps in dev mode
pnpm dev
```

Requires Node.js 18+, pnpm, and a PostgreSQL instance.

---

## Why I built this

I wanted to understand what it actually takes to implement end-to-end encryption correctly; not call a library, but understand the primitives. And I wanted to know if I could reproduce Google Keep's drag-and-drop behaviour from scratch.

Both turned out to be more interesting than I expected. The encryption work pushed me to understand key derivation, IVs, and authenticated encryption properly. The drag-and-drop required thinking outside of the box, and the best solution ended up being building a mathematical grid system that tracks note positions in state and renders them via CSS transforms.

The result is an app I'd actually use and a codebase I'm proud to show.
