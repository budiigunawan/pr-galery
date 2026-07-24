# Requirements

## Overview

We are adding a comments system to our blog, built on Next.js and Postgres via
Prisma. Logged-in readers will be able to comment on blog posts and reply one
level deep to other comments. The system needs to support moderation (soft
delete that preserves thread structure), keep post authors informed of new
activity via email, and include basic protections against spam and abuse. The
goal is a self-contained, production-ready comments feature that fits into the
existing blog's data model, auth, and email infrastructure.

## Goals

- Let authenticated readers post plain-text comments on a blog post.
- Support one level of nested replies (reply to a comment, no reply-to-reply).
- Show comments newest-first, paginated 20 at a time.
- Let a post's author delete any comment on their post; let comment authors
  delete their own comments.
- Preserve thread structure on delete by rendering `[deleted]` instead of
  removing the row.
- Notify the post author by email (via Resend) when a new comment or reply is
  posted on their post.
- Apply basic spam protection: a per-user rate limit and a banned-word filter
  with an inline validation error.

## Non-Goals

- Markdown or rich-text formatting in comments (plain text only for v1).
- Reply-to-reply / arbitrary nesting depth (only one level of replies).
- Notifying other commenters (e.g. "someone replied to your comment") — only
  the post author is notified.
- Comment editing (not mentioned in the plan; only creation and deletion are
  in scope).
- Upvoting/reactions, comment reporting/flagging UI, or moderator dashboards.
- Real-time updates (e.g. websockets/polling for live new comments).
- Advanced spam/abuse tooling (CAPTCHA, ML-based spam detection, IP-based
  throttling) beyond the fixed-word filter and per-user rate limit specified.

## Assumptions & Constraints

- **Stack**: Next.js + Postgres via Prisma (existing project conventions
  assumed for API routes / route handlers and Prisma client usage — exact
  paths should be confirmed against the actual codebase during
  implementation since this plan was written without repo access).
- An existing authentication system already identifies the logged-in user and
  exposes the current user's ID server-side; this plan does not design auth.
- An existing `Post` (or equivalent) Prisma model exists with an `authorId`
  (or equivalent) relation; this plan assumes it can be extended with a
  comments relation.
- An existing email service integration with Resend is already in place
  (per the plan: "via our existing email service (Resend)"); this plan adds a
  new notification trigger to it rather than building Resend integration from
  scratch.
- Rate limit state (5 comments per user per 10 minutes) needs a shared,
  server-side store. This plan assumes Postgres (via a table) is acceptable
  for this unless the codebase already has Redis or another shared cache
  available — see Feature 05 for the specific assumption and fallback.
- Banned-word list is a simple static/config-driven list for v1 (no admin UI
  to manage it), since the plan only specifies "a simple banned-word filter."
- Max comment length is a hard 2000-character limit, enforced both
  client-side (inline error) and server-side (authoritative).
- "Nested replies" applies only to top-level comments — a reply itself cannot
  receive further replies (enforced at write time, not just in the UI).

## Feature Index

| # | Feature | Summary |
|---|---------|---------|
| 01 | [Comment Data Model & Migrations](features/01%20-%20comment-data-model.md) | Prisma schema for comments, replies, and soft-delete state |
| 02 | [Comment Submission](features/02%20-%20comment-submission.md) | Authenticated create endpoint + form for top-level comments and one-level replies |
| 03 | [Comment Display & Pagination](features/03%20-%20comment-display-and-pagination.md) | Newest-first, paginated (20/page) comment list with nested reply rendering and `[deleted]` placeholders |
| 04 | [Comment Deletion](features/04%20-%20comment-deletion.md) | Soft delete by post author or comment author, preserving thread structure |
| 05 | [Spam & Abuse Protection](features/05%20-%20spam-and-abuse-protection.md) | Per-user rate limiting (5 / 10 min) and banned-word filter with inline error |
| 06 | [New Comment Email Notification](features/06%20-%20comment-email-notification.md) | Notify the post author by email (Resend) on new comments and replies |

## Open Questions

- Exact location of the existing Prisma schema file, API route conventions
  (Route Handlers vs. older API routes), and existing email-sending utility
  were not available (no codebase was provided) — implementers should adapt
  the file paths named in each feature to match the actual repo layout.
- Should the banned-word filter be case-insensitive and match substrings or
  whole words only? This plan assumes case-insensitive whole-word matching;
  confirm before implementation if precision matters (e.g. avoiding false
  positives like "class" containing a substring match).
- Is there an existing rate-limiting utility/library or shared cache (e.g.
  Redis/Upstash) already in the project? This plan assumes a Postgres-backed
  counter as the default and calls it out explicitly in Feature 05 so it can
  be swapped if a better primitive already exists.
- Should post authors be notified about comments/replies on their own post
  when they themselves are the commenter (self-comment)? This plan assumes
  no email is sent in that case, to avoid self-notification noise, but this
  wasn't specified.
