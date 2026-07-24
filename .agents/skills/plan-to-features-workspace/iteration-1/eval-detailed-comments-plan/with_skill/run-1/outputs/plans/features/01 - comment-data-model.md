# Feature 01: Comment Data Model & Migrations

## Overview

Introduces the Prisma schema for comments: the `Comment` model itself, its
relations to `Post`, `User`, and (for replies) to a parent comment, and the
fields needed to support soft delete. This is the foundational data layer
every other comment feature builds on.

## Requirements

- A comment belongs to exactly one `Post` and exactly one authoring `User`.
- A comment may optionally belong to one parent `Comment` (making it a
  reply). Replies are exactly one level deep: a comment that already has a
  `parentId` must not itself be a valid parent for another comment. This
  constraint is enforced at the application layer (Feature 02), but the
  schema must support the self-relation.
- Comment body is plain text, max 2000 characters. Enforce max length at the
  database column level in addition to application-level validation (e.g.
  `VarChar(2000)` / a check constraint), so the constraint holds regardless
  of write path.
- Comments support a soft-delete state so that deleting a comment does not
  remove the row (needed to preserve reply threads under a deleted parent).
  Model this with a `deletedAt` (nullable `DateTime`) field rather than a
  boolean, so we retain when the deletion happened.
- Store `createdAt` (default now) for newest-first ordering. An `updatedAt`
  is not required by the plan (no editing feature in scope) but is cheap to
  include for future-proofing — optional, not required.
- Index fields needed for the access patterns used elsewhere in this plan:
  - `(postId, parentId, createdAt)` or equivalent to efficiently list
    top-level comments for a post, newest-first, paginated.
  - `(parentId)` to efficiently fetch replies for a given top-level comment.
  - `(authorId, createdAt)` to support the rate-limiting query in Feature 05
    (counting a user's comments in the last 10 minutes).
- The original comment content of a soft-deleted comment does not need to be
  physically erased for v1 (the plan doesn't require redaction), but the read
  path (Feature 03) must never surface it — deleted comments always render as
  `[deleted]` regardless of what's stored. Implementers may choose to null
  out `content` on delete instead of relying solely on the read path if they
  prefer belt-and-suspenders; either approach satisfies this plan as long as
  original text is never returned to clients once deleted.

## Technical Implementation

- Add a `Comment` model to the Prisma schema (path depends on repo layout —
  typically `prisma/schema.prisma`):

  ```prisma
  model Comment {
    id        String    @id @default(uuid())
    content   String    @db.VarChar(2000)
    postId    String
    post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
    authorId  String
    author    User      @relation(fields: [authorId], references: [id])
    parentId  String?
    parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
    replies   Comment[] @relation("CommentReplies")
    deletedAt DateTime?
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt

    @@index([postId, parentId, createdAt])
    @@index([authorId, createdAt])
  }
  ```

  Adjust `User`/`Post` model names and ID types (`String`/UUID vs. existing
  `Int`/cuid convention) to match whatever already exists in the project's
  schema — do not assume UUIDs if the existing `User`/`Post` models use a
  different ID strategy; foreign keys must match the referenced type.
- Add the inverse relations (`comments Comment[]`) to the existing `Post` and
  `User` models.
- Generate and apply a migration (e.g. `npx prisma migrate dev --name
  add_comments`) rather than hand-writing SQL, so the migration history
  matches the schema.
- Regenerate the Prisma client (`npx prisma generate`) as part of the same
  change so downstream features have typed access to `prisma.comment`.

## Dependencies

None — this is the first feature and a prerequisite for all others.

## Acceptance Criteria

- [ ] `Comment` model exists in the Prisma schema with `postId`, `authorId`,
      `parentId` (nullable), `content`, `deletedAt` (nullable), `createdAt`.
- [ ] `content` is constrained to a maximum of 2000 characters at the
      database level.
- [ ] Self-relation (`parent`/`replies`) is correctly modeled and migrates
      cleanly.
- [ ] Deleting a `Post` cascades to delete its comments; deleting a parent
      `Comment` cascades to delete its replies (matches the "replies belong
      to their parent" relationship).
- [ ] Indexes exist to support: paginated newest-first top-level comment
      listing per post, reply lookup per parent comment, and per-author
      comment-count-in-time-window lookup.
- [ ] Migration is generated via Prisma CLI (not hand-written SQL) and
      applies cleanly to a fresh database.
- [ ] `prisma generate` succeeds and `prisma.comment` is available with
      correct types in the generated client.
