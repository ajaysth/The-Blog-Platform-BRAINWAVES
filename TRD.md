# Technical Requirements Document (TRD)
## The Blog Platform - BRAINWAVES

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Status:** Active  

---

## Executive Summary

This document defines the technical architecture, technology stack, infrastructure requirements, and implementation guidelines for the BRAINWAVES blog platform. It serves as a blueprint for development teams to build, deploy, and maintain the system.

**Key Focus Areas:**
- Cloud-native architecture on modern cloud platforms
- Performance optimization and scalability
- Security best practices implementation
- DevOps and CI/CD pipeline setup
- Database design and optimization

---

## 1. Technology Stack

### 1.1 Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 14.x LTS | React meta-framework with SSR/SSG |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| UI Library | React | 19.x | Component-based UI library |
| Styling | Tailwind CSS | 3.x | Utility-first CSS framework |
| Component Library | shadcn/ui | Latest | Pre-built accessible components |
| Animation | Framer Motion | 10.x | Smooth animations and transitions |
| Form Handling | React Hook Form | 7.x | Efficient form state management |
| Form Validation | Zod | 3.x | Schema-based validation |
| Rich Text Editor | Slate/Tiptap | 2.x | WYSIWYG editor for post content |
| Icons | Lucide React | Latest | Beautiful icon library |
| Toast Notifications | React Hot Toast | 2.x | Non-intrusive notifications |
| HTTP Client | Fetch API | Native | Built-in HTTP requests |
| State Management | React Context | Native | Global state (auth, theme) |
| Local Storage | localStorage | Native | Client-side data persistence |

### 1.2 Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18.x LTS+ | JavaScript runtime |
| Framework | Next.js | 14.x LTS | API routes and middleware |
| Language | TypeScript | 5.x | Type-safe server code |
| ORM | Prisma | 5.x | Database abstraction layer |
| Database | PostgreSQL | 14+ | Relational database |
| Authentication | NextAuth.js | 5.x | Session-based auth |
| Cache Layer | Redis | 6.x+ | In-memory caching (Upstash) |
| File Upload | Uploadcare | SDK | Cloud file hosting and CDN |
| Validation | Zod | 3.x | Server-side validation |
| Logging | Node.js Console/Winston | - | Application logging |
| HTTP Client | Node Fetch | - | Server-to-server requests |

### 1.3 DevOps & Deployment

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Version Control | Git | Latest | Source code management |
| Repository | GitHub | - | Remote repository hosting |
| Container | Docker | 24.x | Application containerization |
| Container Registry | GitHub Container Registry | - | Docker image hosting |
| CI/CD | GitHub Actions | - | Automated build and deploy |
| Deployment | Vercel / Azure App Service | - | Hosting and auto-scaling |
| Environment Management | .env / .env.local | - | Configuration management |
| Package Manager | pnpm | 8.x | Fast npm alternative |
| Build Tool | Next.js Build | Native | Optimized production builds |

### 1.4 Development Tools

| Tool | Purpose | Version |
|------|---------|---------|
| IDE | VS Code / Windsurf | Latest | Code editor |
| Linter | ESLint | 8.x | Code quality checking |
| Formatter | Prettier | 3.x | Code formatting |
| Git Hooks | Husky | 8.x | Pre-commit hooks |
| Commit Linter | Commitlint | Latest | Conventional commits |
| Testing | Jest/Vitest | Latest | Unit testing framework |
| E2E Testing | Playwright/Cypress | Latest | End-to-end testing |
| API Testing | Postman/Insomnia | Latest | API documentation and testing |

### 1.5 Third-Party Services

| Service | Purpose | Tier | Notes |
|---------|---------|------|-------|
| Uploadcare | Image hosting & CDN | Pro | CNAME domain mapping |
| Upstash Redis | Caching layer | Free/Paid | REST API access |
| NextAuth.js | Authentication | Open Source | OAuth provider ready |
| PostgreSQL | Database | Cloud Managed | AWS RDS / Azure Database |
| GitHub | Version Control | Free/Pro | Private repos |
| Vercel | Hosting/Deployment | Free/Pro | Native Next.js support |

---

