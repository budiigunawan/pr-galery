# Blog Comments System — Requirements

## Summary

Add a comments system to the blog (Next.js + Postgres via Prisma). Logged-in
readers can post plain-text comments on a blog post and reply one level deep
to other comments. Comments render newest-first, paginated 20 at a time.
Comment authors can delete their own comments; the author of the blog post
can delete any comment on their own post. Deletions are soft (comment body
replaced with "[deleted]") to preserve reply threads. New top-level and reply
comments notify the post author by email via Resend. Basic spam protection:
per-user rate limiting and a banned-word filter.

## Goals

- Let authenticated readers participate in discussion under a post.
- Keep v1 scope small: plain text only, one level of nesting, simple
  moderation tools.
- Preserve thread structure even after deletions.
- Notify post authors of new engagement without spamming other commenters.
- Provide minimal, effective spam/abuse mitigation without a full moderation
  queue.

## Non-Goals (v1)

- Markdown / rich text / image embeds in comments.
- Editing a comment after posting.
- Nested replies beyond one level (no reply-to-reply).
- Upvotes/reactions, comment sorting other than newest-first.
- Notifications to commenters (e.g., "someone replied to you").
- Reporting/flagging UI, moderator role beyond post author.
- Real-time updates (websockets/polling) — page reload / refetch is enough.

## Assumptions

- The app already has authentication (session/user available server-side and
  client-side) and a `User` model with at least `id`, `name`/`display name`,
  and `email`.
- There is an existing `Post` model with an `id` and an `authorId` (or
  equivalent) linking it to the `User` who wrote it.
- Prisma is already configured with a working `DATABASE_URL` and migration
  workflow (`prisma migrate dev` / `prisma migrate deploy`).
- Resend is already integrated for transactional email elsewhere in the app
  (an existing `sendEmail`-style helper and API key exist); this plan reuses
  that integration rather than introducing Resend from scratch.
- Rate limiting can be implemented in Postgres (counting recent rows) for v1;
  a dedicated store like Redis is not assumed to be available. If one exists,
  Feature 07 notes it as an alternative.
- "Author of the blog post" means the single `authorId` on `Post`; multi-author
  posts are out of scope.

## High-Level Data Model

```
Comment {
  id              String   @id @default(uuid())
  postId          String
  authorId        String
  parentId        String?     // null = top-level comment; non-null = reply
  body            String      // plain text, <= 2000 chars
  isDeleted       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author          User     @relation(fields: [authorId], references: [id])
  parent          Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies         Comment[] @relation("CommentReplies")

  @@index([postId, parentId, createdAt])
  @@index([authorId, createdAt])
}
```

Constraint enforced in application code (not DB): a reply's `parentId` must
point to a comment whose own `parentId` is null (i.e., max depth = 1).

## Feature Breakdown

| # | Feature | File |
|---|---------|------|
| 1 | Data model & migration | `features/01-data-model-schema.md` |
| 2 | Post a comment | `features/02-post-comment.md` |
| 3 | View comments (newest-first, paginated) | `features/03-view-comments-pagination.md` |
| 4 | Nested replies (one level) | `features/04-nested-replies.md` |
| 5 | Delete a comment (soft delete) | `features/05-delete-comment.md` |
| 6 | Email notification to post author | `features/06-email-notification.md` |
| 7 | Spam protection (rate limit + banned words) | `features/07-spam-protection.md` |

Suggested build order: 1 → 2 → 3 → 4 → 5 → 7 → 6 (email can be built in
parallel with 5/7 once the `Comment` model exists, since it only depends on
comment creation).

## Cross-Cutting Acceptance Criteria

- All comment-mutating endpoints require an authenticated session; anonymous
  requests get 401.
- All new UI matches the existing blog's design system/typography (see
  project `DESIGN.md` if present).
- No feature introduces a new external service beyond what's already in the
  plan (Postgres/Prisma, Resend).
- Database changes ship as Prisma migrations (`prisma migrate dev` to
  generate, committed migration SQL), never `prisma db push`.
