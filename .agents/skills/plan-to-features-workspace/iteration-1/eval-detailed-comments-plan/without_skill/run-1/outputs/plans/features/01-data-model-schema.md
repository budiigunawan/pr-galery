# Feature 01 — Data Model & Migration

## Summary

Introduce the `Comment` table and its relations so every other comment
feature has something to build on. This is a pure schema/infrastructure
feature with no user-facing behavior.

## Requirements

- A `Comment` model exists in `prisma/schema.prisma` supporting:
  - Association to a `Post` (`postId`) and a `User` author (`authorId`).
  - Optional self-relation `parentId` for one level of replies.
  - Plain-text `body` field, application-enforced max length 2000 chars.
  - `isDeleted` boolean flag for soft deletes (Feature 05).
  - `createdAt` / `updatedAt` timestamps.
- Deleting a `Post` cascades to delete its comments. Deleting a parent
  `Comment` cascades to delete its replies.
- Indexes support the two main read patterns: "comments for a post, newest
  first, top-level only" and "comments by a given author" (used by rate
  limiting in Feature 07).
- Migration is generated and committed via Prisma's migration workflow, not
  `db push`.

## Technical Implementation

1. Add to `prisma/schema.prisma`:

   ```prisma
   model Comment {
     id        String    @id @default(uuid())
     postId    String
     authorId  String
     parentId  String?
     body      String
     isDeleted Boolean   @default(false)
     createdAt DateTime  @default(now())
     updatedAt DateTime  @updatedAt

     post    Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
     author  User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
     parent  Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
     replies Comment[] @relation("CommentReplies")

     @@index([postId, parentId, createdAt])
     @@index([authorId, createdAt])
   }
   ```

2. Add the inverse relations on `Post` (`comments Comment[]`) and `User`
   (`comments Comment[]`) models.
3. Run `npx prisma migrate dev --name add_comments` to generate and apply the
   migration locally; commit the generated SQL under `prisma/migrations/`.
4. Run `npx prisma generate` to refresh the Prisma Client types (this is a
   normal side effect of `migrate dev`, called out in case client generation
   is scripted separately in CI).
5. Do **not** use `prisma db push` at any point, per project convention.
6. Add a small seed or fixture helper (optional) for local testing of nested
   comments.

## Edge Cases / Notes

- `body` has no DB-level `CHECK` length constraint by default in this plan
  (kept in application validation, see Feature 02) to avoid coupling schema
  to a business rule that may change; note this as a deliberate choice.
- If the `User` or `Post` models live in a different schema/file convention
  than assumed, adapt relation names accordingly — the shape (postId,
  authorId, parentId, body, isDeleted) is what matters.

## Acceptance Criteria

- [ ] `Comment` model added to `schema.prisma` with fields/relations above.
- [ ] Migration generated via `prisma migrate dev` and committed to the repo.
- [ ] `prisma generate` runs cleanly; Prisma Client exposes `prisma.comment`.
- [ ] Deleting a test `Post` cascades and removes its comments (verified
      manually or via a script/test).
- [ ] Deleting a top-level `Comment` cascades and removes its replies.
- [ ] No `db push` was used anywhere in the process.