## 2. Architecture Overview

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Browser (Chrome, Firefox, Safari, Edge)                    │ │
│  │  • Next.js Frontend (React Components)                      │ │
│  │  • Tailwind CSS + shadcn/ui                                 │ │
│  │  • React Context for State Management                       │ │
│  │  • React Hook Form for Forms                                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↑ ↓
                         HTTPS/TLS
                              ↑ ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Edge Layer                               │
│  • Vercel/Azure Edge Functions (optional)                        │
│  • CDN Cache Layer                                               │
│  • Request Routing                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↑ ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Server Layer                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Next.js Server                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ API Routes (/app/api/*)                              │   │ │
│  │  │  • Users API                                         │   │ │
│  │  │  • Posts API                                         │   │ │
│  │  │  • Categories API                                    │   │ │
│  │  │  • Tags API                                          │   │ │
│  │  │  • Media Upload API                                  │   │ │
│  │  │  • Auth Endpoints (NextAuth)                         │   │ │
│  │  │  • Notifications API                                 │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Middleware & Utils                                   │   │ │
│  │  │  • Authentication middleware                         │   │ │
│  │  │  • Error handling                                    │   │ │
│  │  │  • Request logging                                   │   │ │
│  │  │  • Rate limiting                                     │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓              ↓              ↓              ↓
    ┌────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐
    │Database│   │  Cache   │   │Uploadcare│   │  NextAuth  │
    │ (PgSQL)│   │  (Redis) │   │  (CDN)   │   │  (OAuth)   │
    └────────┘   └──────────┘   └──────────┘   └────────────┘
```

### 2.2 Layered Architecture

#### Presentation Layer
- **Components:** React components using Tailwind CSS and shadcn/ui
- **Pages:** Next.js pages (both public and protected routes)
- **State Management:** React Context for global state (auth, theme)
- **Responsiveness:** Mobile-first responsive design

#### API Layer
- **REST Endpoints:** Next.js API routes
- **Authentication:** NextAuth.js sessions
- **Validation:** Zod schema validation
- **Error Handling:** Consistent error responses
- **Rate Limiting:** Per-endpoint request limits

#### Business Logic Layer
- **Services:** Data processing and business rules
- **Utilities:** Helper functions
- **Middleware:** Request/response processing
- **Caching:** Redis-based caching strategy

#### Data Access Layer
- **ORM:** Prisma for database access
- **Queries:** Type-safe database queries
- **Transactions:** Multi-step operations
- **Indexing:** Optimized query performance

#### External Services Layer
- **Uploadcare:** Image hosting and CDN
- **Email Service:** For notifications (future)
- **Authentication Providers:** OAuth (future)

---

## 3. Database Design

### 3.1 Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  avatar_url VARCHAR(1024),
  bio TEXT,
  role VARCHAR(50) DEFAULT 'reader', -- 'admin', 'author', 'reader'
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url VARCHAR(1024),
  author_id UUID NOT NULL REFERENCES users(id),
  category_id UUID REFERENCES categories(id),
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(1024),
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
```

#### Tags Table
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

#### Posts_Tags Junction Table
```sql
CREATE TABLE posts_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_posts_tags_post_id ON posts_tags(post_id);
CREATE INDEX idx_posts_tags_tag_id ON posts_tags(tag_id);
```

#### Media Table
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  uploadcare_uuid VARCHAR(36) NOT NULL UNIQUE,
  uploadcare_url VARCHAR(1024) NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_uploadcare_uuid ON media(uploadcare_uuid);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
```

#### Sessions Table (NextAuth)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 3.2 Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  avatarUrl     String?
  bio           String?
  role          Role      @default(READER)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  
  posts         Post[]
  media         Media[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id                String      @id @default(cuid())
  title             String
  slug              String      @unique
  content           String      @db.Text
  excerpt           String?
  featuredImageUrl  String?
  
  author            User        @relation(fields: [authorId], references: [id])
  authorId          String
  
  category          Category?   @relation(fields: [categoryId], references: [id])
  categoryId        String?
  
  tags              Tag[]       @relation("PostToTag")
  
  status            PostStatus  @default(DRAFT)
  publishedAt       DateTime?
  scheduledFor      DateTime?
  viewCount         Int         @default(0)
  
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

model Category {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  imageUrl      String?
  
  parent        Category? @relation("CategoryToParent", fields: [parentId], references: [id])
  parentId      String?
  children      Category[] @relation("CategoryToParent")
  
  posts         Post[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  description   String?
  
  posts         Post[]    @relation("PostToTag")
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Media {
  id                String    @id @default(cuid())
  filename          String
  uploadcareUuid    String    @unique
  uploadcareUrl     String
  fileSize          BigInt?
  mimeType          String?
  
  uploadedBy        User      @relation(fields: [uploadedById], references: [id])
  uploadedById      String
  
  createdAt         DateTime  @default(now())
}

enum Role {
  ADMIN
  AUTHOR
  READER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### 3.3 Database Indexing Strategy

| Index | Table | Columns | Purpose | Type |
|-------|-------|---------|---------|------|
| PK | All | id | Primary key | Clustered |
| idx_email | users | email | Fast user lookup | Unique |
| idx_posts_slug | posts | slug | URL-based queries | Unique |
| idx_posts_status | posts | status | Filter published posts | Regular |
| idx_posts_published_at | posts | published_at | Timeline queries | Regular |
| idx_categories_slug | categories | slug | URL-based queries | Unique |
| idx_tags_slug | tags | slug | URL-based queries | Unique |
| idx_posts_tags_composite | posts_tags | (post_id, tag_id) | Tag filtering | Composite |
| idx_media_uploadcare_uuid | media | uploadcare_uuid | Deduplication | Unique |

---

## 4. API Specification

### 4.1 API Conventions

- **Base URL:** `https://api.brainwaves.com/api` or `https://brainwaves.com/api`
- **Protocol:** HTTPS only
- **Content-Type:** `application/json`
- **Authentication:** Bearer tokens (NextAuth sessions)
- **Versioning:** Not required for v1; use `/api/v1/` prefix if needed
- **Rate Limiting:** 100 requests/minute per IP, 1000/hour per user

### 4.2 Authentication Endpoints

#### POST /api/auth/signin
Login with email and password
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "author"
  }
}
```

#### POST /api/auth/signup
Register new user
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response (201):
{
  "success": true,
  "user": { ... }
}
```

#### POST /api/auth/logout
Logout current user
```json
Response (200):
{
  "success": true
}
```

#### GET /api/auth/session
Get current session
```json
Response (200):
{
  "user": { ... },
  "expires": "2025-12-21T10:30:00Z"
}
```

### 4.3 Posts Endpoints

#### GET /api/posts
Fetch posts (paginated, filterable)
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10, max: 50)
- status: 'draft' | 'published' | 'archived'
- categoryId: UUID
- authorId: UUID
- search: string
- sort: 'createdAt' | 'publishedAt' | 'viewCount'
- direction: 'asc' | 'desc'

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Short excerpt",
      "featuredImageUrl": "https://...",
      "author": { ... },
      "category": { ... },
      "status": "published",
      "publishedAt": "2025-11-21T10:00:00Z",
      "viewCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 250,
    "pages": 25
  }
}
```

#### GET /api/posts/:slug
Fetch single post by slug
```json
Response (200):
{
  "id": "uuid",
  "title": "Post Title",
  "slug": "post-title",
  "content": "Full markdown content",
  "excerpt": "Short excerpt",
  "featuredImageUrl": "https://...",
  "author": { ... },
  "category": { ... },
  "tags": [ ... ],
  "status": "published",
  "publishedAt": "2025-11-21T10:00:00Z",
  "viewCount": 150,
  "relatedPosts": [ ... ]
}
```

#### POST /api/posts
Create new post (requires auth)
```json
Request:
{
  "title": "New Post",
  "slug": "new-post",
  "content": "Markdown content",
  "excerpt": "Short excerpt",
  "featuredImageUrl": "https://...",
  "categoryId": "uuid",
  "tagIds": ["uuid1", "uuid2"],
  "status": "draft"
}

Response (201):
{
  "id": "uuid",
  "title": "New Post",
  ...
}
```

#### PUT /api/posts/:id
Update post (requires auth + ownership)
```json
Request:
{
  "title": "Updated Title",
  "content": "Updated content",
  ...
}

Response (200):
{
  "id": "uuid",
  ...
}
```

#### DELETE /api/posts/:id
Delete post (requires auth + ownership or admin)
```json
Response (200):
{
  "success": true,
  "message": "Post deleted"
}
```

### 4.4 Categories Endpoints

#### GET /api/categories
Fetch all categories
```json
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech articles",
      "imageUrl": "https://...",
      "postCount": 25
    }
  ]
}
```

#### POST /api/categories
Create category (requires admin)
```json
Request:
{
  "name": "Technology",
  "slug": "technology",
  "description": "Tech articles",
  "imageUrl": "https://..."
}

Response (201):
{
  "id": "uuid",
  ...
}
```

#### PUT /api/categories/:id
Update category (requires admin)
```json
Response (200):
{
  "id": "uuid",
  ...
}
```

#### DELETE /api/categories/:id
Delete category (requires admin)
```json
Response (200):
{
  "success": true
}
```

### 4.5 Tags Endpoints

#### GET /api/tags
Fetch all tags
```json
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "JavaScript",
      "slug": "javascript",
      "postCount": 15
    }
  ]
}
```

#### POST /api/tags
Create tag (requires admin)

#### PUT /api/tags/:id
Update tag (requires admin)

#### DELETE /api/tags/:id
Delete tag (requires admin)

### 4.6 Media Endpoints

#### GET /api/media
Fetch user's uploaded media
```json
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "filename": "image.jpg",
      "uploadcareUuid": "uuid",
      "uploadcareUrl": "https://...",
      "fileSize": 123456,
      "mimeType": "image/jpeg",
      "createdAt": "2025-11-21T10:00:00Z"
    }
  ]
}
```

#### POST /api/media
Upload image (requires auth)
```
Content-Type: multipart/form-data
File field: file

Response (201):
{
  "id": "uuid",
  "uploadcareUrl": "https://ucarecdn.com/uuid/",
  ...
}
```

#### DELETE /api/media/:id
Delete uploaded media (requires auth + ownership or admin)
```json
Response (200):
{
  "success": true
}
```

### 4.7 Users Endpoints

#### GET /api/users (admin only)
Fetch all users

#### GET /api/users/:id
Fetch user profile

#### PUT /api/users/:id
Update own profile or admin update

#### DELETE /api/users/:id (admin only)
Delete user

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
1. User enters credentials
2. Frontend POSTs to /api/auth/signin
3. Backend validates against database
4. NextAuth creates session (HTTP-only cookie)
5. Session stored in database
6. Subsequent requests include session cookie
7. Middleware verifies session
8. Request proceeds with auth context
```

### 5.2 Authorization & RBAC

| Role | Posts | Categories | Tags | Users | Media |
|------|-------|-----------|------|-------|-------|
| **Admin** | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Delete any |
| **Author** | Own CRUD | View | View/Create | View own | Full own |
| **Reader** | View | View | View | View own | Upload own |

### 5.3 Middleware Protection

```typescript
// Middleware chain
1. Authentication: Verify session exists
2. Authorization: Check role/permissions
3. Ownership: Verify resource ownership (if applicable)
4. Rate limiting: Check request limits
5. Logging: Log access for audit trail
```

---

## 6. Caching Strategy

### 6.1 Redis Caching Layers

| Data | TTL | Key Pattern | Invalidation |
|------|-----|-------------|--------------|
| User Profile | 3600s | `user:{userId}` | On update |
| Post | 1800s | `post:{postId}` | On update/publish |
| Category List | 3600s | `categories:all` | On category change |
| Tag List | 3600s | `tags:all` | On tag change |
| Post List | 300s | `posts:page:{page}:filter:{filter}` | Manual invalidate |
| Notification Count | 60s | `notifications:unread:{userId}` | On new notification |

### 6.2 Cache Invalidation Strategy

```typescript
// Invalidation triggers
POST /api/posts/:id -> invalidate post cache + post list
PUT /posts/:id -> invalidate post cache + post list
DELETE /posts/:id -> invalidate post + post list
POST /api/categories -> invalidate categories cache
```

### 6.3 Cache-Busting Techniques

- **Query Parameters:** `?cache=timestamp`
- **HTTP Headers:** `Cache-Control: max-age=0`
- **ETag:** Entity validation
- **Last-Modified:** Timestamp comparison

---

## 7. Security Architecture

### 7.1 Security Layers

#### Network Security
- HTTPS/TLS 1.3 for all connections
- HSTS headers enabled
- DDoS protection (Cloudflare/Azure DDoS)
- WAF rules (optional)

#### Application Security
- CSRF protection via NextAuth
- XSS prevention via React sanitization
- SQL injection prevention via Prisma ORM
- Rate limiting per endpoint
- Input validation (Zod schemas)
- Output encoding/sanitization

#### Data Security
- Password hashing with bcrypt (salt rounds: 12)
- Sensitive data encrypted at rest (optional)
- Environment variables for secrets
- No plaintext secrets in code

#### Authentication Security
- HTTP-only cookies for sessions
- Secure flag on cookies
- SameSite=Strict on cookies
- Session timeout: 24 hours
- Refresh token rotation

### 7.2 Security Checklist

- [ ] HTTPS enabled
- [ ] HSTS headers configured
- [ ] CSP headers set
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Regular dependency updates
- [ ] Environment variables secure
- [ ] Secrets rotation policy
- [ ] Rate limiting enabled
- [ ] Input validation comprehensive
- [ ] Output encoding implemented
- [ ] Error messages don't leak info
- [ ] Logging doesn't contain secrets
- [ ] Database backups encrypted
- [ ] Access control enforced

---

## 8. Performance Optimization

### 8.1 Frontend Performance

| Technique | Implementation | Target |
|-----------|----------------|--------|
| Code Splitting | Next.js dynamic imports | < 50KB per route |
| Image Optimization | Next.js Image component | < 1s load |
| CSS-in-JS | Tailwind (zero-runtime) | < 50KB CSS |
| Lazy Loading | React.lazy + Suspense | Above the fold first |
| Memoization | React.memo for expensive components | Prevent re-renders |
| State Splitting | Context by feature | Targeted updates |
| Bundle Analysis | webpack-bundle-analyzer | < 200KB gzipped |

### 8.2 Backend Performance

| Technique | Implementation | Target |
|-----------|----------------|--------|
| Query Optimization | Indexes + joins planning | < 100ms |
| Connection Pooling | Prisma connection pool | Max 10 connections |
| Pagination | Cursor/offset pagination | < 50 results default |
| Caching | Redis for hot data | 70% cache hit rate |
| Compression | gzip/brotli responses | < 50KB per response |
| CDN | Uploadcare for images | < 1s global delivery |
| Timeouts | API request timeouts | 30s timeout |

### 8.3 Database Performance

```sql
-- Query optimization examples
-- 1. Index frequently used filters
ANALYZE posts; -- Update statistics

-- 2. Use EXPLAIN ANALYZE for queries
EXPLAIN ANALYZE SELECT * FROM posts WHERE status='published';

-- 3. Partition large tables (if needed)
CREATE TABLE posts_2025 PARTITION OF posts
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- 4. Regular VACUUM
VACUUM ANALYZE;
```

### 8.4 API Response Times (Targets)

| Endpoint | Current | Target | Priority |
|----------|---------|--------|----------|
| GET /posts | 150ms | < 100ms | HIGH |
| GET /posts/:slug | 100ms | < 50ms | HIGH |
| GET /categories | 80ms | < 50ms | HIGH |
| POST /posts | 300ms | < 200ms | MEDIUM |
| POST /media (upload) | 2000ms | < 1500ms | MEDIUM |

---

## 9. Deployment Architecture

### 9.1 Deployment Pipeline

```
Code Commit
    ↓
GitHub Actions Trigger
    ↓
Run Tests
    ↓
Build Next.js App
    ↓
Build Docker Image
    ↓
Push to Registry
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
    ↓
Health Checks
    ↓
Monitor & Alert
```

### 9.2 Environment Configuration

#### Development (.env.local)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/brainwaves_dev

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_public_key
UPLOADCARE_SECRET_KEY=your_secret_key

# NextAuth
NEXTAUTH_SECRET=dev_secret_key
NEXTAUTH_URL=http://localhost:3000

# Redis
UPSTASH_REDIS_REST_URL=http://localhost:8079
UPSTASH_REDIS_REST_TOKEN=local_token

# Features
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Production (.env)
```env
# Database
DATABASE_URL=postgresql://prod_user:prod_pass@db.example.com:5432/brainwaves

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=prod_public_key
UPLOADCARE_SECRET_KEY=prod_secret_key_from_vault

# NextAuth
NEXTAUTH_SECRET=prod_secret_from_vault
NEXTAUTH_URL=https://brainwaves.com

# Redis
UPSTASH_REDIS_REST_URL=https://api.upstash.io/...
UPSTASH_REDIS_REST_TOKEN=prod_token_from_vault

# Features
NEXT_PUBLIC_DEBUG_MODE=false
```

### 9.3 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --prod

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

### 9.4 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy BRAINWAVES

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 10. Monitoring & Observability

### 10.1 Metrics to Monitor

| Metric | Target | Tool | Alert |
|--------|--------|------|-------|
| API Response Time | < 500ms p95 | Vercel Analytics | > 1s |
| Error Rate | < 0.1% | Sentry | > 0.5% |
| Database Connections | < 20 | CloudWatch | > 25 |
| Cache Hit Rate | > 70% | Redis stats | < 50% |
| CPU Usage | < 70% | Container metrics | > 80% |
| Memory Usage | < 80% | Container metrics | > 90% |
| Disk Space | < 80% | Storage metrics | > 85% |
| Uptime | > 99.5% | Uptime monitoring | < 99% |

### 10.2 Logging Strategy

```typescript
// Log Levels
DEBUG: Development debugging
INFO: General information (requests, events)
WARN: Warning conditions
ERROR: Error conditions
FATAL: Critical failures

// Log Format
{
  "timestamp": "2025-11-21T10:30:00Z",
  "level": "ERROR",
  "service": "api",
  "endpoint": "POST /api/posts",
  "userId": "uuid",
  "message": "Database connection failed",
  "error": "Connection timeout",
  "duration": "5000ms"
}
```

### 10.3 Error Tracking

- **Tool:** Sentry
- **Configuration:** Source maps, breadcrumbs, session replay
- **Alerts:** Critical errors to Slack/email
- **Retention:** 90 days

---

## 11. Testing Strategy

### 11.1 Test Pyramid

```
        /\
       /E2E\         Integration tests
      /Unit \        API + DB integration
     /______\
    Component       UI component tests
    
Target Coverage: 80%+ overall
- Critical paths: 100%
- Business logic: 90%
- UI components: 70%
```

### 11.2 Test Types

| Type | Framework | Coverage | Priority |
|------|-----------|----------|----------|
| Unit | Jest/Vitest | 80%+ | HIGH |
| Integration | Jest + db | 70%+ | HIGH |
| E2E | Playwright | 50%+ | MEDIUM |
| Performance | k6 | Critical paths | MEDIUM |
| Security | OWASP ZAP | All inputs | MEDIUM |

### 11.3 Test Examples

```typescript
// Unit Test
describe('extractFileIdFromUrl', () => {
  it('should extract UUID from Uploadcare URL', () => {
    const url = 'https://ucarecdn.com/454fc515-81ca-4790-8a94-d1663fc899cf/';
    expect(extractFileIdFromUrl(url)).toBe('454fc515-81ca-4790-8a94-d1663fc899cf');
  });
});

// Integration Test
describe('POST /api/posts', () => {
  it('should create a post and return it', async () => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' })
    });
    expect(response.status).toBe(201);
  });
});
```

---

## 12. Disaster Recovery & Business Continuity

### 12.1 Backup Strategy

| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily | 30 days | AWS S3 |
| Files (Uploadcare) | Managed by Uploadcare | Indefinite | CDN |
| Code | Git history | Indefinite | GitHub |
| Configs | On change | 7 days | Vault |

### 12.2 Recovery Procedures

#### Database Recovery
1. Identify last known good backup
2. Restore to test environment
3. Verify data integrity
4. Restore to production (blue-green)
5. Verify application health
6. Monitor for issues

#### Application Recovery
1. Check health endpoint
2. Review error logs
3. Trigger rollback if needed
4. Deploy hotfix
5. Monitor recovery metrics

### 12.3 Recovery Time Objectives (RTO/RPO)

| Scenario | RTO | RPO | Action |
|----------|-----|-----|--------|
| Database down | 30 min | 1 day | Restore from backup |
| App crash | 5 min | 0 min | Auto-restart/redeploy |
| Data corruption | 2 hours | 24 hours | Restore from backup |
| Security breach | 1 hour | 0 min | Incident response plan |

---

## 13. Scalability Roadmap

### Current State (Phase 1)
- Single app instance
- Shared database (managed)
- Redis cluster (managed)
- CDN via Uploadcare

### Phase 2 (1000+ concurrent users)
- Horizontal scaling: Multiple app instances
- Load balancing: AWS ALB or Azure LB
- Database: Read replicas
- Redis: Cluster mode

### Phase 3 (10000+ concurrent users)
- Microservices: Separate services for posts, media, etc.
- Message queue: Bull/RabbitMQ for async tasks
- Search service: Elasticsearch for advanced search
- Analytics: Data warehouse for insights

### Phase 4 (100000+ concurrent users)
- Global deployment: Multi-region
- Event sourcing: For audit trail
- CQRS: Command Query Responsibility Segregation
- Real-time updates: WebSockets/SSE

---

## 14. Technology Decision Rationale

| Technology | Rationale | Alternatives Considered |
|-----------|-----------|------------------------|
| Next.js | Full-stack framework, SSR, file-based routing, built-in optimization | Remix, Nuxt, SvelteKit |
| TypeScript | Type safety, better DX, catches errors early | JavaScript, Flow |
| Tailwind CSS | Utility-first, fast styling, small bundle | Bootstrap, Material UI |
| Prisma | Type-safe ORM, automatic migrations, excellent DX | TypeORM, Sequelize, Drizzle |
| NextAuth | Comprehensive auth solution, NextJS integration | Auth0, Firebase Auth |
| PostgreSQL | Powerful RDBMS, JSONB support, PostGIS | MySQL, MongoDB, DynamoDB |
| Uploadcare | Easy CDN, automatic transformations, CNAME support | Cloudinary, AWS S3, Imgix |
| Redis | Fast caching, pub/sub, simple API | Memcached, DynamoDB, Elasticache |

---

## 15. Technical Debt & Improvement Opportunities

### Current Backlog

1. **Implement E2E Testing** - Add Playwright tests
2. **Add API Documentation** - Swagger/OpenAPI spec
3. **Setup Performance Monitoring** - Datadog/New Relic
4. **Implement API Versioning** - Prepare for v2
5. **Add Request Logging** - Structured logging
6. **Setup CDN Caching** - Cloudflare/Akamai
7. **Implement Search** - Elasticsearch integration
8. **Add Webhooks** - Third-party integrations
9. **Setup A/B Testing** - Feature flags
10. **Implement Analytics** - PostHog/Segment

---

## 16. Compliance & Standards

### 16.1 Standards Compliance

- **HTTP/1.1 & HTTP/2** - RFC 7231, RFC 7540
- **JSON API** - Custom JSON structure
- **REST Architecture** - Richardson Maturity Model Level 2
- **Unicode** - UTF-8 encoding
- **Date Format** - ISO 8601 (2025-11-21T10:30:00Z)

### 16.2 Accessibility

- **WCAG 2.1** - Level AA compliance
- **Semantic HTML** - Proper heading hierarchy
- **Color Contrast** - WCAG AA ratios
- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - ARIA labels where needed

### 16.3 Data Protection

- **GDPR** - Right to be forgotten, data portability
- **CCPA** - California Consumer Privacy Act
- **Data Retention** - 90-day log retention max

---

## 17. Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tech Lead | [Name] | _____ | _____ |
| DevOps Lead | [Name] | _____ | _____ |
| Security Officer | [Name] | _____ | _____ |
| Product Manager | [Name] | _____ | _____ |

---

## 18. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 21, 2025 | AI Agent | Initial TRD creation |

---

## Appendix A: Technology Versions

```
Node.js: 18.17.0 LTS or later
npm/pnpm: 8.0+
Next.js: 14.0.0+
React: 19.0.0+
TypeScript: 5.2+
PostgreSQL: 14+
Redis: 6.0+
Docker: 24.0+
```

---

## Appendix B: System Requirements

### Development Environment
- CPU: 4+ cores
- RAM: 8GB+ (16GB recommended)
- Storage: 50GB SSD
- OS: macOS, Linux, Windows (WSL2)
- Bandwidth: 10+ Mbps

### Staging Environment
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- Load balancer: Optional
- Database: Managed service

### Production Environment
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB SSD (with auto-scaling)
- Load balancer: Required
- Database: Managed PostgreSQL with backups
- Cache: Redis cluster (high availability)
- CDN: Global CDN (Uploadcare)

---

**End of Technical Requirements Document**
